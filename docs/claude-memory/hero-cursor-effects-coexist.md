---
name: hero-cursor-effects-coexist
description: "How the Hero cursor effect layers coexist and which are always-on vs reduced-motion-gated; key for diagnosing \"动效消失\""
metadata: 
  node_type: memory
  type: project
  originSessionId: 61fbf32c-71ab-4e2d-8ff2-76d9d8f22699
  modified: 2026-08-01T02:07:01.995Z
---

本仓库（D:\AI工作文件夹\self web）的动效体系与「光标交互」相关，已多次被用户问起为什么某动效"没了"。

**关键区分（用户报告动效消失时先查这两点）：**

1. **headless Chrome/Edge 默认 `prefers-reduced-motion: reduce`**。Hero.jsx 的 mousemove 监听是"无条件挂载"（聚光灯 `--ix/--iy`、灯泡 `is-lit`、地球自转 targetVelocity 注入都始终挂），所以 headless 也能验证 Hero 动效 —— 这是历次踩坑后刻意改的。但 **`CursorGlow.jsx` 仍用 `if (prefers-reduced-motion: reduce) return` 整体跳过**，所以在 headless 里光标光晕不渲染、不跟随。用户真实浏览器一般不开 reduce-motion，故 CursorGlow 通常在线上正常；headless 验证不要误判它坏了。

2. **三层光标效果互不冲突**：`CursorGlow`（窗口级，暖陶土光晕跟随）+ `Hero.jsx` 内 `.hero-invert-spotlight`（mix-blend-mode:difference 反色圆斑，落右侧地球/灯泡区时隐藏）+ 各卡片 `cursor: crosshair`/`pointer`/`grab`。它们各自独立，不会互相"覆盖消失"。

**已验证在线生效的关键动效清单**（DOM 存在 + 事件触发正确，截至 2026-08-01）：
- Hero：rAF 灯泡自转 idle + 鼠标速度/方向驱动（HeroGlobe.jsx 的 bodyRef）、悬停灯泡本体 `is-lit` 点亮 + bulbPulse 呼吸 + 12 条放射光线、两条 3D 轨道环 `::before/::after` orbitSpin、`.hero-invert-spotlight` 反色聚光灯随鼠标、`.hero-headline .line` 三行 stagger heroLineReveal、`.hero-glow`/`.hero-content` 多层视差与滚动退出 fade/blur、`.hero-scroll-cue` 流动光点。
- Nav：`.nav-links a::before` 圆点 hover/active 变 `var(--accent)` 暖橙；scrollspy + 顶部进度条 + Magnetic 联系按钮 + 上下滚动隐藏。
- Reveal（IntersectionObserver 组件）覆盖全部内容区，滚动入视口逐块揭示。
- SpiralGallery v6：单圈圆柱 + translateZ + step-snap 吸附（滚轮按张停在正前方）+ 正前方去 mask 完整露出 + 触屏拖拽。
- `.project-index-card` hover Master-Detail（下方展开）+ `cursor: crosshair`（2026-08-01 恢复）。

**曾经的动效（已确认被结构重构替换掉，已与用户确认保留新版）**：旧 `.hero-right-pane` 圆环 `--ring-x/--ring-y` 鼠标微移 → 被 HeroGlobe 取代；旧 `.round-link` 绿染放大滚动提示 → 被 `.hero-scroll-cue` 取代；旧 `.media-card`/`.project-card` cursor:crosshair → 卡片载体被重构，crosshair 已迁到 `.project-index-card`。

**git 仓库非标准布局**：`.git` 不在工作目录根，而是 `.githome/`（worktree）。用 `git -C . --git-dir=.githome --work-tree=.` 调用；直接 `git` 会 fatal not a git repository。历史改动的真值通过 diff HEAD 判定。
