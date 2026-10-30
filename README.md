# 硅芯智语官网

## 环境要求

Node.js 20.19+（或 22.12+）。

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://localhost:5180/>。

## 构建与预览

```bash
npm run build
npm run preview
```

构建文件会生成在 `dist`。可以用 `npm run preview` 本地预览，或把整个 `dist` 目录部署到静态网站服务器。请通过 HTTP 访问，不要直接双击 `dist/index.html`，否则浏览器可能无法加载动画组件和资源。

默认部署目标是 `https://siliconlingua.github.io/`，资源使用根路径。构建同时输出 `dist/index.html` 和 `dist/lmlab/index.html`，因此 `/lmlab/` 可以在 GitHub Pages 直接访问及刷新，无需 SPA 重写。必须上传整个 `dist`（包括 `lmlab`、`assets` 和图标），不能只上传首页。

如果改为 GitHub Pages 项目站点，构建前设置 `VITE_BASE_PATH=/仓库名/`，不要改成 `./`，否则嵌套页面的资源会解析到错误目录。

基础回归检查：`node --test tests/*.test.js`。

如果系统或浏览器开启了“减少动态效果”，动画背景会按设置静止显示。
