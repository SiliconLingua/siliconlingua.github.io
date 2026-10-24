import { useEffect, useRef } from "react";

const ENTER = [
  {
    opacity: 0,
    filter: "blur(10px)",
    transform: "translate3d(0, 22px, 0) scale(0.985)",
  },
  {
    opacity: 1,
    filter: "blur(0px)",
    transform: "translate3d(0, 0, 0) scale(1)",
  },
];

export default function FadeContent({
  as: Element = "div",
  children,
  className = "",
  delay = 0,
  stagger = 90,
  duration = 680,
  threshold = 0.2,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches || !("IntersectionObserver" in window)) {
      return undefined;
    }

    let animations = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      const targets = Array.from(element.children);
      const prefersLowMotion = motionQuery.matches;
      if (!targets.length || prefersLowMotion) {
        observer.disconnect();
        return;
      }

      animations = targets.map((target, index) => {
        const animation = target.animate(ENTER, {
          duration,
          delay: delay + stagger * index,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        });
        animation.onfinish = () => animation.cancel();
        return animation;
      });
      observer.unobserve(element);
    }, {
      threshold,
      rootMargin: "0px 0px -6% 0px",
    });

    const stopForReducedMotion = (event) => {
      if (!event.matches) return;
      animations.forEach((animation) => animation.cancel());
      observer.disconnect();
    };

    observer.observe(element);
    motionQuery.addEventListener("change", stopForReducedMotion);
    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", stopForReducedMotion);
      animations.forEach((animation) => animation.cancel());
    };
  }, [delay, duration, stagger, threshold]);

  return (
    <Element ref={ref} className={className} {...props}>
      {children}
    </Element>
  );
}
