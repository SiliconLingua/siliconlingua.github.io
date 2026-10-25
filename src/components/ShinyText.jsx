import { useEffect, useRef, useState } from "react";
import "./ShinyText.css";

export default function ShinyText({
  children,
  text,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  speed = 3.6,
  delay = 0,
  angle = 110,
  trigger = "loop",
  disabled = false,
  className = "",
  style,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    trigger === "loop" || (trigger === "view" && typeof IntersectionObserver === "undefined"),
  );
  const content = children ?? text;

  useEffect(() => {
    const element = ref.current;
    if (!element || trigger !== "view" || disabled || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled, trigger]);

  const active = !disabled && visible && trigger !== "hover";

  return (
    <span
      ref={ref}
      className={`shiny-text${active ? " shiny-text--active" : ""}${trigger === "view" ? " shiny-text--view" : ""}${trigger === "hover" ? " shiny-text--hover" : ""}${className ? ` ${className}` : ""}`}
      style={{
        "--shiny-base": color,
        "--shiny-light": shineColor,
        "--shiny-angle": `${angle}deg`,
        "--shiny-duration": `${Math.max(0.8, speed)}s`,
        "--shiny-delay": `${Math.max(0, delay)}s`,
        ...style,
      }}
    >
      {content}
    </span>
  );
}
