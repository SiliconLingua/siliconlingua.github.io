import { lazy, useEffect } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  FileCheck2,
  FolderKanban,
  Gauge,
  Layers3,
  MonitorCog,
  Sparkles,
} from "lucide-react";
import AnimatedContent from "../components/AnimatedContent";
import CardNav from "../components/CardNav/CardNav";
import GlassSurface from "../components/GlassSurface/GlassSurface";
import ShapeGrid from "../components/ShapeGrid/ShapeGrid";
import ViewportBackground from "../components/ViewportBackground";
import "./LMLabPage.css";

const ColorBends = lazy(() => import("../components/ColorBends"));
const basePath = import.meta.env.BASE_URL;
const asset = (name) => `${basePath}${name}`;
const repository = "https://cnb.cool/xingji_ai/LMLab";

const copy = {
  zh: {
    pageTitle: "LMLab · SiliconLingua",
    logoAlt: "返回硅芯智语官网",
    menu: "LMLab 页面导航",
    open: "打开菜单",
    close: "关闭菜单",
    nav: {
      product: "产品",
      workspaces: "项目与资产",
      capabilities: "能力概览",
      screens: "工作区预览",
      flow: "实验流程",
      start: "快速开始",
      repository: "项目仓库",
      team: "硅芯智语",
      home: "返回官网",
    },
    eyebrow: "LOCAL MODEL DEVELOPMENT / PYTORCH",
    title: "让本地实验",
    titleAccent: "成为清晰的工作流。",
    lede: "LMLab 是面向本地模型开发的工作区：用项目组织数据与模型，用版本化配方描述实验，再通过持久队列运行训练、推理和评估。每一步都留有记录。",
    primaryAction: "查看工作流程",
    repoAction: "浏览 LMLab 仓库",
    heroAlt: "LMLab 深色主题项目工作区，展示项目概览与最近运行",
    heroLabel: "PROJECT WORKSPACE",
    heroMeta: "LOCAL · TRACKED · RECOVERABLE",
    heroCaption: "项目 → 资产 → 配方 → 运行 → 结果",
    facts: [
      { title: "共用服务", detail: "CLI 与 WebUI 提交相同任务" },
      { title: "持久队列", detail: "运行记录与事件可恢复" },
      { title: "本地优先", detail: "文件与索引留在工作区" },
    ],
    capabilityEyebrow: "A WORKSPACE, NOT A ONE-OFF SCRIPT / 01",
    capabilityTitle: "从一次实验开始，\n把过程也留下来。",
    capabilityIntro: "项目、资产、配方与运行共享同一份上下文。先检查，再提交；计算交给独立 worker，结果随运行记录保存。",
    features: [
      {
        eyebrow: "PROJECT CATALOG",
        title: "项目与资产",
        body: "按项目登记数据集、模型、tokenizer 和 adapter。默认记录本地引用与内容指纹，可检查样本并发现文件变化。",
      },
      {
        eyebrow: "VERSIONED RECIPES",
        title: "配方与预检",
        body: "保存不可变的配方版本。只读预检先核对数据、模型、设备和配置，不启动训练，也不清理历史文件。",
      },
      {
        eyebrow: "DURABLE QUEUE",
        title: "运行与队列",
        body: "任务进入持久队列，由独立 worker 串行执行。状态、事件、日志与产物关联到独立运行记录。",
      },
      {
        eyebrow: "TRAIN & RECOVER",
        title: "训练与恢复",
        body: "覆盖预训练、SFT、蒸馏及多种文本对齐流程；支持安全暂停/停止，并从 checkpoint 创建关联的新运行。",
      },
      {
        eyebrow: "INFERENCE & EVALUATION",
        title: "推理与评估",
        body: "从项目资产或已有 checkpoint 发起推理与评估。输出、指标和报告保留在各自的运行记录中。",
      },
      {
        eyebrow: "WEBUI SETTINGS",
        title: "适合自己的界面",
        body: "WebUI 设置可选择跟随系统、浅色或深色主题；也可从顶栏快速切换，项目工作流保持一致。",
      },
    ],
    matrixTitle: "为实际实验设计",
    matrixText: "平台主要面向 Decoder-only 文本模型的对齐流程，也支持 Encoder-Decoder / Decoder-only 预训练与 SFT。Full 与 LoRA 可用；QLoRA 需兼容设备和依赖。硬件与算法组合以本机预检为准。",
    taskLabel: "训练与计算路径",
    taskTags: ["Pretraining", "SFT", "Distillation", "DPO", "GRPO", "PPO", "REINFORCE / RLOO"],
    galleryEyebrow: "INSIDE THE WORKSPACE / 02",
    galleryTitle: "上下文不丢，\n结果也有来处。",
    galleryText: "以下界面截图来自 LMLab WebUI，已换为深色主题配色。项目资产和运行历史在同一工作区中彼此关联。",
    gallery: [
      { image: "lmlab-dark-assets.png", alt: "LMLab 深色主题项目资产列表，显示 checkpoint、tokenizer 与报告", label: "ASSET CATALOG", title: "登记引用，检查来源与文件状态" },
      { image: "lmlab-dark-runs.png", alt: "LMLab 深色主题运行与队列页面，展示运行筛选、统计和历史", label: "RUN HISTORY", title: "查看队列、状态、日志与运行结果" },
    ],
    flowEyebrow: "FROM PROJECT TO RESULT / 03",
    flowTitle: "五步，走完\n一次可追踪实验。",
    workflow: [
      ["01", "创建项目", "建立有名称、标识和独立记录的本地实验空间。"],
      ["02", "登记资产", "关联数据、模型、tokenizer 或 adapter，并检查样本与指纹。"],
      ["03", "保存配方", "配置任务与调参方案；保存版本后执行只读预检。"],
      ["04", "提交运行", "经预检确认后进入持久队列，由 worker 执行计算。"],
      ["05", "读取结果", "查看日志、指标和产物，再继续推理、评估或恢复训练。"],
    ],
    localEyebrow: "LOCAL BY DESIGN / 04",
    localTitle: "模型在本机，\n实验记录有序。",
    localText: "工作区索引使用本地 SQLite；模型、数据与运行产物保存在输出目录。浏览器断开不会终止 worker，重新连接后可按运行记录恢复状态。云同步在当前版本尚未开放。",
    localPoints: [
      "CLI 与 WebUI 复用同一套应用服务",
      "预检只读，运行开始前先检查配置与资源",
      "运行、事件和 checkpoint 分开保存并可追溯",
    ],
    themeTitle: "明暗主题随你习惯",
    themeBody: "在顶栏外观菜单或设置 → 通用中，选择跟随系统、浅色或深色。",
    quickEyebrow: "GET STARTED / 05",
    quickTitle: "从一台机器，\n开始下一次实验。",
    quickText: "需要 Python 3.11–3.13。源码开发使用 uv；安装版包含 WebUI 静态资源，日常启动不需要 Node.js。",
    commands: ["python scripts/dev.py setup", "uv run lmlab version", "uv run lmlab webui --host 127.0.0.1 --port 5000"],
    commandLabel: "SOURCE CHECKOUT",
    commandNote: "CPU / CUDA / MPS availability depends on the local environment",
    docsLink: "阅读项目文档",
    footer: "LOCAL MODEL TOOLING · OPEN SOURCE",
    backTop: "回到顶部",
  },
  en: {
    pageTitle: "LMLab · SiliconLingua",
    logoAlt: "Back to SiliconLingua homepage",
    menu: "LMLab page navigation",
    open: "Open menu",
    close: "Close menu",
    nav: {
      product: "Product",
      workspaces: "Workspace",
      capabilities: "Capabilities",
      screens: "Screenshots",
      flow: "Workflow",
      start: "Get started",
      repository: "Repository",
      team: "SiliconLingua",
      home: "Back to homepage",
    },
    eyebrow: "LOCAL MODEL DEVELOPMENT / PYTORCH",
    title: "Make local experiments",
    titleAccent: "a workflow you can follow.",
    lede: "LMLab is a workspace for local model development. Organize data and models by project, describe experiments with versioned recipes, then run training, inference and evaluation through a persistent queue—with a record at every step.",
    primaryAction: "Explore the workflow",
    repoAction: "Browse LMLab repository",
    heroAlt: "LMLab dark-theme project workspace showing project overview and recent runs",
    heroLabel: "PROJECT WORKSPACE",
    heroMeta: "LOCAL · TRACKED · RECOVERABLE",
    heroCaption: "Project → assets → recipe → run → results",
    facts: [
      { title: "Shared services", detail: "CLI and WebUI submit the same jobs" },
      { title: "Durable queue", detail: "Runs and events can be recovered" },
      { title: "Local first", detail: "Files and index stay in the workspace" },
    ],
    capabilityEyebrow: "A WORKSPACE, NOT A ONE-OFF SCRIPT / 01",
    capabilityTitle: "Start with an experiment.\nKeep its context, too.",
    capabilityIntro: "Projects, assets, recipes and runs share one context. Validate first, submit next; a dedicated worker handles computation and results stay with the run.",
    features: [
      { eyebrow: "PROJECT CATALOG", title: "Projects & assets", body: "Register datasets, models, tokenizers and adapters by project. Local references and content fingerprints help inspect samples and detect file changes." },
      { eyebrow: "VERSIONED RECIPES", title: "Recipes & preflight", body: "Save immutable recipe revisions. Read-only preflight checks data, models, devices and configuration without starting training or cleaning history." },
      { eyebrow: "DURABLE QUEUE", title: "Runs & queue", body: "Jobs enter a persistent queue and run serially in a separate worker. State, events, logs and artifacts belong to each run." },
      { eyebrow: "TRAIN & RECOVER", title: "Training & recovery", body: "Support pretraining, SFT, distillation and text-alignment workflows. Pause or stop safely, then create a linked run from a checkpoint." },
      { eyebrow: "INFERENCE & EVALUATION", title: "Inference & evaluation", body: "Launch inference and evaluation from project assets or a checkpoint. Outputs, metrics and reports stay with their run records." },
      { eyebrow: "WEBUI SETTINGS", title: "Your preferred appearance", body: "Choose system, light or dark appearance in WebUI settings, or switch quickly from the header. The workflow stays the same." },
    ],
    matrixTitle: "Built for real experiments",
    matrixText: "The platform focuses on alignment for decoder-only text models, and also supports pretraining and SFT for Encoder-Decoder / Decoder-only architectures. Full and LoRA are available; QLoRA needs compatible hardware and dependencies. Verify hardware and algorithm combinations with local preflight.",
    taskLabel: "Training & compute paths",
    taskTags: ["Pretraining", "SFT", "Distillation", "DPO", "GRPO", "PPO", "REINFORCE / RLOO"],
    galleryEyebrow: "INSIDE THE WORKSPACE / 02",
    galleryTitle: "Keep the context.\nKnow where results came from.",
    galleryText: "These LMLab WebUI screenshots use the dark appearance. Project assets and run history stay connected in one workspace.",
    gallery: [
      { image: "lmlab-dark-assets.png", alt: "LMLab dark-theme project asset list showing checkpoints, tokenizer and reports", label: "ASSET CATALOG", title: "Register references and inspect file status" },
      { image: "lmlab-dark-runs.png", alt: "LMLab dark-theme runs and queue page showing filters, statistics and history", label: "RUN HISTORY", title: "Review queue, state, logs and run results" },
    ],
    flowEyebrow: "FROM PROJECT TO RESULT / 03",
    flowTitle: "Five steps to\na traceable experiment.",
    workflow: [
      ["01", "Create a project", "Start a local workspace with its own name, slug and records."],
      ["02", "Register assets", "Reference data, models, tokenizers or adapters; inspect samples and fingerprints."],
      ["03", "Save a recipe", "Configure the task and tuning strategy, save a revision, then run read-only preflight."],
      ["04", "Submit a run", "After review, add the job to the durable queue for worker execution."],
      ["05", "Read the results", "Inspect logs, metrics and artifacts; continue with inference, evaluation or recovery."],
    ],
    localEyebrow: "LOCAL BY DESIGN / 04",
    localTitle: "Models stay local.\nExperiments stay organized.",
    localText: "The workspace index uses local SQLite; models, data and run artifacts live in the output directory. A browser disconnect does not stop the worker, and reconnecting restores run state. Cloud sync is not available in this version.",
    localPoints: [
      "CLI and WebUI share the same application services",
      "Read-only preflight checks configuration and resources before a run",
      "Runs, events and checkpoints are stored separately and remain traceable",
    ],
    themeTitle: "Choose light or dark",
    themeBody: "Select system, light or dark from the header appearance menu or Settings → General.",
    quickEyebrow: "GET STARTED / 05",
    quickTitle: "One machine.\nYour next experiment.",
    quickText: "Requires Python 3.11–3.13. Source development uses uv; installed distributions include the WebUI, so Node.js is not needed for normal startup.",
    commands: ["python scripts/dev.py setup", "uv run lmlab version", "uv run lmlab webui --host 127.0.0.1 --port 5000"],
    commandLabel: "SOURCE CHECKOUT",
    commandNote: "CPU / CUDA / MPS availability depends on the local environment",
    docsLink: "Read project documentation",
    footer: "LOCAL MODEL TOOLING · OPEN SOURCE",
    backTop: "Back to top",
  },
};

