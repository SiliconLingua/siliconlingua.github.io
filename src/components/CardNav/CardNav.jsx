"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import GlassSurface from "../GlassSurface/GlassSurface";
import "./CardNav.css";

const CardNav = ({
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  menuColor = "#fff",
  language = "zh",
  onLanguageChange,
  labels = {},
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);
  const expandedRef = useRef(false);

  const calculateHeight = () => {
    const nav = navRef.current;
    const content = contentRef.current;
    if (!nav || !content) return 260;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (!mobile) return 260;

    const previous = {
      visibility: content.style.visibility,
      pointerEvents: content.style.pointerEvents,
      position: content.style.position,
      height: content.style.height,
    };
    content.style.visibility = "visible";
    content.style.pointerEvents = "auto";
    content.style.position = "static";
    content.style.height = "auto";
    content.offsetHeight;
    const desiredHeight = 60 + content.scrollHeight + 16;
    Object.assign(content.style, previous);

    return Math.min(desiredHeight, window.innerHeight - 24);
  };

  const createTimeline = () => {
    const nav = navRef.current;
    if (!nav) return null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = cardsRef.current.filter(Boolean);
    gsap.set(nav, { height: 60, overflow: "hidden" });
    gsap.set(cards, { y: 50, opacity: 0 });

    const timeline = gsap.timeline({ paused: true });
    timeline.to(nav, {
      height: calculateHeight,
      duration: reducedMotion ? 0 : 0.4,
      ease,
    });
    timeline.to(
      cards,
      {
        y: 0,
        opacity: 1,
        duration: reducedMotion ? 0 : 0.4,
        ease,
        stagger: reducedMotion ? 0 : 0.08,
      },
      reducedMotion ? 0 : "-=0.1",
    );

    return timeline;
  };

  useLayoutEffect(() => {
    timelineRef.current = createTimeline();
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
    // Match web2: rebuild only when easing changes, not while bilingual labels rerender.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (expandedRef.current) {
        const height = calculateHeight();
        gsap.set(navRef.current, { height });
        timelineRef.current?.kill();
        const timeline = createTimeline();
        if (timeline) {
          timeline.progress(1);
          timelineRef.current = timeline;
        }
      } else {
        timelineRef.current?.kill();
        timelineRef.current = createTimeline();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, ease]);

  const toggleMenu = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    if (!expandedRef.current) {
      expandedRef.current = true;
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      timeline.play(0);
      return;
    }

    expandedRef.current = false;
    setIsHamburgerOpen(false);
    timeline.eventCallback("onReverseComplete", () => {
      if (!expandedRef.current) setIsExpanded(false);
    });
    timeline.reverse();
  };

  useEffect(() => {
    if (!isExpanded) return undefined;

    const closeOnOutsidePointer = (event) => {
      if (!navRef.current?.contains(event.target)) toggleMenu();
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      toggleMenu();
      navRef.current?.querySelector(".hamburger-menu")?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        aria-label={labels.menu || "主导航"}
      >
        <GlassSurface
          className="card-nav-glass"
          width="100%"
          height="100%"
          borderRadius={12}
          backgroundOpacity={0.08}
          brightness={52}
          opacity={0.9}
          blur={12}
          displace={0}
          distortionScale={-90}
          mixBlendMode="screen"
          style={{ pointerEvents: "none" }}
        />

        <div className="card-nav-top">
          <button
            type="button"
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={isExpanded ? labels.close || "关闭菜单" : labels.open || "打开菜单"}
            aria-expanded={isExpanded}
            aria-controls="card-nav-content"
            style={{ color: menuColor }}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <a className="logo-container" href="#top" aria-label={logoAlt}>
            <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
            <span className="logo-text">{logoAlt}</span>
          </a>

          <div className="card-nav-controls" aria-label="语言 / Language">
            <button
              type="button"
              className={`nav-setting ${language === "en" ? "active" : ""}`}
              onClick={() => onLanguageChange?.("en")}
              aria-pressed={language === "en"}
            >en</button>
            <span className="nav-setting-divider" aria-hidden="true">|</span>
            <button
              type="button"
              className={`nav-setting ${language === "zh" ? "active" : ""}`}
              onClick={() => onLanguageChange?.("zh")}
              aria-pressed={language === "zh"}
            >zh</button>
          </div>
        </div>

        <div
          id="card-nav-content"
          ref={contentRef}
          className="card-nav-content"
          aria-hidden={!isExpanded}
          inert={!isExpanded}
        >
          {(items || []).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="nav-card"
              ref={(element) => { cardsRef.current[index] = element; }}
              style={{ "--nav-tint": item.bgColor || ["#5b3b82", "#356084", "#514e8a", "#754b82"][index % 4] }}
            >
              <GlassSurface
                className="nav-card-glass"
                width="100%"
                height="100%"
                borderRadius={9}
                borderWidth={0.08}
                brightness={56}
                opacity={0.92}
                blur={11}
                displace={0.12}
                backgroundOpacity={0.15}
                saturation={1.25}
                distortionScale={-34}
                mixBlendMode="screen"
                enabled={isExpanded}
              >
                <GlassSurface
                  className="nav-card-glass-inner"
                  width="100%"
                  height="100%"
                  borderRadius={7}
                  borderWidth={0.06}
                  brightness={68}
                  opacity={0.9}
                  blur={8}
                  displace={0.06}
                  backgroundOpacity={0.1}
                  saturation={1.15}
                  distortionScale={-20}
                  mixBlendMode="screen"
                  enabled={isExpanded}
                >
                  <div className="nav-card-body" style={{ color: item.textColor || "#fff" }}>
                    <div className="nav-card-label">{item.label}</div>
                    <div className="nav-card-links">
                      {item.links?.map((link, linkIndex) => (
                        <a
                          key={`${link.label}-${linkIndex}`}
                          className="nav-card-link"
                          href={link.href}
                          aria-label={link.ariaLabel}
                          onClick={() => {
                            if (expandedRef.current) toggleMenu();
                          }}
                        >
                          <span className="nav-card-link-icon" aria-hidden="true">{link.icon || "↗"}</span>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </GlassSurface>
              </GlassSurface>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
