const COMPACT_DEVICE_QUERY = '(max-width: 900px), (pointer: coarse)';

/** Keep the same effects at a touch-appropriate raster resolution. */
export function getAdaptiveDpr(width, height, maxDpr = 2) {
  if (typeof window === 'undefined') return 1;

  const deviceDpr = window.devicePixelRatio || 1;
  const compact = window.matchMedia(COMPACT_DEVICE_QUERY).matches;
  const pixelBudget = compact ? 2_100_000 : Number.POSITIVE_INFINITY;
  const deviceCap = compact ? 1.5 : 2;
  const dimensionCap = Math.sqrt(pixelBudget / Math.max(1, width * height));

  return Math.max(0.75, Math.min(deviceDpr, maxDpr, deviceCap, dimensionCap));
}
