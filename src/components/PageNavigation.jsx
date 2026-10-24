import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import LineSidebar from "./LineSidebar/LineSidebar";
import "./PageNavigation.css";

const PAGE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function PageNavigation({ pages, language = "zh" }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const targetRef = useRef(null);
  const tweenRef = useRef(null);
  const entranceRef = useRef(null);
  const transitionRef = useRef(null);
  const routeTokenRef = useRef(0);
  const scrollValueRef = useRef({ y: 0 });

  const clearRouteMotion = useCallback(() => {
    document.documentElement.classList.remove("page-route-moving");
  }, []);

  const playReveal = useCallback((index, previous) => {
    const section = document.getElementById(pages[index]?.id);
    const content = section?.querySelector(".section-content, .hero-copy");
    if (!content?.animate) return;

    entranceRef.current?.cancel();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const direction = previous < index ? 1 : -1;
    entranceRef.current = content.animate(
      [
        {
          opacity: 0.08,
          filter: "blur(16px) saturate(1.35)",
          transform: `translate3d(0, ${direction * 64}px, 0) scale(0.9) rotateX(${direction * -3}deg)`,
          clipPath: direction > 0 ? "inset(18% 0 0 0 round 18px)" : "inset(0 0 18% 0 round 18px)",
        },
        {
          opacity: 0.72,
          filter: "blur(4px) saturate(1.1)",
          transform: `translate3d(0, ${direction * -8}px, 0) scale(1.015) rotateX(${direction * 1}deg)`,
          clipPath: "inset(0 0 0 0 round 0px)",
          offset: 0.68,
        },
        {
          opacity: 1,
          filter: "blur(0px) saturate(1)",
          transform: "translate3d(0, 0, 0) scale(1) rotateX(0deg)",
          clipPath: "inset(0 0 0 0 round 0px)",
        },
      ],
      {
        duration: 1120,
        easing: PAGE_EASE,
        fill: "both",
      },
    );
  }, [pages]);

  const setCurrentPage = useCallback((index, revealFrom = activeRef.current) => {
    const previous = revealFrom;
    activeRef.current = index;
    setActive(index);
    playReveal(index, previous);
  }, [playReveal]);

  const revealRoute = useCallback((token) => {
    const overlay = transitionRef.current;
    if (!overlay || token !== routeTokenRef.current) {
      clearRouteMotion();
      return;
    }

    const reveal = overlay.animate(
      [
        {
          opacity: 1,
          clipPath: "circle(150% at 50% 50%)",
          transform: "scale(1.04) rotate(2deg)",
        },
        {
          opacity: 0.92,
          clipPath: "circle(72% at 50% 50%)",
          transform: "scale(1) rotate(0deg)",
          offset: 0.28,
        },
        {
          opacity: 0,
          clipPath: "circle(0% at 50% 50%)",
          transform: "scale(0.84) rotate(-5deg)",
        },
      ],
      {
        duration: 820,
        easing: PAGE_EASE,
        fill: "both",
      },
    );

    reveal.finished
      .catch(() => undefined)
      .then(() => {
        if (token === routeTokenRef.current) clearRouteMotion();
      });
  }, [clearRouteMotion]);

  const coverRoute = useCallback((callback, token) => {
    const overlay = transitionRef.current;
    if (!overlay) {
      callback();
      revealRoute(token);
      return;
    }

    overlay.getAnimations().forEach((animation) => animation.cancel());
    const cover = overlay.animate(
      [
        {
          opacity: 0,
          clipPath: "circle(0% at 50% 50%)",
          transform: "scale(0.84) rotate(-5deg)",
        },
        {
          opacity: 0.96,
          clipPath: "circle(150% at 50% 50%)",
          transform: "scale(1.04) rotate(2deg)",
        },
      ],
      {
        duration: 430,
        easing: PAGE_EASE,
        fill: "both",
      },
    );

    cover.finished
      .catch(() => undefined)
      .then(() => {
        if (token !== routeTokenRef.current) return;
        callback();
        requestAnimationFrame(() => revealRoute(token));
      });
  }, [revealRoute]);

  const turnPage = useCallback((index) => {
    const nextIndex = Math.max(0, Math.min(pages.length - 1, index));
    const page = pages[nextIndex];
    const section = page && document.getElementById(page.id);
    if (!section || nextIndex === activeRef.current && targetRef.current === null) return;

    const previousIndex = targetRef.current ?? activeRef.current;
    const currentScroll = window.scrollY;
    const top = Math.max(0, currentScroll + section.getBoundingClientRect().top);
    const distanceInViewports = Math.abs(top - currentScroll) / Math.max(window.innerHeight, 1);
    const isLongJump = distanceInViewports > 1.2;
    const token = routeTokenRef.current + 1;
    routeTokenRef.current = token;

    tweenRef.current?.kill();
    tweenRef.current = null;
    transitionRef.current?.getAnimations().forEach((animation) => animation.cancel());
    targetRef.current = nextIndex;
    activeRef.current = nextIndex;
    setActive(nextIndex);
    entranceRef.current?.cancel();
    document.documentElement.classList.add("page-route-moving");
    window.history.replaceState(null, "", `#${page.id}`);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top, left: 0, behavior: "auto" });
      targetRef.current = null;
      clearRouteMotion();
      setCurrentPage(nextIndex, previousIndex);
      return;
    }

    if (isLongJump) {
      coverRoute(() => {
        if (token !== routeTokenRef.current) return;
        window.scrollTo({ top, left: 0, behavior: "auto" });
        targetRef.current = null;
        setCurrentPage(nextIndex, previousIndex);
      }, token);
      return;
    }

    scrollValueRef.current.y = currentScroll;
    tweenRef.current = gsap.to(scrollValueRef.current, {
      y: top,
      duration: Math.min(1.08, 0.62 + distanceInViewports * 0.2),
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => window.scrollTo({ top: scrollValueRef.current.y, left: 0, behavior: "auto" }),
      onComplete: () => {
        if (token !== routeTokenRef.current) return;
        tweenRef.current = null;
        targetRef.current = null;
        window.scrollTo({ top, left: 0, behavior: "auto" });
        clearRouteMotion();
        setCurrentPage(nextIndex, previousIndex);
      },
    });
  }, [clearRouteMotion, coverRoute, pages, setCurrentPage]);

  useEffect(() => {
    const sections = pages
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;

    const updateActive = () => {
      const center = window.innerHeight / 2;
      const nearest = sections.reduce((best, section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = center < rect.top
          ? rect.top - center
          : center > rect.bottom
            ? center - rect.bottom
            : 0;
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Infinity });

      if (targetRef.current !== null || nearest.index === activeRef.current) return;
      setCurrentPage(nearest.index, activeRef.current);
    };

    const observeSections = () => {
      observer?.disconnect();
      const inset = Math.max(0, Math.round((window.innerHeight - 48) / 2));
      observer = new IntersectionObserver((entries) => {
        if (targetRef.current !== null) return;
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!entering) return;
        const index = sections.indexOf(entering.target);
        if (index !== -1 && index !== activeRef.current) {
          setCurrentPage(index, activeRef.current);
        }
      }, {
        rootMargin: `-${inset}px 0px -${inset}px 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      });

      sections.forEach((section) => observer.observe(section));
      updateActive();
    };

    const interruptScroll = () => {
      if (targetRef.current === null && !tweenRef.current) return;
      routeTokenRef.current += 1;
      tweenRef.current?.kill();
      tweenRef.current = null;
      transitionRef.current?.getAnimations().forEach((animation) => animation.cancel());
      targetRef.current = null;
      clearRouteMotion();
      updateActive();
    };

    const onKeyDown = (event) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        interruptScroll();
      }
    };

    const onAnchorClick = (event) => {
      if (event.defaultPrevented) return;
      const anchor = event.target.closest?.("a[href^='#']");
      if (!anchor || anchor.target === "_blank") return;
      const index = pages.findIndex(({ id }) => `#${id}` === anchor.getAttribute("href"));
      if (index === -1) return;
      event.preventDefault();
      turnPage(index);
    };

    const onHashChange = () => {
      const index = pages.findIndex(({ id }) => `#${id}` === window.location.hash);
      if (index !== -1) turnPage(index);
    };

    let initialRouteFrame = requestAnimationFrame(() => {
      onHashChange();
    });

    observeSections();
    window.addEventListener("resize", observeSections);
    window.addEventListener("wheel", interruptScroll, { passive: true });
    window.addEventListener("touchstart", interruptScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("hashchange", onHashChange);
    reducedMotion.addEventListener("change", interruptScroll);

    return () => {
      cancelAnimationFrame(initialRouteFrame);
      observer?.disconnect();
      tweenRef.current?.kill();
      tweenRef.current = null;
      targetRef.current = null;
      routeTokenRef.current += 1;
      transitionRef.current?.getAnimations().forEach((animation) => animation.cancel());
      entranceRef.current?.cancel();
      clearRouteMotion();
      window.removeEventListener("resize", observeSections);
      window.removeEventListener("wheel", interruptScroll);
      window.removeEventListener("touchstart", interruptScroll);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("hashchange", onHashChange);
      reducedMotion.removeEventListener("change", interruptScroll);
    };
  }, [clearRouteMotion, pages, setCurrentPage, turnPage]);

  return (
    <>
      <div ref={transitionRef} className="page-transition" aria-hidden="true" />
      <LineSidebar
        className="page-navigation"
        items={pages.map(({ label }) => label)}
        activeIndex={active}
        showIndex
        showMarker
        proximityRadius={150}
        maxShift={12}
        markerLength={23}
        markerGap={8}
        itemGap={12}
        fontSize={0.76}
        smoothing={190}
        accentColor="#b8f0f3"
        textColor="rgba(232, 244, 248, 0.62)"
        markerColor="rgba(207, 231, 238, 0.38)"
        ariaLabel={language === "en" ? "Page navigation" : "页面导航"}
        onItemClick={(index) => turnPage(index)}
      />
    </>
  );
}
