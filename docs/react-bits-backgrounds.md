# React Bits 背景集成记录

本文件保存首页、成员页和加入我们页的背景集成要求，作为后续修改的约束来源。

## 共同约束

- 使用 React Bits 官方 TypeScript + CSS 组件源码；组件源码和组件 CSS 不做视觉改写。
- 只在页面集成层调整组件参数、挂载容器尺寸、层级、懒加载和兼容性降级。
- 用户上传的三张背景图是视觉参考，不作为页面背景素材。
- 背景必须实际挂载并可见，不能只保留空容器或被页面背景覆盖。

## 1. 首页：ColorBends

- 官方页面：https://reactbits.dev/backgrounds/color-bends
- 组件文件：`src/components/ColorBends.tsx`、`src/components/ColorBends.css`
- 依赖：`three`
- 官方集成 prompt：

  > Integrate the `<ColorBends />` component from React Bits. Use the TypeScript + CSS variant, install `three`, copy the official source and CSS, import the CSS, and render it as the page background. Do not modify the component's internal styles.

- 基准参数：`colors={['#ff5c7a', '#8a5cff', '#00ffd1']}`、`rotation={90}`、`speed={0.2}`、`scale={1}`、`frequency={1}`、`warpStrength={1}`、`mouseInfluence={1}`、`noise={0.15}`、`parallax={0.5}`、`iterations={1}`、`intensity={1.5}`、`bandWidth={6}`、`transparent`。
- 视觉目标：全屏液态色带，保持粉红、紫色和青绿色的高饱和流动弯曲效果；文字位于背景之上且保持清晰。

## 2. 成员页：AeroShards

- 官方页面：https://reactbits.dev/backgrounds/aero-shards?
- 组件文件：`src/components/AeroShards.tsx`、`src/components/AeroShards.css`
- 依赖：`vgpu@^0.3.1`（与当前官方组件源码的 WGSL 字符串 API 对齐；不要升级到不兼容的 0.6.x）。
- 官方集成 prompt：

  > Integrate the `<AeroShards />` component from React Bits. Use the TypeScript + CSS variant, install its compatible `vgpu@^0.3.1` dependency, copy the official WebGPU source and CSS, import the CSS, and render it in a full-size relative container. Do not modify the component's internal styles. Pass `onError` or provide an integration-level fallback when WebGPU is unavailable.

- 基准参数：`shardColor="#9cc9ff"`、`accentColor="#38bdf8"`、`placement="left"`、`material="glass"`、`markers="plus"`、`count={1300}`、`depthOfField={0.75}`、`vignette={0.3}`、`mouseInteraction`、`pulseOnClick`、`holdToGather`、`spread={1.2}`、`speed={0.8}`、`parallax={1}`。
- 视觉目标：深色页面上的蓝色玻璃碎片/丝带从左侧流动，具有景深、边缘高光、标记点和鼠标交互；WebGPU 初始化失败时仍保留可见的页面级冷色背景降级。
- 运行记录：`vgpu@0.6.x` 不接受该 React Bits 版本传入的原始 WGSL 字符串，导致画布透明且不绘制。固定到官方组件声明的兼容范围 `vgpu@0.3.1` 后，WebGPU 玻璃碎片在浏览器中正常显示，控制台无错误；保留页面级冷色径向底色作为 WebGPU 不可用时的降级。

## 3. 加入我们页：GradientBlinds

- 官方页面：https://reactbits.dev/backgrounds/gradient-blinds
- 组件文件：`src/components/GradientBlinds.tsx`、`src/components/GradientBlinds.css`
- 运行环境：WebGL2
- StrictMode 兼容：保留 React StrictMode；组件卸载时正常清理动画、监听、VAO 和 program，不强制销毁仍由 React 复用的 canvas context。
- 官方集成 prompt：

  > Integrate the `<GradientBlinds />` component from React Bits. Use the TypeScript + CSS variant, copy the official source and CSS, import the CSS, and render it in a full-size relative container. Do not modify the component's internal styles.

- 基准参数：`gradientColors={['#FF9FFC', '#5227FF']}`、`angle={20}`、`blindCount={16}`、`blindMinWidth={60}`、`spotlightRadius={0.5}`、`shine={0.4}`、`relief={0.5}`、`glow={0.4}`、`sway={0.35}`、`hoverTilt={0.6}`、`clickEffect="ripple"`、`noise={0.3}`。
- 视觉目标：紫粉到蓝紫的倾斜百叶渐变，带鼠标聚光、边缘高光、阴影层次和轻微摆动；WebGL2 不可用时仍保留页面级渐变底色。

## 集成检查清单

1. 背景容器必须有 `position: absolute`、`inset: 0` 或明确高度。
2. 页面背景组件位于内容层下面，但不能使用会落到父级背景之后的负 `z-index`。
3. 每个背景组件进入视口后才懒加载，离开视口时可以释放 GPU 资源。
4. 检查 WebGPU/WebGL2 能力、canvas 实际尺寸和构建日志；避免把兼容性失败误判成 CSS 问题。
