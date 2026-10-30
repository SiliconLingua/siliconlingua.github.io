import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { REDUCED_MOTION_QUERY, prefersReducedMotion } from '../src/utils/motionProfile.js';
import { getAdaptiveDpr } from '../src/utils/renderingBudget.js';

test('only an explicit reduced-motion preference switches the motion profile', () => {
  assert.equal(REDUCED_MOTION_QUERY, '(prefers-reduced-motion: reduce)');
  assert.equal(prefersReducedMotion(), false);
});

test('save-data does not remove visual effects, while reduced motion is respected', (t) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let matches = false;
  const browser = {
    devicePixelRatio: 3,
    matchMedia: (query) => {
      assert.equal(query, REDUCED_MOTION_QUERY);
      return { matches };
    },
    navigator: { connection: { saveData: true } },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: browser });
  t.after(() => previous ? Object.defineProperty(globalThis, 'window', previous) : delete globalThis.window);
  assert.equal(prefersReducedMotion(), false);
  matches = true;
  assert.equal(prefersReducedMotion(), true);
});

test('touch rendering reduces backing pixels, not the visual effect', (t) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let compact = true;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      devicePixelRatio: 3,
      matchMedia: () => ({ matches: compact }),
    },
  });
  t.after(() => previous ? Object.defineProperty(globalThis, 'window', previous) : delete globalThis.window);

  assert.equal(getAdaptiveDpr(390, 844), 1.5);
  assert.ok(getAdaptiveDpr(1200, 2000) < 1);
  compact = false;
  assert.equal(getAdaptiveDpr(390, 844), 2);
});

test('background shader mounts on touch and pauses its own animation offscreen', () => {
  const source = readFileSync(new URL('../src/components/ViewportBackground.jsx', import.meta.url), 'utf8');
  assert.ok(source.includes('if (reducedMotion) return undefined;'));
  assert.ok(source.includes('!reducedMotion && mounted'));
  assert.ok(source.includes('rootMargin: "800px 0px"'));
  assert.ok(source.includes('setTimeout(() => setMounted(false), 1800)'));
});

test('touch devices retain text, card and page transition animations', () => {
  const blurText = readFileSync(new URL('../src/components/BlurText/BlurText.jsx', import.meta.url), 'utf8');
  const animatedContent = readFileSync(new URL('../src/components/AnimatedContent.jsx', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const navigation = readFileSync(new URL('../src/components/PageNavigation.jsx', import.meta.url), 'utf8');

  assert.ok(blurText.includes('animate={reducedMotion ? finalSnapshot : inView ? animateKeyframes : fromSnapshot}'));
  assert.ok(animatedContent.includes('gsap.registerPlugin(ScrollTrigger)'));
  assert.ok(app.includes('autoplay={!reducedMotion}'));
  assert.ok(app.includes('intro={!reducedMotion}'));
  assert.ok(navigation.includes('{!reducedMotion && <div ref={transitionRef} className="page-transition"'));
  assert.ok(navigation.includes('section.scrollIntoView'));
  assert.ok(navigation.includes('if (initialRouteHandledRef.current) return;'));
});

test('mobile scroll remains touch-native without forced snap', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.ok(css.includes('html { scroll-snap-type: none; }'));
  assert.ok(!css.includes('.member-list-row { animation: none; }'));
  assert.ok(!css.includes('.page-transition { display: none; }'));
});
