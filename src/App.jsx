import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, Copy, Hand } from "lucide-react";
import BlurText from "./components/BlurText/BlurText";
import CardNav from "./components/CardNav/CardNav";
import CardSwap from "./components/CardSwap";
import FadeContent from "./components/FadeContent";
import GlassSurface from "./components/GlassSurface/GlassSurface";
import StarBorder from "./components/StarBorder";
import ViewportBackground from "./components/ViewportBackground";
import PageNavigation from "./components/PageNavigation";
import SpotlightCard from "./components/SpotlightCard/SpotlightCard";

const AeroShards = lazy(() => import("./components/AeroShards"));
const ColorBends = lazy(() => import("./components/ColorBends"));
const GhostFibers = lazy(() => import("./components/GhostFibers"));
const GradientBlinds = lazy(() => import("./components/GradientBlinds"));
const MagicRings = lazy(() => import("./components/MagicRings"));
const Particles = lazy(() => import("./components/ReactBitsParticles/Particles"));
const SlicedWaves = lazy(() => import("./components/SlicedWaves/SlicedWaves"));
const WebThreads = lazy(() => import("./components/WebThreads/WebThreads"));

const brandImage = `${import.meta.env.BASE_URL}bg.png`;
const memberAccents = ["#7bdbdf", "#b9a0f1", "#eac484", "#a3d9ac", "#eda4bf"];

