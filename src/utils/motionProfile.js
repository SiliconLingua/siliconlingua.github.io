// Touch devices and compact screens prioritize scrolling over decorative GPU work.
export const LIGHTWEIGHT_MOTION_QUERY = '(max-width: 1200px), (pointer: coarse), (prefers-reduced-motion: reduce)';

export function prefersLightweightMotion() {
  return typeof window !== 'undefined' && (
    window.matchMedia(LIGHTWEIGHT_MOTION_QUERY).matches ||
    window.navigator.connection?.saveData === true
  );
}
