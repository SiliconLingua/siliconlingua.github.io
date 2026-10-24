"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
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
  const cardTints = ["#163b40", "#263852", "#2b4032", "#41344e"];
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);
  const openRef = useRef(false);
  const contentId = useId();
  useLayoutEffect(() => {
    const nav = navRef.current;
    const content = contentRef.current;
    const height = () => 60 + content.scrollHeight;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const cards = cardsRef.current.filter(Boolean);
    gsap.set(nav, { height: 60 });
    gsap.set(cards, { y: 16, autoAlpha: 0 });
    timelineRef.current = gsap
      .timeline({
        paused: true,
        onReverseComplete: () => {
          if (!openRef.current) {
            gsap.set(nav, { height: 60 });
            setExpanded(false);
          }
        },
      })
      .to(nav, { height, duration: reduced ? 0 : 0.52, ease: "power3.inOut" })
      .to(
        cards,
        {
          y: 0,
          autoAlpha: 1,
          duration: reduced ? 0 : 0.46,
          stagger: reduced ? 0 : 0.055,
          ease,
        },
        reduced ? 0 : "-=0.24",
      );
    const resize = () => {
      if (openRef.current) {
        gsap.to(nav, {
          height: height(),
          duration: reduced ? 0 : 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(content);
    window.addEventListener("resize", resize);
    return () => {
      timelineRef.current?.kill();
      gsap.killTweensOf(nav);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [ease]);
  const changeMenu = (next) => {
    openRef.current = next;
    setOpen(next);
    if (next) {
      setExpanded(true);
      timelineRef.current?.invalidate().play();
      return;
    }

    const timeline = timelineRef.current;
    if (!timeline || timeline.progress() === 0) {
      gsap.set(navRef.current, { height: 60 });
      setExpanded(false);
      return;
    }
    timeline.reverse();
  };

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsidePointer = (event) => {
      if (!navRef.current?.contains(event.target)) changeMenu(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      changeMenu(false);
      navRef.current?.querySelector(".hamburger-menu")?.focus();
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${expanded ? "open" : ""}`}
        aria-label={labels.menu || "主导航"}
      >
        <GlassSurface
          className="card-nav-glass"
          width="100%"
          height="100%"
          borderRadius={14}
          borderWidth={0.08}
          brightness={48}
          opacity={0.92}
          blur={15}
          displace={0.35}
          backgroundOpacity={0.14}
          saturation={1.35}
          distortionScale={-72}
          greenOffset={5}
          blueOffset={10}
          mixBlendMode="screen"
          style={{ pointerEvents: "none" }}
        />
        <div className="card-nav-top">
          <button
            type="button"
            className={`hamburger-menu ${open ? "open" : ""}`}
            onClick={() => changeMenu(!openRef.current)}
            aria-label={open ? labels.close || "关闭菜单" : labels.open || "打开菜单"}
            aria-expanded={open}
            aria-controls={contentId}
            style={{ color: menuColor }}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <a
            className="logo-container"
            href="#top"
            aria-label={logoAlt}
            onClick={() => changeMenu(false)}
          >
            <img src={`${import.meta.env.BASE_URL}bg.png`} alt="logo" className="logo-mark" />
          </a>
          <div className="card-nav-controls" aria-label="语言 / Language">
            <button
              type="button"
              className={`nav-setting ${language === "en" ? "active" : ""}`}
              onClick={() => onLanguageChange?.("en")}
              aria-pressed={language === "en"}
            >
              en
            </button>
            <span className="nav-setting-divider">|</span>
            <button
              type="button"
              className={`nav-setting ${language === "zh" ? "active" : ""}`}
              onClick={() => onLanguageChange?.("zh")}
              aria-pressed={language === "zh"}
            >
              zh
            </button>
          </div>
        </div>
        <div
          id={contentId}
          ref={contentRef}
          className="card-nav-content"
          aria-hidden={!open}
          inert={!open}
        >
          {(items || []).map((item, index) => (
            <div
              className="nav-card"
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{ "--nav-tint": cardTints[index % cardTints.length] }}
            >
              <GlassSurface
                className="nav-card-glass"
                width="100%"
                height="100%"
                borderRadius={11}
                borderWidth={0.08}
                brightness={45}
                opacity={0.94}
                blur={12}
                displace={0.25}
                backgroundOpacity={0.18}
                saturation={1.3}
                distortionScale={-48}
                greenOffset={4}
                blueOffset={8}
                mixBlendMode="screen"
                enabled={open}
              >
                <div className="nav-card-body">
                  <div className="nav-card-label">{item.label}</div>
                  <div className="nav-card-links">
                    {item.links?.map((link) => (
                      <a
                        key={link.label}
                        className="nav-card-link"
                        href={link.href}
                        aria-label={link.ariaLabel}
                        onClick={() => changeMenu(false)}
                      >
                        {index === 0 ? (
                          <Star size={16} aria-hidden="true" />
                        ) : (
                          <ArrowUpRight size={16} aria-hidden="true" />
                        )}
                        <span>{link.label}</span>
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