const copy = {
  zh: {
    nav: {
      home: "首页",
      about: "关于我们",
      members: "我们的成员",
      projects: "我们的项目",
      more: "了解更多",
      studio: "星际工作室",
      team: "团队介绍",
      model: "大语言模型",
      lmlab: "LMLab",
      progress: "正在开发",
      join: "加入我们",
      partners: "我们的合作伙伴",
      contact: "联系方式",
    },
    labels: {
      about: "ABOUT US / 02",
      members: "OUR MEMBERS / 03",
      lmlab: "LMLAB / 04",
      model: "OUR LANGUAGE MODEL / 05",
      progress: "IN PROGRESS / 06",
      community: "COMMUNITY / 07",
      partners: "OUR PARTNERS / 08",
    },
    hero: {
      title: "硅芯智语科技",
      english: "We Are SiliconLingua",
      tagline: "赋科技以智能，赋硅基以生命",
    },
    about: {
      title: "我们是硅芯智语",
      lines: [
        "一个由高中生组成的科技团队",
        "隶属于 XINGJI Studio，",
        "正在进行 AI 等方面的开源项目开发",
        "欢迎每一个志同道合的朋友加入",
      ],
      imageAlt: "SiliconLingua 与 XINGJI Studio 标识",
    },
    members: {
      title: "我们的成员",
      subtitle: "Our Members",
      roles: [
        "总工程师，团队负责人",
        "星际工作室 CEO",
        "核心开发者",
        "核心开发者",
        "核心开发者",
        "核心开发者",
        "核心开发者",
        "核心开发者",
        "核心开发者",
        "核心开发者",
        "开发者",
        "开发者",
        "开发者",
        "外部协作者",
        "外部协作者",
      ],
    },
    lmlab: {
      title: "LMLab",
      english: "LOCAL MODEL LAB",
      description:
        "LMLab 是基于 PyTorch 的本地模型开发平台，以项目、资产、训练配方、运行、推理与评估组织工作。",
      buttons: ["Github", "CNB", "Gitee", "了解更多"],
      imageAlt: "LMLab 本地模型开发平台界面",
    },
    model: {
      title: "我们的 LLM",
      name: "SiliconLingua-S1",
      pending: "（敬请期待）",
      description: "基于 Qwen3-4B 微调而成，提升数学与推理能力，将全量开源",
      buttons: ["ModelScope", "Hugging Face", "了解更多"],
    },
    progress: {
      title: ["正在开发，", "敬请期待"],
      hand: "EMG 肌电仿生义肢手",
      book: "我们的书籍",
      bookDescription: "从计算机基础到人工智能的 AI 实战图解",
    },
    join: {
      title: "加入我们",
      english: "JOIN US",
      description: "我们欢迎每一位志同道合的朋友加入",
      qq: "请使用 QQ 加入社区群聊 202515095",
      copied: "QQ群号已复制：202515095",
    },
    partners: { title: "我们的合作伙伴" },
    footer: { brand: "硅芯智语", english: "SILICONLINGUA" },
    controls: { menu: "主导航", open: "打开菜单", close: "关闭菜单" },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      members: "Our Members",
      projects: "Projects",
      more: "Explore",
      studio: "XINGJI Studio",
      team: "Team",
      model: "Language Model",
      lmlab: "LMLab",
      progress: "In Progress",
      join: "Join Us",
      partners: "Partners",
      contact: "Contact",
    },
    labels: {
      about: "ABOUT US / 02",
      members: "OUR MEMBERS / 03",
      lmlab: "LMLAB / 04",
      model: "OUR LANGUAGE MODEL / 05",
      progress: "IN PROGRESS / 06",
      community: "COMMUNITY / 07",
      partners: "OUR PARTNERS / 08",
    },
    hero: {
      title: "We are SiliconLingua",
      english: "A student-led technology team",
      tagline: "Giving technology intelligence. Giving silicon life.",
    },
    about: {
      title: "We are SiliconLingua",
      lines: [
        "A technology team built by high school students",
        "A part of XINGJI Studio,",
        "building open-source projects in AI and beyond",
        "Everyone curious and committed is welcome",
      ],
      imageAlt: "SiliconLingua and XINGJI Studio marks",
    },
    members: {
      title: "Our Members",
      subtitle: "我们的成员",
      roles: [
        "Chief engineer, team lead",
        "CEO, XINGJI Studio",
        "Core developer",
        "Core developer",
        "Core developer",
        "Core developer",
        "Core developer",
        "Core developer",
        "Core developer",
        "Core developer",
        "Developer",
        "Developer",
        "Developer",
        "External collaborator",
        "External collaborator",
      ],
    },
    lmlab: {
      title: "LMLab",
      english: "LOCAL MODEL LAB",
      description:
        "LMLab is a local model development platform built on PyTorch, organizing projects, assets, recipes, runs, inference and evaluation.",
      buttons: ["Github", "CNB", "Gitee", "Learn more"],
      imageAlt: "LMLab local model development platform interface",
    },
    model: {
      title: "Our LLM",
      name: "SiliconLingua-S1",
      pending: "(coming soon)",
      description:
        "Fine-tuned from Qwen3-4B to improve mathematical reasoning, with a fully open release planned.",
      buttons: ["ModelScope", "Hugging Face", "Learn more"],
    },
    progress: {
      title: ["In progress,", "coming soon"],
      hand: "EMG bionic prosthetic hand",
      book: "Our book",
      bookDescription: "A visual AI guide from computer fundamentals to applied practice",
    },
    join: {
      title: "Join Us",
      english: "加入我们",
      description: "We welcome everyone who wants to build and learn together",
      qq: "Join our community on QQ · 202515095",
      copied: "QQ group copied · 202515095",
    },
    partners: { title: "Our Partners" },
    footer: { brand: "SiliconLingua", english: "SILICONLINGUA" },
    controls: { menu: "Main navigation", open: "Open menu", close: "Close menu" },
  },
};

const members = [
  ["码宇（Nathan）", "nathan"],
  ["人朝的小郭同学", "guo"],
  ["希", "xi"],
  ["METQL", "metql"],
  ["EcoSpace", "ecospace"],
  ["龙雀awa", "longqueawa"],
  ["Amia", "amia"],
  ["Liziyu352_", "liziyu352"],
  ["狗修金的乖狐狸", "gouxiu"],
  ["Qi", "qi"],
  ["Tydecent", "tydecent"],
  ["介子气实验室", "jieziqi"],
  ["Patrick 2026", "patrick2026"],
  ["批扎狗", "pizhagou"],
  ["EMPET", "empet"],
];

