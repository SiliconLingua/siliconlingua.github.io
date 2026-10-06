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

构建文件会生成在 `dist`。可以用 `npm run preview` 本地预览，或把整个 `dist` 目录部署到静态网站服务器。请通过 HTTP 访问，不要直接双击 `dist/index.html`，否则浏览器可能无法加载动画组件和资源。构建使用相对资源路径，可部署在子目录。

如果系统或浏览器开启了“减少动态效果”，动画背景会按设置静止显示。
