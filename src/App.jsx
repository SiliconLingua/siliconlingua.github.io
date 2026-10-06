import { lazy, useEffect, useRef, useState } from "react";
import { BookOpen, Check, Copy, Hand, ImagePlus } from "lucide-react";
import BlurText from "./components/BlurText/BlurText";
import CardNav from "./components/CardNav/CardNav";
import GlassSurface from "./components/GlassSurface/GlassSurface";
import ViewportBackground from "./components/ViewportBackground";
import PageNavigation from "./components/PageNavigation";

const Aurora = lazy(() => import("./components/Aurora/Aurora"));
const FloatingLines = lazy(
  () => import("./components/FloatingLines/FloatingLines"),
);
const ShapeGrid = lazy(() => import("./components/ShapeGrid/ShapeGrid"));
const Particles = lazy(() => import("./components/Particles/Particles"));
const SoftAurora = lazy(() => import("./components/SoftAurora/SoftAurora"));
const WebThreads = lazy(() => import("./components/WebThreads/WebThreads"));

const linesGradient = ["#9728ff", "#1c68c4", "#734696"];
const enabledWaves = ["top", "middle", "bottom"];
const lineCount = [10, 15, 20];
const lineDistance = [8, 6, 4];
const auroraColors = ["#a405ff", "#47d0f5", "#6827ff"];
const particleColors = ["#ffffff", "#dcc8ff", "#8fe8f4"];
const memberAccents = ["#7bdbdf", "#b9a0f1", "#eac484", "#a3d9ac", "#eda4bf"];
const brandImage = `${import.meta.env.BASE_URL}bg.png`;
const pages = [
  { id: "top", label: "首页" },
  { id: "team", label: "关于我们" },
  { id: "members", label: "我们的成员" },
  { id: "llm", label: "大语言模型" },
  { id: "in-progress", label: "正在开发" },
  { id: "join-us", label: "加入我们" },
  { id: "partners", label: "合作伙伴" },
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

const navigationItems = [
  {
    label: "母工作室",
    textColor: "#fff",
    links: [
      {
        label: "星际工作室",
        icon: "✦",
        href: "#star-studio",
        ariaLabel: "星际工作室",
      },
    ],
  },
  {
    label: "关于我们",
    textColor: "#fff",
    links: [
      { label: "团队介绍", href: "#team", ariaLabel: "团队介绍，跳转页面 2" },
      {
        label: "组成成员",
        href: "#members",
        ariaLabel: "组成成员，跳转页面 3",
      },
    ],
  },
  {
    label: "我们的项目",
    textColor: "#fff",
    links: [
      {
        label: "大语言模型",
        href: "#llm",
        ariaLabel: "大语言模型，跳转页面 4",
      },
      { label: "LMlab", href: "#lmlab", ariaLabel: "LMlab，跳转页面 5" },
      {
        label: "正在开发",
        href: "#in-progress",
        ariaLabel: "正在开发，跳转页面 6",
      },
    ],
  },
  {
    label: "了解更多",
    textColor: "#fff",
    links: [
      { label: "加入我们", href: "#join-us", ariaLabel: "加入我们" },
      {
        label: "我们的合作伙伴",
        href: "#partners",
        ariaLabel: "我们的合作伙伴",
      },
      { label: "联系方式", href: "#contact", ariaLabel: "联系方式" },
    ],
  },
];

const members = [
  { name: "码宇（Nathan）", handle: "nathan", title: "总工程师，团队负责人" },
  { name: "人朝的小郭同学", handle: "guo", title: "星际工作室 CEO" },
  { name: "希", handle: "xi", title: "核心开发者" },
  { name: "METQL", handle: "metql", title: "核心开发者" },
  { name: "EcoSpace", handle: "ecospace", title: "核心开发者" },
  { name: "龙雀awa", handle: "longqueawa", title: "核心开发者" },
  { name: "Amia", handle: "amia", title: "核心开发者" },
  { name: "Liziyu352_", handle: "liziyu352", title: "核心开发者" },
  { name: "狗修金的乖狐狸", handle: "gouxiu", title: "核心开发者" },
  { name: "Qi", handle: "qi", title: "核心开发者" },
  { name: "Tydecent", handle: "tydecent", title: "开发者" },
  { name: "介子气实验室", handle: "jieziqi", title: "开发者" },
  { name: "Patrick 2026", handle: "patrick2026", title: "开发者" },
  { name: "批扎狗", handle: "pizhagou", title: "外部协作者" },
  { name: "EMPET", handle: "empet", title: "外部协作者" },
];

const partners = ["XINGJI Studio", "HGSpace Studio", "537工作室", "AuronaLabs"];

function App() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("zh");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
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

  return (
    <main className="landing-page">
      <CardNav
        items={navigationItems}
        baseColor="rgba(8, 6, 20, 0.46)"
        menuColor="#fff"
        theme={theme}
        language={language}
        onThemeChange={setTheme}
        onLanguageChange={setLanguage}
        logoAlt="硅芯智语"
      />

      <PageNavigation pages={pages} />

      <ViewportBackground
        className="background-layer"
        component={FloatingLines}
        enabledWaves={enabledWaves}
        lineCount={lineCount}
        lineDistance={lineDistance}
        bendRadius={5}
        bendStrength={-0.5}
        interactive
        parallax
        parallaxStrength={0.2}
        linesGradient={linesGradient}
        backgroundColor="#05040b"
        mixBlendMode="screen"
      />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <BlurText
            text="我们是硅芯智语"
            delay={120}
            animateBy="letters"
            direction="top"
            className="hero-title hero-title-cn"
          />
          <BlurText
            text="We Are SiliconLingua"
            delay={75}
            animateBy="letters"
            direction="top"
            className="hero-title hero-title-en"
          />
          <BlurText
            text="赋科技以智能，赋硅基以生命"
            delay={105}
            animateBy="letters"
            direction="bottom"
            className="hero-tagline"
          />
        </div>
      </section>

      <section
        className="about-section page-section"
        id="team"
        aria-labelledby="about-title"
      >
        <ViewportBackground
          className="about-aurora"
          component={Aurora}
          colorStops={auroraColors}
          blend={0.5}
          amplitude={1.25}
          speed={0.5}
        />
        <div className="section-wash" aria-hidden="true" />
        <div className="about-content section-content">
          <div className="about-copy">
            <SectionLabel>ABOUT US / 02</SectionLabel>
            <h2 id="about-title" className="sr-only">
              关于我们
            </h2>
            <BlurText
              text="我们是硅芯智语"
              delay={80}
              animateBy="letters"
              direction="top"
              className="about-title"
            />
            <div className="about-lines">
              <BlurText
                text="一个由高中生组成的科技团队"
                delay={38}
                animateBy="letters"
                direction="bottom"
                className="about-line"
              />
              <BlurText
                text="隶属于XINGJI Studio，"
                delay={38}
                animateBy="letters"
                direction="bottom"
                className="about-line"
              />
              <BlurText
                text="正在进行AI等方面的开源项目开发"
                delay={32}
                animateBy="letters"
                direction="bottom"
                className="about-line"
              />
              <BlurText
                text="欢迎每一个志同道合的朋友加入"
                delay={32}
                animateBy="letters"
                direction="bottom"
                className="about-line about-line-last"
              />
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
              <img
                className="about-image"
                src={brandImage}
                alt="SiliconLingua 与 XINGJI Studio 标识"
              />
            </GlassSurface>
          </div>
        </div>
      </section>

      <section
        className="members-section page-section"
        id="members"
        aria-labelledby="members-title"
      >
        <ViewportBackground
          className="members-grid-background"
          component={ShapeGrid}
          speed={0.5}
          squareSize={48}
          direction="diagonal"
          borderColor="rgba(110, 201, 211, 0.23)"
          hoverFillColor="rgba(71, 208, 245, 0.24)"
          shape="square"
          hoverTrailAmount={5}
        />
        <div className="members-wash" aria-hidden="true" />
        <div className="members-content section-content">
          <div className="members-heading">
            <SectionLabel>OUR MEMBERS / 03</SectionLabel>
            <h2 id="members-title">我们的成员</h2>
          </div>
          <ul className="members-grid">
            {members.map((member, index) => (
              <li key={member.name}>
                <GlassSurface
                  className="member-surface"
                  width="100%"
                  height="100%"
                  borderRadius={8}
                  borderWidth={0.1}
                  brightness={54}
                  opacity={0.9}
                  blur={10}
                  backgroundOpacity={0.065}
                  saturation={1.3}
                  displace={1}
                  distortionScale={-100}
                  mixBlendMode="screen"
                >
                  <div
                    className="member-row"
                    style={{
                      "--member-accent":
                        memberAccents[index % memberAccents.length],
                    }}
                  >
                    <div className="member-avatar" aria-hidden="true">
                      <img src={brandImage} alt="" loading="lazy" />
                      <span>{member.name.slice(0, 1)}</span>
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.title}</p>
                    </div>
                  </div>
                </GlassSurface>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="llm-section page-section"
        id="llm"
        aria-labelledby="llm-title"
      >
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
          mouseStrength={0.3}
        />
        <div className="llm-wash" aria-hidden="true" />
        <div className="llm-content section-content">
          <SectionLabel>OUR LANGUAGE MODEL / 04</SectionLabel>
          <h2 id="llm-title">我们的LLM</h2>
          <p className="llm-name">
            SiliconLingua-S1 <span>（敬请期待）</span>
          </p>
          <p className="llm-description">
            基于Qwen3-4b微调而成，提升数学与推理能力，将全量开源
          </p>
          <div className="llm-actions" aria-label="模型相关链接">
            {[
              ["modelscope", "dark"],
              ["Huggingface", "dark"],
              ["了解更多", "light"],
            ].map(([label, tone]) => (
              <GlassSurface
                key={label}
                className={`action-glass action-glass-${tone}`}
                width={152}
                height={50}
                borderRadius={8}
                borderWidth={0.12}
                brightness={52}
                opacity={0.9}
                blur={10}
                backgroundOpacity={0.04}
                saturation={1.3}
                displace={1}
                distortionScale={-100}
                mixBlendMode="screen"
              >
                <button
                  className={`action-button action-button-${tone}`}
                  type="button"
                >
                  {label}
                </button>
              </GlassSurface>
            ))}
          </div>
        </div>
      </section>

      <section
        className="developing-section page-section"
        id="in-progress"
        aria-labelledby="developing-title"
      >
        <ViewportBackground
          className="developing-background"
          component={Particles}
          particleColors={particleColors}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={135}
          moveParticlesOnHover
          particleHoverFactor={1}
          alphaParticles
          disableRotation={false}
        />
        <div className="developing-wash" aria-hidden="true" />
        <div className="developing-content section-content">
          <div className="developing-heading">
            <SectionLabel>IN PROGRESS / 06</SectionLabel>
            <h2 id="developing-title">
              <span>正在开发，</span>
              <span>敬请期待</span>
            </h2>
          </div>
          <div className="developing-projects">
            <GlassSurface
              className="developing-card"
              width="100%"
              height="100%"
              borderRadius={8}
              borderWidth={0.08}
              brightness={62}
              opacity={0.86}
              blur={13}
              backgroundOpacity={0.07}
              saturation={1.25}
              displace={2}
              distortionScale={-120}
              mixBlendMode="screen"
            >
              <article className="developing-card-content">
                <Hand
                  className="project-icon"
                  size={36}
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
                <h3>EMG肌电仿生义肢手</h3>
              </article>
            </GlassSurface>
            <GlassSurface
              className="developing-card"
              width="100%"
              height="100%"
              borderRadius={8}
              borderWidth={0.08}
              brightness={62}
              opacity={0.86}
              blur={13}
              backgroundOpacity={0.07}
              saturation={1.25}
              displace={2}
              distortionScale={-120}
              mixBlendMode="screen"
            >
              <article className="developing-card-content book-content">
                <BookOpen
                  className="project-icon"
                  size={36}
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
                <h3>我们的书籍</h3>
                <p>从计算机基础到人工智能的 AI 实战图解</p>
              </article>
            </GlassSurface>
          </div>
        </div>
      </section>

      <section
        className="join-section page-section"
        id="join-us"
        aria-labelledby="join-title"
      >
        <ViewportBackground
          className="join-background"
          component={SoftAurora}
          speed={0.6}
          scale={1.5}
          brightness={2.1}
          color1="#f7f7f7"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1.25}
          bandHeight={0.5}
          bandSpread={0.75}
          octaveDecay={0.1}
          layerOffset={1.2}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.25}
        />
        <div className="join-wash" aria-hidden="true" />
        <div className="join-content section-content">
          <SectionLabel>COMMUNITY / 07</SectionLabel>
          <h2 id="join-title">加入我们</h2>
          <p className="join-english">JOIN US</p>
          <p className="join-description">我们欢迎每一位志同道合的朋友加入</p>
          <GlassSurface
            className="qq-glass"
            width="min(440px, 100%)"
            height="auto"
            borderRadius={8}
            brightness={52}
            opacity={0.9}
            blur={12}
            backgroundOpacity={0.09}
            displace={1}
            distortionScale={-110}
            mixBlendMode="screen"
          >
            <button className="qq-copy-button" type="button" onClick={copyQQ}>
              {copied ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
              <span aria-live="polite">
                {copied
                  ? "QQ群号已复制：202515095"
                  : "请使用QQ加入社区群聊 202515095"}
              </span>
            </button>
          </GlassSurface>
        </div>
      </section>

      <section
        className="partners-section page-section"
        id="partners"
        aria-labelledby="partners-title"
      >
        <ViewportBackground
          className="partners-background"
          component={ShapeGrid}
          direction="up"
          speed={0.25}
          squareSize={72}
          borderColor="rgba(108, 205, 167, 0.2)"
          hoverFillColor="rgba(108, 205, 167, 0.2)"
          shape="square"
        />
        <div className="partners-wash" aria-hidden="true" />
        <div className="partners-content section-content">
          <div className="partners-heading">
            <SectionLabel>OUR PARTNERS / 08</SectionLabel>
            <h2 id="partners-title">我们的合作伙伴</h2>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <GlassSurface
                key={partner}
                className="partner-card"
                width="100%"
                height="100%"
                borderRadius={8}
                borderWidth={0.08}
                brightness={44}
                opacity={0.9}
                blur={10}
                backgroundOpacity={0.09}
                saturation={1.15}
                displace={1}
                distortionScale={-100}
                mixBlendMode="screen"
              >
                <div className="partner-card-content">
                  <div
                    className="partner-image-placeholder"
                    aria-label={`${partner} 图片预留位置`}
                  >
                    <ImagePlus size={28} strokeWidth={1.3} aria-hidden="true" />
                  </div>
                  <div className="partner-meta">
                    <span className="partner-number">0{index + 1}</span>
                    <h3>{partner}</h3>
                  </div>
                </div>
              </GlassSurface>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>硅芯智语</span>
        </div>
        <span className="footer-center">SILICONLINGUA</span>
        <span className="footer-year">© 2026</span>
      </footer>
    </main>
  );
}

export default App;