const partners = [
  { name: "XINGJI Studio", logo: `${import.meta.env.BASE_URL}1.png` },
  { name: "HGSpace Studio", logo: `${import.meta.env.BASE_URL}2.png` },
  { name: "537 工作室", logo: `${import.meta.env.BASE_URL}3.png` },
  { name: "AuronaLabs", logo: `${import.meta.env.BASE_URL}4.png` },
];

const pageIds = [
  "top",
  "team",
  "members",
  "lmlab",
  "llm",
  "in-progress",
  "join-us",
  "partners",
];

function SectionLabel({ children }) {
  return (
    <GlassSurface
      className="section-label"
      width="auto"
      height={32}
      borderRadius={8}
      brightness={52}
      opacity={0.9}
      blur={10}
      backgroundOpacity={0.06}
      saturation={1.3}
      displace={1}
      distortionScale={-90}
      mixBlendMode="screen"
    >
      <p className="section-eyebrow">{children}</p>
    </GlassSurface>
  );
}

function ActionButton({ children, className = "", ...props }) {
  return (
    <StarBorder
      className={`action-star ${className}`}
      color="#d8faff"
      trailColor="#8d5cff"
      duration={4.5}
      thickness={1}
      radius={10}
      trailLength={0.24}
      stars={1}
      glow={0.75}
      sparkle
      hover="brighten"
      {...props}
    >
      {children}
    </StarBorder>
  );
}

