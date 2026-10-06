// Keep animation time continuous across viewport and tab visibility changes.
export function startVisibleAnimation(element, render, { maxFps = 60 } = {}) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const frameInterval = 1000 / Math.max(1, maxFps);
  let inView = false;
  let frame = 0;
  let previousTime = null;
  let elapsed = 0;
  let mode = null;
  let stopped = false;

  const tick = (time) => {
    frame = 0;
    if (stopped || !inView || document.hidden || motionQuery.matches) return;
    if (previousTime !== null && time - previousTime < frameInterval - 0.5) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const delta =
      previousTime === null ? 0 : Math.min(time - previousTime, 100);
    previousTime = time;
    elapsed += delta;
    render(elapsed, delta);
    if (!stopped) frame = requestAnimationFrame(tick);
  };

  const sync = () => {
    const active = inView && !document.hidden;
    const nextMode = active
      ? motionQuery.matches ? "static" : "running"
      : "paused";
    if (stopped || mode === nextMode) return;
    mode = nextMode;
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
    element.dataset.animationState = mode;
    if (!active) return;
    render(elapsed, 0);
    if (!motionQuery.matches) frame = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio > 0;
      sync();
    },
    { threshold: [0, 0.001] },
  );
  // Transformed backgrounds may extend beyond their section's visible bounds.
  observer.observe(element.closest?.("section") ?? element);
  document.addEventListener("visibilitychange", sync);
  motionQuery.addEventListener("change", sync);
  element.dataset.animationState = "paused";

  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    motionQuery.removeEventListener("change", sync);
    delete element.dataset.animationState;
  };
}
