import { memo, Suspense, useEffect, useRef, useState } from "react";
import useReducedMotionProfile from "../utils/useReducedMotionProfile";
import "./ViewportBackground.css";

const ViewportBackground = memo(function ViewportBackground({
  component: Background,
  className,
  ...props
}) {
  const ref = useRef(null);
  const unmountTimerRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotionProfile();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const target = ref.current?.closest("section") ?? ref.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.clearTimeout(unmountTimerRef.current);
          setMounted(true);
        } else {
          // Retain a just-exited GPU scene briefly so a quick swipe back does
          // not destroy and recompile its WebGL/WebGPU context.
          unmountTimerRef.current = window.setTimeout(() => setMounted(false), 1800);
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      window.clearTimeout(unmountTimerRef.current);
    };
  }, [reducedMotion]);

  const colors = props.colors ?? props.gradientColors ?? [
    props.color1 ?? props.glowColor ?? props.color ?? props.shardColor ?? "#5227ff",
    props.color2 ?? props.secondaryColor ?? props.colorTwo ?? props.accentColor ?? "#ad66c6",
  ];

  return (
    <div
      className={`${className ?? ""}${reducedMotion ? " viewport-background--lite" : ""}`}
      style={reducedMotion ? { "--background-primary": colors[0], "--background-accent": colors[1] ?? colors[0] } : undefined}
      data-motion-profile={reducedMotion ? "reduced" : "full"}
      ref={ref}
      aria-hidden="true"
    >
      {!reducedMotion && mounted && (
        <Suspense fallback={null}>
          <Background {...props} />
        </Suspense>
      )}
    </div>
  );
});

export default ViewportBackground;
