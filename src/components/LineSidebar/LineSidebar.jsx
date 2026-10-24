import { useCallback, useEffect, useRef, useState } from "react";
import "./LineSidebar.css";

const FALL_OFF = {
  linear: (value) => value,
  smooth: (value) => value * value * (3 - 2 * value),
  sharp: (value) => value * value * value,
};

export default function LineSidebar({
  items = [],
  accentColor = "#a7e8f0",
  textColor = "rgba(239, 247, 250, 0.68)",
  markerColor = "rgba(214, 232, 240, 0.4)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 120,
  maxShift = 14,
  falloff = "smooth",
  markerLength = 24,
  markerGap = 10,
  tickScale = 0.42,
  scaleTick = true,
  itemGap = 13,
  fontSize = 0.78,
  smoothing = 180,
  defaultActive = null,
  activeIndex,
  onItemClick,
  className = "",
  ariaLabel = "Page navigation",
}) {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  const activeRef = useRef(defaultActive);
  const smoothingRef = useRef(smoothing);
  const [internalActive, setInternalActive] = useState(defaultActive);
  const selectedIndex = activeIndex === undefined ? internalActive : activeIndex;

  activeRef.current = selectedIndex;
  smoothingRef.current = smoothing;

  const runFrame = useCallback((now) => {
    const elapsed = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = now;
    const timeConstant = Math.max(smoothingRef.current, 1) / 1000;
    const blend = 1 - Math.exp(-elapsed / timeConstant);
    let moving = false;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      const target = Math.max(
        targetsRef.current[index] || 0,
        activeRef.current === index ? 1 : 0,
      );
      const current = currentRef.current[index] || 0;
      const next = current + (target - current) * blend;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[index] = value;
      element.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    });

    frameRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const value = Math.max(
          targetsRef.current[index] || 0,
          activeRef.current === index ? 1 : 0,
        );
        currentRef.current[index] = value;
        element.style.setProperty("--effect", value.toFixed(4));
      });
      return;
    }

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    lastFrameRef.current = performance.now();
    frameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (event) => {
      const list = listRef.current;
      if (!list) return;
      const bounds = list.getBoundingClientRect();
      const pointerY = event.clientY - bounds.top;
      const radius = Math.max(proximityRadius, 1);
      const curve = FALL_OFF[falloff] || FALL_OFF.linear;

      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const center = element.offsetTop + element.offsetHeight / 2;
        const proximity = Math.max(0, 1 - Math.abs(pointerY - center) / radius);
        targetsRef.current[index] = curve(proximity);
      });
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = items.map(() => 0);
    startLoop();
  }, [items, startLoop]);

  const handleItemClick = useCallback(
    (index, label) => {
      if (activeIndex === undefined) setInternalActive(index);
      onItemClick?.(index, label);
    },
    [activeIndex, onItemClick],
  );

  useEffect(() => {
    startLoop();
  }, [selectedIndex, startLoop]);

  useEffect(() => {
    if (selectedIndex == null || !window.matchMedia("(max-width: 680px)").matches) return;
    const list = listRef.current;
    const item = itemRefs.current[selectedIndex];
    if (!list || !item) return;

    const listBounds = list.getBoundingClientRect();
    const itemBounds = item.getBoundingClientRect();
    const inset = 12;
    let nextScrollLeft = list.scrollLeft;

    if (itemBounds.left < listBounds.left + inset) {
      nextScrollLeft += itemBounds.left - listBounds.left - inset;
    } else if (itemBounds.right > listBounds.right - inset) {
      nextScrollLeft += itemBounds.right - listBounds.right + inset;
    }

    if (nextScrollLeft !== list.scrollLeft) {
      list.scrollTo({
        left: nextScrollLeft,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, [selectedIndex]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? " line-sidebar--markers" : ""}${scaleTick ? " line-sidebar--scale-tick" : ""}${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
      style={{
        "--accent-color": accentColor,
        "--text-color": textColor,
        "--marker-color": markerColor,
        "--marker-length": `${markerLength}px`,
        "--marker-gap": `${markerGap}px`,
        "--tick-scale": tickScale,
        "--max-shift": `${maxShift}px`,
        "--item-gap": `${itemGap}px`,
        "--font-size": `${fontSize}rem`,
        "--smoothing": `${smoothing}ms`,
      }}
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="line-sidebar__item"
          >
            <button
              className="line-sidebar__button"
              type="button"
              aria-current={selectedIndex === index ? "page" : undefined}
              onClick={() => handleItemClick(index, label)}
            >
              {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
              <span className="line-sidebar__label">
                {showIndex && (
                  <span className="line-sidebar__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="line-sidebar__text">{label}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
