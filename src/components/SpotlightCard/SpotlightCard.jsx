import { useEffect, useRef } from "react";
import "./SpotlightCard.css";

export default function SpotlightCard({ children, className = "", ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const move = (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
      element.style.setProperty("--spotlight-opacity", "1");
    };
    const leave = () => element.style.setProperty("--spotlight-opacity", "0");

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={`spotlight-card${className ? ` ${className}` : ""}`} {...props}>
      <span className="spotlight-card__light" aria-hidden="true" />
      <span className="spotlight-card__edge" aria-hidden="true" />
      {children}
    </div>
  );
}
