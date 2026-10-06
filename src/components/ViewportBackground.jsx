import { memo, Suspense, useEffect, useRef, useState } from "react";

const ViewportBackground = memo(function ViewportBackground({
  component: Background,
  className,
  ...props
}) {
  const ref = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearViewport(entry.isIntersecting);
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(ref.current.closest("section") ?? ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={ref} aria-hidden="true">
      {nearViewport && (
        <Suspense fallback={null}>
          <Background {...props} />
        </Suspense>
      )}
    </div>
  );
});

export default ViewportBackground;
