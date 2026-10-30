import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLightweightMotion from "../utils/useLightweightMotion";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WIPES = {
  up: "linear-gradient(to top, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  down: "linear-gradient(to bottom, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  left: "linear-gradient(to left, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  right: "linear-gradient(to right, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  center: "radial-gradient(farthest-corner at 50% 50%, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
};

export default function AnimatedContent({
  children,
  as: Element = "div",
  container,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  tilt = 0,
  wipe = "none",
  threshold = 0.1,
  delay = 0,
  stagger = 0,
  staggerFrom = "start",
  trigger = "scroll",
  once = true,
  scrub = false,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power3.in",
  onStart,
  onComplete,
  onDisappearanceComplete,
  className = "",
  style,
  ...props
}) {
  const ref = useRef(null);
  const lightweight = useLightweightMotion();
  const callbacksRef = useRef({ onStart, onComplete, onDisappearanceComplete });
  callbacksRef.current = { onStart, onComplete, onDisappearanceComplete };

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let scroller = container || document.getElementById("snap-main-container") || null;
    if (typeof scroller === "string") scroller = document.querySelector(scroller);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lightweight) {
      // A single compositor-only reveal, not per-child blur/ScrollTrigger work.
      element.style.visibility = "visible";
      if (reducedMotion) {
        callbacksRef.current.onComplete?.();
        return undefined;
      }
      let animation;
      let observer;
      const reveal = () => {
        observer?.disconnect();
        callbacksRef.current.onStart?.();
        animation = element.animate(
          [{ opacity: 0.7, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 280, easing: "ease-out" },
        );
        animation.finished.then(() => callbacksRef.current.onComplete?.()).catch(() => undefined);
      };
      if (trigger === "mount") reveal();
      else {
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) reveal();
        }, { threshold: 0 });
        observer.observe(element);
      }
      return () => { observer?.disconnect(); animation?.cancel(); };
    }
    const context = gsap.context(() => {
      const targets = stagger > 0 && element.children.length
        ? Array.from(element.children)
        : [element];
      const horizontal = direction === "horizontal";
      const axis = horizontal ? "x" : "y";
      const sign = reverse ? -1 : 1;
      const mask = WIPES[wipe];

      gsap.set(element, { visibility: "visible" });
      if (reducedMotion) {
        callbacksRef.current.onComplete?.();
        return;
      }

      const from = {
        [axis]: distance * sign,
        scale,
        opacity: animateOpacity ? initialOpacity : 1,
      };
      const to = {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
      };

      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = "blur(0px)";
      }
      if (rotate) {
        from.rotation = rotate * sign;
        to.rotation = 0;
      }
      if (tilt) {
        const tiltAxis = horizontal ? "rotationY" : "rotationX";
        from[tiltAxis] = horizontal ? -tilt * sign : tilt * sign;
        to[tiltAxis] = 0;
        from.transformPerspective = 900;
        to.transformPerspective = 900;
      }
      if (mask) {
        gsap.set(targets, { "--ac-wipe": 0, maskImage: mask, webkitMaskImage: mask });
        from["--ac-wipe"] = 0;
        to["--ac-wipe"] = 1;
      }
      if (stagger > 0) to.stagger = { each: stagger, from: staggerFrom };

      const timeline = gsap.timeline({
        paused: true,
        onStart: () => callbacksRef.current.onStart?.(),
        onComplete: () => {
          callbacksRef.current.onComplete?.();
          if (!scrub) {
            gsap.set(targets, {
              clearProps: mask
                ? "filter,transform,maskImage,webkitMaskImage,--ac-wipe"
                : "filter,transform",
            });
          }

          if (!once || scrub || disappearAfter <= 0) return;
          const outgoing = {
            [axis]: -distance * sign,
            scale: 0.8,
            opacity: animateOpacity ? initialOpacity : 0,
            delay: disappearAfter,
            duration: disappearDuration,
            ease: disappearEase,
            onComplete: () => callbacksRef.current.onDisappearanceComplete?.(),
          };
          if (blur > 0) outgoing.filter = `blur(${blur}px)`;
          if (stagger > 0) outgoing.stagger = { each: stagger, from: staggerFrom };
          gsap.to(targets, outgoing);
        },
      });

      timeline.fromTo(targets, from, to, scrub ? 0 : Math.max(delay, 0));

      if (trigger === "mount") {
        timeline.play();
        return;
      }

      const start = `top ${(1 - threshold) * 100}%`;
      if (scrub) {
        ScrollTrigger.create({
          trigger: element,
          scroller,
          start,
          end: `top ${Math.max((1 - threshold) * 100 - 45, 5)}%`,
          scrub: scrub === true ? true : Math.max(Number(scrub) || 0, 0.01),
          animation: timeline,
        });
        return;
      }

      ScrollTrigger.create({
        trigger: element,
        scroller,
        start,
        once,
        onEnter: () => timeline.play(),
        onEnterBack: once ? undefined : () => timeline.play(),
        onLeaveBack: once
          ? undefined
          : () => {
              if (mask) gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
              timeline.reverse();
            },
      });
    }, element);

    return () => context.revert();
  }, [
    lightweight,
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    blur,
    rotate,
    tilt,
    wipe,
    threshold,
    delay,
    stagger,
    staggerFrom,
    trigger,
    once,
    scrub,
    disappearAfter,
    disappearDuration,
    disappearEase,
  ]);

  return (
    <Element
      ref={ref}
      className={className}
      style={{ visibility: "hidden", ...style }}
      {...props}
    >
      {children}
    </Element>
  );
}
