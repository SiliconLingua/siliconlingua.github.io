import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import LineSidebar from "./LineSidebar/LineSidebar";
import "./PageNavigation.css";

export default function PageNavigation({ pages, language = "zh" }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const targetRef = useRef(null);
  const tweenRef = useRef(null);
  const entranceRef = useRef(null);
  const scrollValueRef = useRef({ y: 0 });

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
          opacity: 0.68,
          filter: "blur(4px)",
          transform: `translate3d(0, ${direction * 18}px, 0) scale(0.99)`,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "translate3d(0, 0, 0) scale(1)",
        },
      ],
      {
        duration: 720,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
  }, [pages]);

  const setCurrentPage = useCallback((index, revealFrom = activeRef.current) => {
    const previous = revealFrom;
    activeRef.current = index;
    setActive(index);
    playReveal(index, previous);
  }, [playReveal]);

  const turnPage = useCallback((index) => {
    const nextIndex = Math.max(0, Math.min(pages.length - 1, index));
    const page = pages[nextIndex];
    const section = page && document.getElementById(page.id);
    if (!section) return;

    const previousIndex = targetRef.current ?? activeRef.current;
    tweenRef.current?.kill();
    tweenRef.current = null;
    targetRef.current = nextIndex;
    activeRef.current = nextIndex;
    setActive(nextIndex);
    entranceRef.current?.cancel();

    const top = Math.max(0, window.scrollY + section.getBoundingClientRect().top);
    const distanceInViewports = Math.abs(top - window.scrollY) / Math.max(window.innerHeight, 1);
    const duration = Math.min(1.55, 0.82 + distanceInViewports * 0.14);

    window.history.replaceState(null, "", `#${page.id}`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, top);
      targetRef.current = null;
      setCurrentPage(nextIndex, previousIndex);
      return;
    }

    scrollValueRef.current.y = window.scrollY;
    tweenRef.current = gsap.to(scrollValueRef.current, {
      y: top,
      duration,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => window.scrollTo(0, scrollValueRef.current.y),
      onComplete: () => {
        tweenRef.current = null;
        targetRef.current = null;
        window.scrollTo(0, top);
        setCurrentPage(nextIndex, previousIndex);
      },
    });
  }, [pages, setCurrentPage]);

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
      if (!tweenRef.current) return;
      tweenRef.current.kill();
      tweenRef.current = null;
      targetRef.current = null;
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

    observeSections();
    window.addEventListener("resize", observeSections);
    window.addEventListener("wheel", interruptScroll, { passive: true });
    window.addEventListener("touchstart", interruptScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onAnchorClick);
    reducedMotion.addEventListener("change", interruptScroll);

    return () => {
      observer?.disconnect();
      tweenRef.current?.kill();
      tweenRef.current = null;
      targetRef.current = null;
      entranceRef.current?.cancel();
      window.removeEventListener("resize", observeSections);
      window.removeEventListener("wheel", interruptScroll);
      window.removeEventListener("touchstart", interruptScroll);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onAnchorClick);
      reducedMotion.removeEventListener("change", interruptScroll);
    };
  }, [pages, setCurrentPage, turnPage]);

  return (
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
  );
}
