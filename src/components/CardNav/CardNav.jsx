"use client";
import { useId, useLayoutEffect, useRef, useState } from "react";
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
  theme = "dark",
  language = "zh",
  onThemeChange,
  onLanguageChange,
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
    const height = () => 60 + content.offsetHeight;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const create = () => {
      gsap.set(nav, { height: 60 });
      gsap.set(cardsRef.current, { y: 20, opacity: 0 });
      return gsap
        .timeline({ paused: true, onReverseComplete: () => setExpanded(false) })
        .to(nav, { height, duration: reduced ? 0 : 0.35, ease })
        .to(
          cardsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: reduced ? 0 : 0.3,
            stagger: reduced ? 0 : 0.045,
            ease,
          },
          reduced ? 0 : "-=0.2",
        );
    };
    timelineRef.current = create();
    const resize = () => {
      timelineRef.current.kill();
      timelineRef.current = create();
      if (openRef.current) timelineRef.current.progress(1);
    };
    window.addEventListener("resize", resize);
    return () => {
      timelineRef.current?.kill();
      window.removeEventListener("resize", resize);
    };
  }, [ease, items]);
  const changeMenu = (next) => {
    openRef.current = next;
    setOpen(next);
    if (next) {
      setExpanded(true);
      timelineRef.current?.play();
    } else timelineRef.current?.reverse();
  };
  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${expanded ? "open" : ""}`}
        aria-label="主导航"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            changeMenu(false);
            navRef.current.querySelector(".hamburger-menu").focus();
          }
        }}
      >
        <GlassSurface
          className="card-nav-glass"
          width="100%"
          height={60}
          borderRadius={8}
          backgroundOpacity={0.1}
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
            className={`hamburger-menu ${open ? "open" : ""}`}
            onClick={() => changeMenu(!openRef.current)}
            aria-label={open ? "关闭菜单" : "打开菜单"}
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
            <span className="logo-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="logo-text">硅芯智语</span>
          </a>
          <div className="card-nav-controls" aria-label="显示与语言设置">
            <button
              type="button"
              className={`nav-setting ${theme === "light" ? "active" : ""}`}
              onClick={() => onThemeChange?.("light")}
              aria-pressed={theme === "light"}
            >
              明
            </button>
            <span className="nav-setting-divider">|</span>
            <button
              type="button"
              className={`nav-setting ${theme === "dark" ? "active" : ""}`}
              onClick={() => onThemeChange?.("dark")}
              aria-pressed={theme === "dark"}
            >
              暗
            </button>
            <span className="nav-setting-divider">·</span>
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
              key={`${item.label}-${index}`}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{ "--nav-tint": cardTints[index % cardTints.length] }}
            >
              <GlassSurface
                className="nav-card-glass"
                enabled={expanded}
                width="100%"
                height="100%"
                borderRadius={8}
                borderWidth={0.08}
                brightness={50}
                opacity={0.9}
                blur={7}
                backgroundOpacity={0.16}
                saturation={1.15}
                displace={0.4}
                distortionScale={-45}
                greenOffset={4}
                blueOffset={8}
                mixBlendMode="screen"
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
