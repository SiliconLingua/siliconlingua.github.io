import { useEffect } from "react";
import ShapeGrid from "../components/ShapeGrid/ShapeGrid";
import "./LMLabPage.css";

const basePath = import.meta.env.BASE_URL;
const asset = (name) => `${basePath}${name}`;

const features = [
  {
    number: "01",
    title: "项目工作区",
    english: "PROJECT WORKSPACE",
    description: "用一个持久化工作区管理项目、数据集、模型、tokenizer 与 adapter。",
  },
  {
    number: "02",
    title: "训练与配方",
    english: "RECIPES & RUNS",
    description: "保存不可变的配方版本，先预检，再把训练任务交给独立 worker 串行执行。",
  },
  {
    number: "03",
    title: "推理与评估",
    english: "INFERENCE & EVALUATION",
    description: "从 checkpoint 继续推理或评估，日志、指标和产物都与运行记录保持关联。",
  },
];

const workflow = [
  ["01", "创建项目", "建立一个可复用的本地实验空间。"],
  ["02", "登记资产", "记录数据、模型与 tokenizer 的引用和指纹。"],
  ["03", "保存配方", "选择任务、初始化方式、数据与调参策略。"],
  ["04", "提交运行", "经过预检后进入持久队列，安全观察训练过程。"],
  ["05", "读取结果", "查看日志、指标、checkpoint，并继续推理或评估。"],
];

export default function LMLabPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "LMLab · SiliconLingua";
    document.documentElement.classList.add("lmlab-route");

    return () => {
      document.title = previousTitle;
      document.documentElement.classList.remove("lmlab-route");
    };
  }, []);

  return (
    <main className="lmlab-page" id="lmlab-top">
      <div className="lmlab-page-grid" aria-hidden="true">
        <ShapeGrid
          direction="diagonal"
          speed={0.22}
          borderColor="rgba(151, 204, 215, 0.14)"
          squareSize={48}
          hoverFillColor="rgba(190, 244, 248, 0.24)"
          shape="square"
          hoverTrailAmount={9}
        />
      </div>
      <div className="lmlab-page-veil" aria-hidden="true" />

      <header className="lmlab-page-header">
        <a className="lmlab-wordmark" href={basePath} aria-label="返回硅芯智语官网">
          <span className="lmlab-wordmark-mark">SL</span>
          <span>SILICONLINGUA</span>
        </a>
        <span className="lmlab-header-status">LMLAB / 0.3.1</span>
        <nav className="lmlab-page-nav" aria-label="LMLab 页面导航">
          <a href="#workspace">能力</a>
          <a href="#workflow">工作流</a>
          <a href="#quickstart">开始使用</a>
        </nav>
        <a className="lmlab-back-link" href={basePath}>
          返回官网 <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="lmlab-page-hero">
        <div className="lmlab-page-hero-copy">
          <p className="lmlab-page-eyebrow">LOCAL MODEL DEVELOPMENT / PYTORCH</p>
          <h1>
            <span>Build locally.</span>
            <em>Think deeply.</em>
          </h1>
          <p className="lmlab-page-lede">
            LMLab 是一个面向本地模型开发的工作区。把项目、资产、训练配方、运行、推理与评估放进一条清晰、可追踪的工作流。
          </p>
          <div className="lmlab-page-actions">
            <a className="lmlab-page-primary" href="#quickstart">
              了解工作流 <span aria-hidden="true">↓</span>
            </a>
            <a className="lmlab-page-secondary" href="#workspace">
              Explore LMLab <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <figure className="lmlab-page-hero-visual">
          <div className="lmlab-page-visual-topline">
            <span>WORKSPACE / OVERVIEW</span>
            <span>LOCAL · PERSISTENT · OPEN</span>
          </div>
          <div className="lmlab-page-hero-image-wrap">
            <img src={asset("lmlab-overview.png")} alt="LMLab 项目工作区概览" />
            <span className="lmlab-page-image-glow" aria-hidden="true" />
          </div>
          <figcaption>
            <span>001</span>
            <span>Project → assets → recipe → run</span>
          </figcaption>
        </figure>
      </section>

      <section className="lmlab-page-section lmlab-page-intro" id="workspace">
        <div className="lmlab-page-section-heading">
          <p className="lmlab-page-eyebrow">WHY LMLAB / 01</p>
          <h2>让每一次实验，<br /><em>都能被理解。</em></h2>
        </div>
        <div className="lmlab-page-feature-grid">
          {features.map((feature) => (
            <article className="lmlab-page-feature" key={feature.number}>
              <span className="lmlab-page-feature-number">{feature.number}</span>
              <div>
                <p>{feature.english}</p>
                <h3>{feature.title}</h3>
                <span>{feature.description}</span>
              </div>
              <span className="lmlab-page-feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="lmlab-page-section lmlab-page-gallery">
        <div className="lmlab-page-section-heading lmlab-page-gallery-heading">
          <p className="lmlab-page-eyebrow">THE WORKSPACE / 02</p>
          <h2>从资产到<br /><em>运行结果。</em></h2>
          <p>每一步都保留上下文，让实验不再散落在命令行、文件夹和临时笔记之间。</p>
        </div>
        <div className="lmlab-page-gallery-grid">
          <figure>
            <img src={asset("lmlab-assets.png")} alt="LMLab 项目资产界面" loading="lazy" />
            <figcaption><span>ASSETS</span><strong>登记并检查本地资产</strong></figcaption>
          </figure>
          <figure>
            <img src={asset("lmlab-runs.png")} alt="LMLab 运行记录界面" loading="lazy" />
            <figcaption><span>RUNS</span><strong>追踪日志、指标与产物</strong></figcaption>
          </figure>
        </div>
      </section>

      <section className="lmlab-page-section lmlab-page-workflow" id="workflow">
        <div className="lmlab-page-section-heading">
          <p className="lmlab-page-eyebrow">A SIMPLE LOOP / 03</p>
          <h2>一条完整的<br /><em>本地模型工作流。</em></h2>
        </div>
        <div className="lmlab-page-workflow-list">
          {workflow.map(([number, title, description]) => (
            <div className="lmlab-page-workflow-item" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lmlab-page-quickstart" id="quickstart">
        <div>
          <p className="lmlab-page-eyebrow">START WITH THE REPOSITORY / 04</p>
          <h2>把模型带回<br /><em>自己的机器。</em></h2>
          <p>需要 Python 3.11–3.13。开发环境使用 uv 工作区，WebUI 与 CLI 共用同一套应用服务。</p>
        </div>
        <div className="lmlab-page-code-block" aria-label="LMLab 快速开始命令">
          <span className="lmlab-page-code-label">QUICK START</span>
          <code><i>$</i> python scripts/dev.py setup</code>
          <code><i>$</i> uv run lmlab webui --port 5000</code>
          <span className="lmlab-page-code-note">local workspace · persistent queue</span>
        </div>
      </section>

      <footer className="lmlab-page-footer">
        <a className="lmlab-wordmark" href={basePath}>
          <span className="lmlab-wordmark-mark">SL</span>
          <span>SILICONLINGUA</span>
        </a>
        <span>LMLab / open-source local model tooling</span>
        <a className="lmlab-back-link" href="#lmlab-top">回到顶部 ↑</a>
      </footer>
    </main>
  );
}
