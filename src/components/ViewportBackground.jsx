import { memo, Suspense, useEffect, useRef, useState } from "react";
import useLightweightMotion from "../utils/useLightweightMotion";
import "./ViewportBackground.css";

const ViewportBackground = memo(function ViewportBackground({
  component: Background,
  className,
  ...props
}) {
  const ref = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);
  const lightweight = useLightweightMotion();

  useEffect(() => {
    if (lightweight) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(entry.isIntersecting);
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(ref.current.closest("section") ?? ref.current);
    return () => observer.disconnect();
  }, [lightweight]);

  const colors = props.colors ?? props.gradientColors ?? [
    props.color1 ?? props.glowColor ?? props.color ?? props.shardColor ?? "#5227ff",
    props.color2 ?? props.secondaryColor ?? props.colorTwo ?? props.accentColor ?? "#ad66c6",
  ];

  return (
    <div
      className={`${className ?? ""}${lightweight ? " viewport-background--lite" : ""}`}
      style={lightweight ? { "--background-primary": colors[0], "--background-accent": colors[1] ?? colors[0] } : undefined}
      data-motion-profile={lightweight ? "lightweight" : "full"}
      ref={ref}
      aria-hidden="true"
    >
      {!lightweight && nearViewport && (
        <Suspense fallback={null}>
          <Background {...props} />
        </Suspense>
      )}
    </div>
  );
});

export default ViewportBackground;