function App() {
  const [language, setLanguage] = useState("zh");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  const t = copy[language];
  const pages = useMemo(
    () =>
      pageIds.map((id, index) => ({
        id,
        label:
          id === "top"
            ? t.nav.home
            : id === "team"
              ? t.nav.about
              : id === "members"
                ? t.nav.members
                : id === "lmlab"
                  ? t.nav.lmlab
                  : id === "llm"
                    ? t.nav.model
                    : id === "in-progress"
                      ? t.nav.progress
                      : id === "join-us"
                        ? t.nav.join
                        : t.nav.partners,
        index,
      })),
    [t],
  );

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyQQ = async () => {
    try {
      await navigator.clipboard.writeText("202515095");
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const navigationItems = useMemo(() => [
    {
      label: t.nav.studio,
      textColor: "#fff",
      links: [{ label: t.nav.studio, icon: "✦", href: "#top", ariaLabel: t.nav.studio }],
    },
    {
      label: t.nav.about,
      textColor: "#fff",
      links: [
        { label: t.nav.team, href: "#team", ariaLabel: t.nav.team },
        { label: t.nav.members, href: "#members", ariaLabel: t.nav.members },
      ],
    },
    {
      label: t.nav.projects,
      textColor: "#fff",
      links: [
        { label: t.nav.model, href: "#llm", ariaLabel: t.nav.model },
        { label: t.nav.lmlab, href: "#lmlab", ariaLabel: t.nav.lmlab },
        { label: t.nav.progress, href: "#in-progress", ariaLabel: t.nav.progress },
      ],
    },
    {
      label: t.nav.more,
      textColor: "#fff",
      links: [
        { label: t.nav.join, href: "#join-us", ariaLabel: t.nav.join },
        { label: t.nav.partners, href: "#partners", ariaLabel: t.nav.partners },
        { label: t.nav.contact, href: "#join-us", ariaLabel: t.nav.contact },
      ],
    },
  ], [t]);

  return (
    <main className="landing-page">
      <CardNav
        items={navigationItems}
        baseColor="rgba(8, 6, 20, 0.46)"
        menuColor="#fff"
        language={language}
        onLanguageChange={setLanguage}
        logoAlt={t.footer.brand}
        labels={t.controls}
      />

      <PageNavigation pages={pages} language={language} />

      <ViewportBackground
        className="background-layer"
        component={ColorBends}
        colors={["#1c20e6", "#ad66c6", "#482483"]}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0.7}
        parallax={0.5}
        noise={0.3}
        iterations={1}
        intensity={1.5}
        bandWidth={2.5}
        transparent
        autoRotate={1}
      />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <BlurText
            key={`hero-title-${language}`}
            text={t.hero.title}
            keepWordsTogether={language === "en"}
            delay={120}
            animateBy="letters"
            direction="top"
            className="hero-title hero-title-cn"
          />
          <BlurText
            key={`hero-english-${language}`}
            text={t.hero.english}
            delay={language === "en" ? 24 : 75}
            keepWordsTogether
            animateBy="letters"
            direction="top"
            className="hero-title hero-title-en"
          />
          <BlurText
            key={`hero-tagline-${language}`}
            text={t.hero.tagline}
            delay={language === "en" ? 16 : 105}
            animateBy="letters"
            direction="bottom"
            keepWordsTogether={language === "en"}
            className="hero-tagline"
          />
        </div>
      </section>

      <section className="about-section page-section" id="team" aria-labelledby="about-title">
        <ViewportBackground
          className="about-aurora"
          component={SlicedWaves}
          color1="#8e08ff"
          color2="#ba10ff"
          color3="#8500f0"
          ribbons={3}
          spacing={15}
          perspective={0.45}
          blur={2}
          glow={1}
          position={0.76}
          mouseInteraction
          barWidth={0.45}
          amplitude={0.08}
          frequency={1.45}
          speed={0.35}
          grain={0.09}
          fade={0.55}
          opacity={0.65}
        />
        <div className="section-wash" aria-hidden="true" />
        <FadeContent as="div" className="about-content section-content" threshold={0.12} stagger={110}>
          <div className="about-copy">
            <SectionLabel>{t.labels.about}</SectionLabel>
            <h2 id="about-title" className="sr-only">{t.nav.about}</h2>
            <BlurText
              key={`about-title-${language}`}
              text={t.about.title}
              delay={80}
              animateBy="letters"
              direction="top"
              keepWordsTogether={language === "en"}
              className="about-title"
            />
            <div className="about-lines">
              {t.about.lines.map((line) => (
                <BlurText
                  key={`${language}-${line}`}
                  text={line}
                  delay={35}
                  animateBy="letters"
                  direction="bottom"
                  keepWordsTogether={language === "en"}
                  className="about-line"
                />
              ))}
            </div>
          </div>
          <div className="about-visual">
            <GlassSurface
              className="about-glass"
              width="100%"
              height="auto"
              borderRadius={8}
              borderWidth={0.08}
              brightness={62}
              opacity={0.86}
              blur={13}
              backgroundOpacity={0.08}
              saturation={1.25}
              displace={2}
              distortionScale={-120}
              mixBlendMode="screen"
            >
              <img className="about-image" src={brandImage} alt={t.about.imageAlt} />
            </GlassSurface>
          </div>
        </FadeContent>
      </section>

      <section className="members-section page-section" id="members" aria-labelledby="members-title">
        <ViewportBackground
          className="members-grid-background"
          component={AeroShards}
          shardColor="#9cc9ff"
          accentColor="#38bdf8"
          placement="left"
          material="glass"
          markers="plus"
          count={1300}
          depthOfField={0.75}
          vignette={0.3}
          mouseInteraction
          pulseOnClick
          holdToGather
          spread={1.2}
          speed={0.8}
          parallax={1}
          onError={(error) => console.error("AeroShards WebGPU initialization failed:", error)}
        />
        <div className="members-wash" aria-hidden="true" />
        <FadeContent as="div" className="members-content section-content" threshold={0.12} stagger={65}>
          <div className="members-heading">
            <SectionLabel>{t.labels.members}</SectionLabel>
            <h2 id="members-title">{t.members.title}</h2>
            <p>{t.members.subtitle}</p>
          </div>
          <ul className="members-grid">
            {members.map(([name, handle], index) => (
              <li key={handle} style={{ "--member-accent": memberAccents[index % memberAccents.length] }}>
                <SpotlightCard className="member-card">
                  <div className="member-row">
                    <div className="member-avatar" aria-hidden="true">
                      <img src={brandImage} alt="" loading="lazy" />
                      <span>{name.slice(0, 1)}</span>
                    </div>
                    <div className="member-info">
                      <h3>{name}</h3>
                      <p>{t.members.roles[index]}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </li>
            ))}
          </ul>
        </FadeContent>
      </section>

      <section className="lmlab-section page-section" id="lmlab" aria-labelledby="lmlab-title">
        <ViewportBackground
          className="lmlab-background"
          component={GhostFibers}
          glowColor="#3612ff"
          lineColor="#31ffff"
          secondaryColor="#8670eb"
          rotation={18}
          rollSpeed={0.1}
          layers={3}
          waves={1}
          twist={1.2}
          threads={72}
          flow={0.2}
          fiberStyle="dots"
          depthOfField={0.8}
          particles={1}
          sparkle={0.2}
          foldGlow={1.6}
          glow={2}
          brightness={2}
          vignette={0.5}
          grain={0.16}
          mouseInteraction
          hoverEffect="focus"
          intro
          pulseOnClick
        />
        <div className="lmlab-wash" aria-hidden="true" />
        <FadeContent as="div" className="lmlab-content section-content" threshold={0.12} stagger={120}>
          <div className="lmlab-copy">
            <SectionLabel>{t.labels.lmlab}</SectionLabel>
            <p className="lmlab-kicker">{t.lmlab.english}</p>
            <h2 id="lmlab-title">{t.lmlab.title}</h2>
            <p className="lmlab-description">{t.lmlab.description}</p>
            <div className="lmlab-actions" aria-label={t.lmlab.title}>
              {t.lmlab.buttons.map((label) => (
                <ActionButton key={label}>{label}</ActionButton>
              ))}
            </div>
          </div>
          <div className="lmlab-visual">
            <CardSwap
              className="lmlab-card-swap"
              width={460}
              height={306}
              cardDistance={42}
              verticalDistance={48}
              depth={72}
              skewAmount={3}
              visibleCards={3}
              delay={3600}
              cardRadius={14}
              hoverSpread={0.08}
              dim={0.45}
              items={[
                { title: "LMLab · Overview", image: `${import.meta.env.BASE_URL}lmlab-overview.png`, alt: t.lmlab.imageAlt },
                { title: "LMLab · Assets", image: `${import.meta.env.BASE_URL}lmlab-assets.png`, alt: t.lmlab.imageAlt },
                { title: "LMLab · Runs", image: `${import.meta.env.BASE_URL}lmlab-runs.png`, alt: t.lmlab.imageAlt },
              ]}
            />
          </div>
        </FadeContent>
      </section>

      <section className="llm-section page-section" id="llm" aria-labelledby="llm-title">
        <ViewportBackground
          className="llm-background"
          component={WebThreads}
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.2}
          threadCount={6}
          frequency={5}
          spread={0.18}
          taper={1}
          position={0.5}
          fanMode="center"
          glow={0.025}
          falloff={0.6}
          thickness={1.1}
          brightness={0.8}
          opacity={1}
          mirror
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.8}
        />
        <div className="llm-wash" aria-hidden="true" />
        <FadeContent as="div" className="llm-content section-content" threshold={0.16} stagger={72}>
          <SectionLabel>{t.labels.model}</SectionLabel>
          <h2 id="llm-title">{t.model.title}</h2>
          <p className="llm-name">{t.model.name} <span>{t.model.pending}</span></p>
          <p className="llm-description">{t.model.description}</p>
          <div className="llm-actions" aria-label={t.model.title}>
            {t.model.buttons.map((label) => <ActionButton key={label}>{label}</ActionButton>)}
          </div>
        </FadeContent>
      </section>

      <section className="developing-section page-section" id="in-progress" aria-labelledby="developing-title">
        <ViewportBackground
          className="developing-background"
          component={Particles}
          particleColors={["#cbdce6", "#eae0ff", "#b2fdec"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={85}
          glow={1.3}
          twinkle={0.3}
          moveParticlesOnHover
          particleHoverFactor={1.35}
          hoverEffect="parallax"
          sizeRandomness={1.35}
          shape="sparkle"
          connections
        />
        <div className="developing-wash" aria-hidden="true" />
        <FadeContent as="div" className="developing-content section-content" threshold={0.12} stagger={110}>
          <div className="developing-heading">
            <SectionLabel>{t.labels.progress}</SectionLabel>
            <h2 id="developing-title"><span>{t.progress.title[0]}</span><span>{t.progress.title[1]}</span></h2>
          </div>
          <div className="developing-projects">
            <article className="developing-card">
              <Hand className="project-icon" size={36} strokeWidth={1.3} aria-hidden="true" />
              <h3>{t.progress.hand}</h3>
            </article>
            <article className="developing-card book-content">
              <BookOpen className="project-icon" size={36} strokeWidth={1.3} aria-hidden="true" />
              <h3>{t.progress.book}</h3>
              <p>{t.progress.bookDescription}</p>
            </article>
          </div>
        </FadeContent>
      </section>

      <section className="join-section page-section" id="join-us" aria-labelledby="join-title">
        <ViewportBackground
          className="join-background"
          component={GradientBlinds}
          gradientColors={["#b95bd4", "#5227FF"]}
          angle={20}
          blindCount={18}
          blindMinWidth={70}
          spotlightRadius={0.3}
          shine={0.4}
          relief={0.5}
          glow={0.4}
          sway={0.35}
          hoverTilt={0.6}
          clickEffect="ripple"
          noise={0.3}
          lightColor="#d1d1ff"
          spotlightSoftness={1.1}
          spotlightOpacity={0.4}
          mouseDampening={0.2}
        />
        <div className="join-wash" aria-hidden="true" />
        <FadeContent as="div" className="join-content section-content" threshold={0.16} stagger={95}>
          <SectionLabel>{t.labels.community}</SectionLabel>
          <h2 id="join-title">{t.join.title}</h2>
          <p className="join-english">{t.join.english}</p>
          <p className="join-description">{t.join.description}</p>
          <ActionButton className="qq-copy-button" onClick={copyQQ} aria-live="polite">
            {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            <span>{copied ? t.join.copied : t.join.qq}</span>
          </ActionButton>
        </FadeContent>
      </section>

      <section className="partners-section page-section" id="partners" aria-labelledby="partners-title">
        <ViewportBackground
          className="partners-background"
          component={MagicRings}
          color="#7dd3fc"
          colorTwo="#d8b4fe"
          ringCount={7}
          motion="breathe"
          speed={0.42}
          lineThickness={1.7}
          glow={1.2}
          baseRadius={0.28}
          radiusStep={0.1}
          expansion={0.08}
          taper={1.3}
          rotation={10}
          tilt={8}
          dispersion={0.22}
          grain={0.04}
          opacity={0.9}
          followMouse
          mouseInfluence={0.23}
          hoverScale={1.18}
          hoverIntensity={1.2}
          parallax={0.04}
          clickBurst
          intro
        />
        <div className="partners-wash" aria-hidden="true" />
        <FadeContent as="div" className="partners-content section-content" threshold={0.12} stagger={100}>
          <div className="partners-heading">
            <SectionLabel>{t.labels.partners}</SectionLabel>
            <h2 id="partners-title">{t.partners.title}</h2>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <article className="partner-card" key={partner.name}>
                <div className="partner-card-content">
                  <div className="partner-logo-frame">
                    <img className="partner-logo" src={partner.logo} alt={`${partner.name} Logo`} loading="lazy" decoding="async" />
                  </div>
                  <div className="partner-meta">
                    <span className="partner-number">0{index + 1}</span>
                    <h3>{partner.name}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </FadeContent>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>{t.footer.brand}</span>
        </div>
        <span className="footer-center">{t.footer.english}</span>
        <span className="footer-year">© 2026</span>
      </footer>
    </main>
  );
}

export default App;
