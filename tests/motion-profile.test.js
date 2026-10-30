import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { LIGHTWEIGHT_MOTION_QUERY, prefersLightweightMotion } from '../src/utils/motionProfile.js';

test('lightweight motion covers compact screens, touch and reduced motion', () => {
  for (const condition of ['(max-width: 1200px)', '(pointer: coarse)', '(prefers-reduced-motion: reduce)']) {
    assert.ok(LIGHTWEIGHT_MOTION_QUERY.includes(condition));
  }
});

test('motion policy is safe without a browser', () => {
  assert.equal(prefersLightweightMotion(), false);
});

test('save-data and media preferences select the lightweight path', (t) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const browser = { matchMedia: () => ({ matches: false }), navigator: { connection: { saveData: false } } };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: browser });
  t.after(() => previous ? Object.defineProperty(globalThis, 'window', previous) : delete globalThis.window);
  assert.equal(prefersLightweightMotion(), false);
  browser.navigator.connection.saveData = true;
  assert.equal(prefersLightweightMotion(), true);
  browser.navigator.connection.saveData = false;
  browser.matchMedia = () => ({ matches: true });
  assert.equal(prefersLightweightMotion(), true);
});

test('background modules are never mounted on the lightweight path', () => {
  const source = readFileSync(new URL('../src/components/ViewportBackground.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('if (lightweight) return undefined;'));
  assert.ok(source.includes('!lightweight && nearViewport'));
});

test('touch navigation has no snap or full-screen transition overlay', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.ok(!css.includes('scroll-snap-type: y proximity'));
  const source = readFileSync(new URL('../src/components/PageNavigation.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('section.scrollIntoView'));
  assert.ok(source.includes('!lightweight && <div ref={transitionRef}'));
  assert.ok(!source.includes('nextIndex === activeRef.current && targetRef.current === null'));
  assert.ok(source.includes('if (initialRouteHandledRef.current) return;'));
});