const featureIcons = [FolderKanban, FileCheck2, Activity, Boxes, Gauge, MonitorCog];

function GlassLink({ href, children, className = "", external = false, icon: Icon = ArrowUpRight }) {
  return (
    <a
      className={`lmlab-glass-link ${className}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <GlassSurface
        className="lmlab-glass-surface"
        width="100%"
        height="100%"
        borderRadius={14}
        borderWidth={0.16}
        brightness={36}
        opacity={0.94}
        blur={16}
        displace={0.18}
        backgroundOpacity={0.16}
        saturation={1.45}
        distortionScale={-42}
        mixBlendMode="normal"
      >
        <span className="lmlab-glass-content">{children}<Icon size={16} aria-hidden="true" /></span>
      </GlassSurface>
    </a>
  );
}

export default function LMLabPage({ language = "zh", onLanguageChange }) {
  const t = copy[language] || copy.zh;
  const navigationItems = [
    {
      label: t.nav.product,
      links: [
        { label: t.nav.capabilities, href: "#capabilities" },
        { label: t.nav.screens, href: "#screens" },
      ],
    },
    {
      label: t.nav.workspaces,
      links: [
        { label: t.nav.flow, href: "#workflow" },
        { label: t.nav.start, href: "#quickstart" },
      ],
    },
    {
      label: t.nav.repository,
      links: [
        { label: t.docsLink, href: repository, ariaLabel: t.docsLink },
        { label: t.nav.team, href: basePath, ariaLabel: t.nav.home },
      ],
    },
  ];

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t.pageTitle;
    document.documentElement.classList.add("lmlab-route");

    return () => {
      document.title = previousTitle;
      document.documentElement.classList.remove("lmlab-route");
    };
  }, [t.pageTitle]);

  return (
    <main className="lmlab-page" id="lmlab-top">
      <CardNav
        className="lmlab-site-nav"
        items={navigationItems}
        logoAlt={t.logoAlt}
        logoSrc={asset("bg.png")}
        logoHref={basePath}
        language={language}
        onLanguageChange={onLanguageChange}
        labels={{ menu: t.menu, open: t.open, close: t.close }}
      />
      <ViewportBackground
        className="lmlab-page-color"
        component={ColorBends}
        colors={["#3020a0", "#6f59ef", "#9a66df"]}
        rotation={28}
        speed={0.12}
        scale={1.2}
        frequency={1.2}
        warpStrength={0.8}
        mouseInfluence={0.28}
        parallax={0.22}
        noise={0.12}
        iterations={1}
        intensity={0.9}
        bandWidth={2.4}
      />
      <ViewportBackground
        className="lmlab-page-grid"
        component={ShapeGrid}
        direction="diagonal"
        speed={0.12}
        borderColor="rgba(158, 145, 255, 0.12)"
        squareSize={56}
        hoverFillColor="rgba(126, 101, 255, 0.16)"
        shape="square"
        hoverTrailAmount={7}
      />
      <div className="lmlab-page-veil" aria-hidden="true" />

      <section className="lmlab-page-hero" id="top" aria-labelledby="lmlab-title">
        <AnimatedContent
          as="div"
          className="lmlab-page-hero-copy"
          trigger="mount"
          distance={30}
          duration={0.95}
          blur={6}
          stagger={0.1}
        >
          <p className="lmlab-page-eyebrow"><Sparkles size={14} aria-hidden="true" />{t.eyebrow}</p>
          <h1 id="lmlab-title">{t.title}<em>{t.titleAccent}</em></h1>
          <p className="lmlab-page-lede">{t.lede}</p>
          <div className="lmlab-page-actions">
            <GlassLink href="#workflow" className="lmlab-glass-link-primary" icon={ArrowDown}>
              {t.primaryAction}
            </GlassLink>
            <GlassLink href={repository} external>{t.repoAction}</GlassLink>
          </div>
          <div className="lmlab-page-facts" aria-label={t.heroMeta}>
            {t.facts.map((fact) => (
              <div className="lmlab-page-fact" key={fact.title}>
                <span><Check size={13} aria-hidden="true" />{fact.title}</span>
                <small>{fact.detail}</small>
              </div>
            ))}
          </div>
        </AnimatedContent>

        <AnimatedContent
          as="figure"
          className="lmlab-page-hero-visual"
          trigger="mount"
          delay={0.18}
          distance={34}
          duration={1.05}
          blur={5}
        >
          <div className="lmlab-page-visual-topline">
            <span>{t.heroLabel}</span>
            <span><i aria-hidden="true" />{t.heroMeta}</span>
          </div>
          <div className="lmlab-page-hero-image-wrap">
            <img src={asset("lmlab-dark-overview.png")} alt={t.heroAlt} fetchPriority="high" />
            <span className="lmlab-page-image-glow" aria-hidden="true" />
          </div>
          <figcaption>
            <span>01 / 03</span>
            <span>{t.heroCaption}</span>
          </figcaption>
          <div className="lmlab-page-visual-orbit" aria-hidden="true" />
        </AnimatedContent>
      </section>

      <AnimatedContent
        as="section"
        className="lmlab-page-section lmlab-page-capabilities"
        id="capabilities"
        aria-labelledby="lmlab-capabilities-title"
        distance={26}
        duration={0.8}
        blur={4}
        threshold={0.16}
        once={false}
        stagger={0.09}
      >
        <div className="lmlab-page-section-heading">
          <p className="lmlab-page-eyebrow">{t.capabilityEyebrow}</p>
          <h2 id="lmlab-capabilities-title">{t.capabilityTitle}</h2>
        </div>
        <div className="lmlab-page-capability-content">
          <p className="lmlab-page-section-intro">{t.capabilityIntro}</p>
          <div className="lmlab-page-feature-grid">
            {t.features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <article className="lmlab-page-feature" key={feature.eyebrow}>
                  <div className="lmlab-page-feature-top">
                    <span className="lmlab-page-feature-icon"><Icon size={18} aria-hidden="true" /></span>
                    <span className="lmlab-page-feature-number">0{index + 1}</span>
                  </div>
                  <div>
                    <p>{feature.eyebrow}</p>
                    <h3>{feature.title}</h3>
                    <span>{feature.body}</span>
                  </div>
                  <ArrowUpRight className="lmlab-page-feature-arrow" size={17} aria-hidden="true" />
                </article>
              );
            })}
          </div>
          <div className="lmlab-page-task-matrix">
            <div>
              <span className="lmlab-page-matrix-icon"><Layers3 size={18} aria-hidden="true" /></span>
              <div>
                <h3>{t.matrixTitle}</h3>
                <p>{t.matrixText}</p>
              </div>
            </div>
            <div className="lmlab-page-task-tags" aria-label={t.taskLabel}>
              {t.taskTags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent
        as="section"
        className="lmlab-page-section lmlab-page-gallery"
        id="screens"
        aria-labelledby="lmlab-gallery-title"
        distance={26}
        duration={0.8}
        blur={4}
        threshold={0.15}
        once={false}
        stagger={0.1}
      >
        <div className="lmlab-page-section-heading lmlab-page-gallery-heading">
          <p className="lmlab-page-eyebrow">{t.galleryEyebrow}</p>
          <h2 id="lmlab-gallery-title">{t.galleryTitle}</h2>
          <p>{t.galleryText}</p>
        </div>
        <div className="lmlab-page-gallery-grid">
          {t.gallery.map((item, index) => (
            <figure className={`lmlab-page-gallery-card lmlab-page-gallery-card-${index + 1}`} key={item.image}>
              <div className="lmlab-page-gallery-image-wrap">
                <img src={asset(item.image)} alt={item.alt} loading="lazy" />
                <span>{`0${index + 2}`}</span>
              </div>
              <figcaption>
                <span>{item.label}</span>
                <strong>{item.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </AnimatedContent>

      <AnimatedContent
        as="section"
        className="lmlab-page-section lmlab-page-workflow"
        id="workflow"
        aria-labelledby="lmlab-workflow-title"
        distance={28}
        duration={0.82}
        blur={4}
        threshold={0.14}
        once={false}
        stagger={0.08}
      >
        <div className="lmlab-page-section-heading">
          <p className="lmlab-page-eyebrow">{t.flowEyebrow}</p>
          <h2 id="lmlab-workflow-title">{t.flowTitle}</h2>
          <a className="lmlab-page-text-link" href="#quickstart">{t.quickEyebrow}<ArrowRight size={15} aria-hidden="true" /></a>
        </div>
        <div className="lmlab-page-workflow-list">
          {t.workflow.map(([number, title, description]) => (
            <div className="lmlab-page-workflow-item" key={number}>
              <span className="lmlab-page-workflow-number">{number}</span>
              <span className="lmlab-page-workflow-line" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </AnimatedContent>

      <AnimatedContent
        as="section"
        className="lmlab-page-local"
        aria-labelledby="lmlab-local-title"
        distance={24}
        duration={0.85}
        blur={4}
        threshold={0.14}
        once={false}
        stagger={0.1}
      >
        <div className="lmlab-page-local-copy">
          <p className="lmlab-page-eyebrow">{t.localEyebrow}</p>
          <h2 id="lmlab-local-title">{t.localTitle}</h2>
          <p>{t.localText}</p>
          <ul>
            {t.localPoints.map((point) => <li key={point}><Check size={15} aria-hidden="true" />{point}</li>)}
          </ul>
        </div>
        <div className="lmlab-page-settings-card">
          <div className="lmlab-page-settings-orb" aria-hidden="true"><MonitorCog size={28} /></div>
          <div>
            <span>{t.nav.product} / WEBUI</span>
            <h3>{t.themeTitle}</h3>
            <p>{t.themeBody}</p>
          </div>
          <div className="lmlab-page-theme-options" aria-hidden="true">
            <span><MonitorCog size={14} /> System</span>
            <span><Sparkles size={14} /> Light</span>
            <span className="active"><Sparkles size={14} /> Dark <Check size={13} /></span>
          </div>
          <span className="lmlab-page-settings-glow" aria-hidden="true" />
        </div>
      </AnimatedContent>

      <AnimatedContent
        as="section"
        className="lmlab-page-quickstart"
        id="quickstart"
        aria-labelledby="lmlab-quickstart-title"
        distance={24}
        duration={0.8}
        blur={4}
        threshold={0.14}
        once={false}
        stagger={0.1}
      >
        <div className="lmlab-page-quickstart-copy">
          <p className="lmlab-page-eyebrow">{t.quickEyebrow}</p>
          <h2 id="lmlab-quickstart-title">{t.quickTitle}</h2>
          <p>{t.quickText}</p>
          <GlassLink href={repository} external className="lmlab-glass-link-compact">{t.docsLink}</GlassLink>
        </div>
        <div className="lmlab-page-code-block">
          <div className="lmlab-page-code-header">
            <span>{t.commandLabel}</span>
            <span className="lmlab-page-code-dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <div className="lmlab-page-code-commands">
            {t.commands.map((command, index) => (
              <code key={command}><span>{`0${index + 1}`}</span><i>$</i>{command}</code>
            ))}
          </div>
          <span className="lmlab-page-code-note">{t.commandNote}</span>
        </div>
      </AnimatedContent>

      <footer className="lmlab-page-footer">
        <a href={basePath} className="lmlab-page-footer-brand">
          <img src={asset("bg.png")} alt="" />
          <span>SILICONLINGUA</span>
        </a>
        <span>{t.footer}</span>
        <a href="#top" className="lmlab-page-text-link">{t.backTop}<ArrowUpRight size={14} aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
