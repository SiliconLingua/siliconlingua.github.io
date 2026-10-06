import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./PageNavigation.css";

export default function PageNavigation({ pages }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(-1);

  useEffect(() => {
    const sections = pages.map(({ id }) => document.getElementById(id));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    let entrance;

    const observe = () => {
      observer?.disconnect();
      const inset = Math.round(window.innerHeight * 0.45);
      observer = new IntersectionObserver(
        (entries) => {
          const entering = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!entering) return;
          const next = sections.indexOf(entering.target);
          const previous = activeRef.current;
          if (next === previous) return;
          activeRef.current = next;
          setActive(next);
          entrance?.cancel();

          const content = entering.target.querySelector(".section-content, .hero-copy");
          if (previous !== -1 && !motionQuery.matches && content?.animate) {
            // Animate only the content; the live background and glass stay visible.
            entrance = content.animate(
              [
                { transform: `translateY(${next > previous ? 32 : -32}px)` },
                { transform: "translateY(0)" },
              ],
              { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
            );
          }
        },
        { rootMargin: `-${inset}px 0px -${inset}px 0px` },
      );
      sections.forEach((section) => section && observer.observe(section));
    };
    const stopEntrance = () => {
      if (motionQuery.matches || document.hidden) entrance?.cancel();
    };
    observe();
    window.addEventListener("resize", observe);
    motionQuery.addEventListener("change", stopEntrance);
    document.addEventListener("visibilitychange", stopEntrance);
    return () => {
      observer.disconnect();
      entrance?.cancel();
      window.removeEventListener("resize", observe);
      motionQuery.removeEventListener("change", stopEntrance);
      document.removeEventListener("visibilitychange", stopEntrance);
    };
  }, [pages]);

  const turnPage = (index) => {
    const page = pages[index];
    if (!page) return;
    document.getElementById(page.id)?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    window.history.replaceState(null, "", `#${page.id}`);
  };

  return (
    <nav className="page-navigation" aria-label="页面导航">
      <button
        className="page-arrow"
        type="button"
        aria-label="上一页"
        title="上一页"
        disabled={active === 0}
        onClick={() => turnPage(active - 1)}
      >
        <ChevronUp size={18} aria-hidden="true" />
      </button>
      {pages.map((page, index) => (
        <button
          key={page.id}
          className={`page-dot ${active === index ? "active" : ""}`}
          type="button"
          aria-label={page.label}
          aria-current={active === index ? "page" : undefined}
          title={page.label}
          onClick={() => turnPage(index)}
        >
          <span aria-hidden="true" />
        </button>
      ))}
      <button
        className="page-arrow"
        type="button"
        aria-label="下一页"
        title="下一页"
        disabled={active === pages.length - 1}
        onClick={() => turnPage(active + 1)}
      >
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
