import assert from "node:assert/strict";
import { test } from "node:test";
import { startVisibleAnimation } from "../src/utils/visibleAnimation.js";

function environment(t, { section, maxFps } = {}) {
  const frames = new Map();
  const documentEvents = new Map();
  const motionEvents = new Map();
  const query = {
    matches: false,
    addEventListener: (name, handler) => motionEvents.set(name, handler),
    removeEventListener: (name) => motionEvents.delete(name),
  };
  const document = {
    hidden: false,
    addEventListener: (name, handler) => documentEvents.set(name, handler),
    removeEventListener: (name) => documentEvents.delete(name),
  };
  let observe;
  let disconnected = false;
  let observedElement;
  let id = 0;
  const globals = {
    document,
    window: { matchMedia: () => query },
    requestAnimationFrame: (handler) => {
      frames.set(++id, handler);
      return id;
    },
    cancelAnimationFrame: (frame) => frames.delete(frame),
    IntersectionObserver: class {
      constructor(callback) {
        observe = callback;
      }
      observe(element) { observedElement = element; }
      disconnect() {
        disconnected = true;
      }
    },
  };
  for (const [key, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() =>
      previous
        ? Object.defineProperty(globalThis, key, previous)
        : delete globalThis[key],
    );
  }
  const draws = [];
  const element = { dataset: {}, closest: () => section };
  const stop = startVisibleAnimation(element, (time, delta) =>
    draws.push([time, delta]),
    { maxFps },
  );
  return {
    frames,
    draws,
    element,
    query,
    document,
    stop,
    documentEvents,
    motionEvents,
    get disconnected() {
      return disconnected;
    },
    get observedElement() {
      return observedElement;
    },
    visibility: (visible, ratio = visible ? 1 : 0) =>
      observe([{ isIntersecting: visible, intersectionRatio: ratio }]),
    pageVisibility: (hidden) => {
      document.hidden = hidden;
      documentEvents.get("visibilitychange")();
    },
    reducedMotion: (reduced) => {
      query.matches = reduced;
      motionEvents.get("change")();
    },
    step: (time) => {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((handler) => handler(time));
    },
  };
}

test("offscreen backgrounds schedule no frames, and viewport entry resumes them", (t) => {
  const e = environment(t);
  assert.equal(e.frames.size, 0);
  e.visibility(true, 0);
  assert.equal(e.frames.size, 0);
  e.visibility(true);
  assert.equal(e.frames.size, 1);
  e.step(100);
  e.visibility(false);
  assert.equal(e.frames.size, 0);
  assert.equal(e.element.dataset.animationState, "paused");
  e.stop();
});

test("hidden tabs pause and only visible backgrounds resume", (t) => {
  const e = environment(t);
  e.visibility(true);
  e.pageVisibility(true);
  assert.equal(e.frames.size, 0);
  e.pageVisibility(false);
  assert.equal(e.frames.size, 1);
  e.visibility(false);
  e.pageVisibility(true);
  e.pageVisibility(false);
  assert.equal(e.frames.size, 0);
  e.stop();
});

test("animation time does not jump after leaving the viewport", (t) => {
  const e = environment(t);
  e.visibility(true);
  e.step(100);
  e.step(140);
  e.visibility(false);
  e.visibility(true);
  e.step(100000);
  e.step(100040);
  assert.deepEqual(e.draws.at(-1), [80, 40]);
  e.stop();
});

test("reduced motion renders a static frame without an animation loop", (t) => {
  const e = environment(t);
  e.reducedMotion(true);
  e.visibility(true);
  assert.equal(e.draws.length, 1);
  assert.equal(e.frames.size, 0);
  assert.equal(e.element.dataset.animationState, "static");
  e.reducedMotion(false);
  assert.equal(e.frames.size, 1);
  e.stop();
});

test("cleanup cancels queued frames and removes visibility listeners", (t) => {
  const e = environment(t);
  e.visibility(true);
  e.stop();
  assert.equal(e.frames.size, 0);
  assert.equal(e.documentEvents.size, 0);
  assert.equal(e.motionEvents.size, 0);
  assert.equal(e.disconnected, true);
  assert.equal(e.element.dataset.animationState, undefined);
});

test("high-refresh displays do not render backgrounds faster than 60fps", (t) => {
  const e = environment(t);
  e.visibility(true);
  e.step(100);
  const count = e.draws.length;
  e.step(108);
  e.step(112);
  assert.equal(e.draws.length, count);
  e.step(117);
  assert.equal(e.draws.length, count + 1);
  assert.deepEqual(e.draws.at(-1), [17, 17]);
  e.stop();
});

test("repeated viewport notifications preserve the running animation clock", (t) => {
  const e = environment(t);
  e.visibility(true);
  e.step(100);
  e.step(120);
  const count = e.draws.length;
  e.visibility(true, 0.8);
  assert.equal(e.draws.length, count);
  assert.equal(e.frames.size, 1);
  e.step(140);
  assert.deepEqual(e.draws.at(-1), [40, 20]);
  e.stop();
});

test("transformed backgrounds pause when their owning section leaves the viewport", (t) => {
  const section = {};
  const e = environment(t, { section });
  assert.equal(e.observedElement, section);
  e.visibility(true);
  e.step(100);
  e.visibility(false);
  assert.equal(e.frames.size, 0);
  assert.equal(e.element.dataset.animationState, "paused");
  e.stop();
});

test("a slower grid keeps its elapsed time and resumes without a time jump", (t) => {
  const e = environment(t, { maxFps: 30 });
  e.visibility(true);
  e.step(100);
  const count = e.draws.length;
  e.step(116);
  assert.equal(e.draws.length, count);
  e.step(134);
  assert.deepEqual(e.draws.at(-1), [34, 34]);
  e.visibility(false);
  e.visibility(true);
  e.step(10000);
  e.step(10034);
  assert.deepEqual(e.draws.at(-1), [68, 34]);
  e.stop();
});
