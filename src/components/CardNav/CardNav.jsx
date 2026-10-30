"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import GlassSurface from "../GlassSurface/GlassSurface";
import "./CardNav.css";
import useReducedMotionProfile from "../../utils/useReducedMotionProfile";

const CardNav = ({
  logoAlt = "Logo",
  logoSrc,
  logoHref = "#top",
  items,
  className = "",
  ease = "power3.out",
  menuColor = "#fff",
  language = "zh",
  onLanguageChange,
  labels = {},
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);
  const expandedRef = useRef(false);
  const reducedMotionProfile = useReducedMotionProfile();

  const calculateHeight = () => {
    const nav = navRef.current;
    const content = contentRef.current;
    if (!nav || !content) return 260;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const navTop = nav.getBoundingClientRect().top;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const safeBottom = Number.parseFloat(getComputedStyle(nav).getPropertyValue("--nav-safe-bottom")) || 0;
    const availableHeight = Math.max(60, viewportHeight - navTop - safeBottom - 12);
    if (!mobile) return Math.min(260, availableHeight);

    const previous = { height: content.style.height, bottom: content.style.bottom };
    Object.assign(content.style, { height: "auto", bottom: "auto" });
    const desiredHeight = 60 + content.scrollHeight + 2;
    Object.assign(content.style, previous);
    return Math.min(desiredHeight, availableHeight);
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
    if (expandedRef.current) timelineRef.current?.progress(1);
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
    // Preserve web2's structure; rebuild only for easing or motion policy changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, reducedMotionProfile]);

  useLayoutEffect(() => {
    let frame = 0;
    const handleResize = () => {
      // Mobile address-bar resize fires throughout a swipe. A closed menu
      // needs no measuring or GSAP timeline rebuild while the page scrolls.
      if (!expandedRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (expandedRef.current) {
          timelineRef.current?.kill();
          const timeline = createTimeline();
          if (timeline) {
            timeline.progress(1);
            timelineRef.current = timeline;
          }
        }
      });
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, ease, reducedMotionProfile]);

  useLayoutEffect(() => {
    if (!expandedRef.current) return;
    timelineRef.current?.kill();
    const timeline = createTimeline();
    if (timeline) {
      timeline.progress(1);
      timelineRef.current = timeline;
    }
    // Rebuild from the collapsed state so reversing still returns to 60px.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const toggleMenu = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    if (!expandedRef.current) {
      timeline.kill();
      timelineRef.current = createTimeline();
      expandedRef.current = true;
      setIsMenuOpen(true);
      setIsExpanded(true);
      timelineRef.current?.play(0);
      return;
    }

    expandedRef.current = false;
    setIsMenuOpen(false);
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
      navRef.current?.querySelector(".menu-trigger")?.focus();
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
            className={`menu-trigger ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={isExpanded ? labels.close || "关闭菜单" : labels.open || "打开菜单"}
            aria-expanded={isExpanded}
            aria-controls="card-nav-content"
            style={{ color: menuColor }}
           >
             <span className="menu-icon" aria-hidden="true">
               <span />
               <span />
               <span />
             </span>
           </button>

          <a className="logo-container" href={logoHref} aria-label={logoAlt}>
            {logoSrc ? <img className="logo-image" src={logoSrc} alt={logoAlt} /> : <span className="logo-text">{logoAlt}</span>}
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
                <div className="nav-card-body" style={{ color: item.textColor || "#fff" }}>
                  <div className="nav-card-label">{item.label}</div>
                  <div className="nav-card-links">
                    {item.links?.map((link, linkIndex) => (
                      <a
                        key={`${link.label}-${linkIndex}`}
                        className="nav-card-link"
                        href={link.href}
                        target={/^https?:\/\//.test(link.href) ? "_blank" : undefined}
                        rel={/^https?:\/\//.test(link.href) ? "noopener noreferrer" : undefined}
                        aria-label={link.ariaLabel}
                        onClick={() => {
                          if (expandedRef.current) toggleMenu();
                        }}
                      >
                        <ArrowUpRight className="nav-card-link-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </GlassSurface>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
