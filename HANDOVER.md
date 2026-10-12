# self web · 项目交接说明（HANDOVER）

> 生成：2026-09-23 · 由 Codex 汇总本项目历史对话后生成
> 更新：2026-09-26 · Qoder 完成 git 治理（大文件排除 + 6 次分批提交），并修正本文档中过期的配色与站点结构描述
> 用途：本项目的历史对话已归档清理（详见 `D:\AI工作文件夹\全局工作台\Codex执行记录\工具维护-三项目对话归档清理-20260923.md`）。本文档保存关键结论，供后续接手的对话快速了解项目情况。

## 项目是什么

个人作品集网站（求职用），React 19 + Vite 8。2026-10-10 起为**暗场发光 + 点阵数据感**视觉（下潜梯度 `--void-1…7`、缘光 `--rim-*`、像素点阵标题），面向内容 / 运营岗求职（详见 AI工作文件夹 HANDOVER 中的求职诊断结论）。**"羊皮纸亮调"那一版已退役**，读到旧描述以 `global.css` 的 Design Token 为准。

- 项目路径：`D:\AI工作文件夹\self web`
- 站点结构（`src/App.jsx` 实际滚动顺序）：Hero（首屏，含自转地球）→ About（关于）→ Strengths（能力与优势）→ Experience（经历）→ Projects（精选项目）→ Media（作品 / 视频轨道）→ AccountOperations（账号运营，螺旋照片墙）→ Footer
- 版心约 1700px，PC 优先展示；移动端有抽屉导航与响应式降级。

## 技术栈与结构

| 项 | 内容 |
|---|---|
| 框架 | React 19 + Vite 8 |
| 规范 | ESLint 9 + Prettier（`npm run lint` / `npm run format`），当前 0 error |
| 组件 | `src/components/`：Nav、Hero、About、Experience、Projects、Strengths、Media、VideoRail、AccountOperations、SpiralGallery、WorkModal、Footer、SectionHeading、SectionDots、CountUp、CursorGlow、Magnetic、Reveal、TiltCard、Arrow、ErrorBoundary（`HeroGlobe` / `HeroDigits` 已于 10-11 删除）|
| Hooks | `src/hooks/`：useScroll、useScrollSpy、useKeyboardNav（方向键跳章节） |
| 数据 | `src/data/`：全部文案与链接单源化（experiences / projects / strengths / nav / mediaLinks / videos / tools / douyinWorks / abilityMaterials），`index.js` 统一出口 |
| 样式 | 组件级 CSS + `src/styles/global.css`（Design Token）+ `src/styles/responsive.css` |
| 部署件 | `public/robots.txt`、`public/sitemap.xml`、品牌化 `public/404.html`；`index.html` 含 SEO/OG/Twitter 元信息 |

## Git 说明（重要）

- 本项目的 git 仓库**不是 `.git`，而是 `.githome`**（为兼容 WSL / Git Bash 的相对路径）。
- 请用项目根的 `gitw` 包装脚本操作，例如：`./gitw log`、`./gitw status`、`./gitw add -A`；或手动指定 `git --git-dir=.githome --work-tree=.`。
- **2026-09-26 已把 07-24 之后的全部工作分 6 次提交入库**（bc734be..5e04840：gitignore / assets / data / 新组件 hooks / 配色重设计 / brand 元信息），代码与素材侧工作区已干净，本文档与 `AGENTS.md`、`docs/` 随后作为第 7 次提交入库。`npx eslint src/` 0 error，`npm run build` 通过。
- `.gitignore` 现忽略 `作品集.pptx`、根目录简历副本、`.claude/`、`.workbuddy/`、`.deploy-tmp/`、`backups/`、`dist-verify/`。**新增大文件前先确认 ignore 命中**，git 历史里的体积收不回来。
- 站点素材图（`public/assets/` 下 douyin / pptx-media / hero，约 7.5MB，最大单文件 1.9MB）已入库，`.githome` 因此约 29MB。
- **远端：`ssh://git@ssh.github.com:443/wjsbkd/self-web.git`（private）**。不要改回 `https://github.com/...`：本机 `github.com:443` 直连恒定 21s 超时（解析到 20.205.243.166），而 `api.github.com` 与 `ssh.github.com:443` 通畅，所以只有 SSH-over-443 这条路径能推。push 用：
  `GIT_SSH_COMMAND="ssh -p 443 -o ConnectTimeout=20" ./gitw push origin master`
  本机 `~/.ssh/id_ed25519`（指纹 SHA256:R9bcgO6G2J6Kt1BkHSH1rqbraooscjvi8TdER148Jr4，标题 lzh@Lzh）已挂在 wjsbkd 账号上。`gh` 不在 Git Bash 的 PATH 里，用全路径 `"/c/Program Files/GitHub CLI/gh.exe"`。

## 开发历程（对话沉淀）

1. **从零搭建（07-12，2 条对话 + 1 条守护线程）**：按用户提供的简历文本搭出可运行、可预览的基础版；后续补内容（芒果TV、商界传媒经历保留）、头部高斯模糊设计（参考截图）、把精选项目改成"项目背景 / 我的职责 / 项目成果"的文字化案例卡。
2. **结构检查与重构（07-14，1 条对话）**：诊断结构缺陷后重构——样式拆分、数据单源化、锁定依赖版本、引入 ESLint/Prettier 与 Design Token；处理 git 历史；对照两份 PDF 简历逐条核对缺失内容（用户把 PDF 转成 3/7/8/9.png 放在项目里）。
3. **配色重设计（08-02，1 条对话）**：按用户给定的六色替换原酸性霓虹绿（`#c9ff53`）为深靛 `#2E365A` / 钴蓝 `#3F5B8D` / 灰紫 / 玫瑰灰 / 玫瑰暖 / 冷灰蓝。**这一版已被 08-03 的亮调重设计整体替换，不要再当作现状参考**（旧值仅存于该次对话，`global.css` 里已无这些变量）。
4. **亮调重设计与板块扩写（08-03，主线）**：转向「Claude 羊皮纸亮调 × Apple 净白卡片」——底色 `#faf9f5`、主强调陶土橙 `#cc785c`、文字暖近黑阶（`#1f1915`/`#2d2825`/`#6c6a64`/`#8a8279`）、分割线暖奶油灰；中性色统一带黄棕底以杜绝冷蓝灰。字体栈改为 Fraunces 衬线 Display（拉丁）+ Noto Serif SC（中文标题）+ Noto Sans SC（正文）+ DM Mono（标签），走 `fonts.googleapis.cn` 国内镜像。同期新增账号运营板块（SpiralGallery + WorkModal）、VideoRail 视频轨道、HeroGlobe 首屏地球、CursorGlow/Magnetic/Reveal/TiltCard 动效层，以及 useScroll/useKeyboardNav，并删除 `mediaWorks.js` 与 3 张废弃链接拼图。
5. **迭代主线（07 月 git 提交可见）**：v4 布局 → v5 Media/PDF 入口 → v6 架构重构 → v7 交互动效（圆环 hover、h1 stagger、光标跟随）→ 导航固定 + 滚动高亮 → 内容补全（简历 PDF 下载入口、社交联系行）→ SEO / OG / favicon 元信息 → 部署件与 lint 清零。

## 关键注意点

- 项目技术记忆已从 Claude 侧迁移保留到 `docs\claude-memory\`（2026-09-23）：
  - `hero-cursor-effects-coexist.md` — Hero 三层光标动效共存关系、headless 下 reduced-motion 误判的排查方法、已验证生效动效清单。用户报告“动效消失”时先读这份。
  - `spiral-gallery-true-spiral.md` — SpiralGallery 真螺旋几何（turns=1 单圈 + frontIdx 阶梯 y）、多圈重合坑与验证方法。改 SpiralGallery 前必读。
- `作品集.pptx`（约 806MB）与根目录 `李纵横15087322631.pdf` 是编辑源文件，已由 `.gitignore` 排除；站点真正使用的两份 PDF 在 `public/assets/` 下并已入库。
- 构建用 `npm run build`，本地预览 `npm run dev`；`node_modules`、`dist`、`dist-verify` 均已忽略。临时验证构建请带 `--outDir dist-verify`，避免覆盖 `dist/` 里的上一次产物。
- `backups/` 是 07-30、08-01 两次重构前的手工代码快照，已忽略，仅作参考；`.workbuddy`、`.deploy-tmp`、`.claude` 是各工具私有产物，不要误改或入库。
- 全站文案与联系方式集中在 `src/data/nav.js`（邮箱 / 电话 / 微信 / 简历路径）等数据文件，改内容不要动组件。

## 后续可做

- **部署**（2026-09-26 决定暂缓）：远端仓库已建好并推上（private），托管方式待定。选托管时注意：账号名是 `wjsbkd`，GitHub Pages 的地址会带这个名字，招聘场景读起来不如 Vercel 类自定义域名干净。
- **若将来改 public**：源码里的手机号 / 邮箱 / 微信、`public/assets/` 下的简历 PDF、以及 `src/data/videos.js` 里的百度网盘提取码都会公开可读，先确认这些本就要给招聘方看。
- **部署前必须替换 `index.html` 占位**：`canonical` 与 `og:url` 仍是 `https://lizongheng.example.com/`；自建分享封面已放在 `public/assets/og-cover.jpg`（1200×630），但分享标签需要绝对 URL，待正式域名确定后把 `og:image` / `twitter:image` 一并替换。
- 若继续改视觉，先读 `src/styles/global.css` 的 Design Token，避免散落硬编码颜色。
- 资源清理：2026-09-28 删除未引用的 `public/assets/hero/earth-texture.png` 与 8 个 `public/assets/pptx-media/` 遗留文件，合计约 3.1MB；不要再把这张地球纹理当作首屏优化对象。清理后 `pptx-media/` 剩 15 个文件，与 15 处引用一一对应。

## 动效层排查与修复（2026-10-09）

对全站动效做了一次排查（读码 + dev server 实测），修掉 4 个真实缺陷 + 3 处性能/手感问题。`npx eslint src/` 0 error，`npm run build` 通过。

**已修的缺陷**

1. **SCROLL 提示失去居中**（`Hero.css` `.hero-scroll-cue`）：居中靠 `left:50% + translateX(-50%)`，但 `heroFadeUp` 的结束关键帧是 `transform: none`，带 `forwards` 的动画会覆盖基础 transform，把这半格自身宽度的位移抹掉。已改为 `left:0; right:0` + flex 居中，位移动画即可自由用 transform。**教训：任何用 `translateX(-50%)` 居中的元素，若自身动画的结束态是 `transform: none`，居中就会在动画结束后失效。**
2. **VideoRail 入场交错从未被看见**（`VideoRail.jsx` / `.css`）：22 张卡的 `rail-card-in` + `--rail-delay` 交错是纯 CSS，挂载即播，而轨道在文档 Y≈7026（首屏之下 6000px+），用户滚到时动画早已 `finished`。已改为首次进入视口才给 `.video-rail` 加 `.is-in` 统一触发；同时保留 `--rail-delay` 交错。触发用 IntersectionObserver **加 scroll/resize 兜底**——IO 在标签页不可见时不触发，只靠它会让用户切回来时卡片停在 `opacity:0`。
3. **10 个滚动揭示选择器里 9 个是死 CSS**（`global.css`）：`@supports (animation-timeline: view())` 块里的 `.about-grid` / `.campus-block` / `.strength-grid` / `.project-list` / `.project-stories` / `.media-grid` / `.resource-bar` 在当前组件结构中都不存在了（各板块改用 `Reveal` 后未同步清理）；仅 `.metrics` 与 `.experience-list` 命中，而这两个恰好与 `Reveal` 的过渡作用在同一元素上，两套机制互相覆盖。已整块移除，揭示统一由 `Reveal` 负责。**原选择器清单保留在 `global.css` 的注释里，别再照着它加规则。**
4. **`--text-main` 残留 4 处**（`VideoRail.css` ×3、`WorkModal.css` ×1）：该 token 在 08-03 重设计时已改名为 `--text-bright` / `--text-base`，这 4 处没跟上。`var(--text-main)` 无定义无 fallback，会让声明在计算值阶段失效并回退继承。已全部改为 `--text-base`。`.workbuddy/memory/2026-07-30.md` 早就记过同一问题，说明它跨轮次没被清掉——**改配色 token 时要全局搜一遍旧名。**

**性能 / 手感**

5. **常驻 `will-change` 41 → 6**：`Reveal` 的 `.reveal` 与 `.reveal-stagger > *` 都设了 `will-change`，而元素揭示后就停在终态，图层白占合成器内存。已移除（`translate3d` 本身已能触发提升）。
6. **Hero 灯泡 rAF 越界空转**：`globeLoop` 从挂载跑到卸载，hero 滚出视口后仍逐帧写 transform（上方视差循环本就随滚动停了，两者原本不一致）。已用 IntersectionObserver 启停。
7. **Magnetic 被双重平滑**：`Magnetic.jsx` 每帧写 transform，`Nav.css` 又对 transform 加 0.5s 过渡，两套时钟互相拉扯、元素明显滞后于光标。已改为跟手期间加 `.is-tracking`（`transition: none`），离开时移除、交还过渡做回弹。

**reduced-motion 统一**

全局块原先只压 `animation-duration` / `transition-duration`，**没压 delay**，导致 `hero-scroll-cue`（1.2s）、`hero-foot`（0.85s）等带延迟入场的元素在 reduce 下仍等满延迟才跳到终态，造成一帧闪烁。已补上 `animation-delay` 与 `transition-delay: 0s !important`。另：`Hero.jsx` 的 reduce 判断改为每次读 `reduceMotionRef.current` 并监听 `matchMedia` 的 `change`，用户在系统设置里切换该偏好无需刷新即可生效（原先挂载时取一次，ref 更新但已注册的循环仍用旧值，ref 等于白加）。

**已知限制 / 待人工确认**

- **本项目的 Browser 预览面板会强制 `prefers-reduced-motion: reduce`，且标签页不可见时 rAF 与 IntersectionObserver 都被节流**（固定定位的屏上元素 IO 也不触发）。因此：① 在该面板里看到的 `animation-delay` 一律是 `0s`，属预期而非 bug，验证交错要靠读 `--rail-delay` 变量本身；② **Hero 灯泡的 rAF 启停（修复 6）无法在面板里用「动画是否推进」验证，需要在可见的真实浏览器里人工确认一次**。历史上踩过同一个坑，见 `docs/claude-memory/hero-cursor-effects-coexist.md` 第 1 条。
- 该面板的 `preview_console_logs` 会**重放缓存的旧错误**（时间戳 `?t=...` 冻结不变），改完代码 reload 后仍显示上一次的报错。**判断是否有错要看 DOM 实际状态（如 `document.body.innerText` 是否含「页面渲染出错」），不要只看 console。**
- 面板里 `React` 的合成事件无法用 `dispatchEvent(new MouseEvent('mouseenter'))` 触发（由 mouseout/mouseover 合成）。验证 hover 类交互要 dispatch `mouseover` + `relatedTarget`，否则会误判为「hover 暂停失效」。
- `CursorGlow.jsx` 仍在 reduce 下整体 `return` 不渲染（`App.jsx` 里始终挂着该组件），与「用户主动触发的效果不受 reduce 限制」的既定策略不一致，但这是**有意为之且已与用户确认**，本次未动。
- `TiltCard.jsx` / `useParallax` 全项目无引用，属死代码，未删（删除需用户确认）。

## VideoRail 自动滚动与本机 reduce-motion（2026-10-09 追加）

**本机 Windows 动画效果是关闭的**：`HKCU\Control Panel\Desktop\WindowMetrics\MinAnimate = 0`（`VisualFXSetting = 0`，`HKCU\Control Panel\Accessibility\Animation` 键不存在）。Chrome/Edge 会把这个状态传导为网页的 `prefers-reduced-motion: reduce`。**所以在这台机器上调试本站，任何被 reduce 门控的动效都不会动，这是环境不是 bug** —— 2026-10-09 用户报「视频轨道不会自动滚动」即由此而来。

VideoRail 原实现是 `if (!reduceMotion) 启动 tick`，即 reduce 下**静默不启动且无任何提示**，看起来就像功能坏了。已改为：

- 自动滚动属 WCAG 2.2.2「会动的内容」，**必须可暂停**，因此轨道右侧新增常驻的 `.video-rail-play-toggle` 播放/暂停按钮（`aria-pressed` / `aria-label` 同步）；reduce-motion 下默认暂停但不隐藏，用户可自行开启。
- `hoveredRef` / `userPausedRef` 两个 ref 供 tick 每帧读取（悬停不触发 22 张卡重渲染），`userPaused` state 只驱动图标与 aria，并用 effect 同步回 ref —— **切勿在 render 期读 ref，eslint `react-hooks/refs` 会报错**（本次踩过）。
- tick 改为**始终运行、内部判停**，用户点播放可立即恢复，不必重挂 effect。
- 回环宽度 `measure()` 在恢复播放时重测一次，防窗口缩放后 `loopWidth` 失真导致回环跳变。

实测（1440×900，reduce-motion 开启）：点播放后 800ms 内 `scrollLeft` 0 → 78；悬停暂停 / 移出恢复 / 再点暂停均正确；把 `scrollLeft` 推到 `loopWidth-30` 越过后回落到 88（无缝回环成立）。

## 第二轮视觉改造：亮彩光效 + 中文像素标题 + 全站光晕体系（2026-10-10）

提交 `b7683be`（17 文件，+931/−104）。用户反馈第一轮"整体仍偏暗、后续板块与首页脱节、标题要真像素风"，本轮按 6 条文字要求执行。

**核心改动**：

1. **中文像素字自托管**：`@fontsource/fusion-pixel-12px-proportional-sc`（缝合像素 Fusion Pixel 12px，TakWolf 出品，SIL OFL 免费商用）。npm 安装后把 woff2（592KB，31345 字形，**含全部所需汉字**——fontsource 的 "latin" 子集实际是全字库）拷入 `public/fonts/`，许可证随附。`@font-face` 写在 global.css，`--font-pixel-zh` token。**改标题文案后若出现缺字，先查这个字库**（脚本：fontTools 读 cmap）。字号必须 12 的整倍数（当前 72/96/120px 断点式，不用连续 vw——80.9px 这种非整倍数会破坏点阵对齐），并 `-webkit-font-smoothing: none` 保硬边。
2. **光效提亮**：blob 透明度 0.5→0.42~0.75 档、色值提饱和（玫红 `#ff2d6f`、亮紫 `#b39dff`、新增粉 `--glow-pink #ff5e9e`）、5 个 blob、尺寸/位置上调。实测（1440×900 像素采样）：光域中心亮度 115→193，四色像素计数全部在场，底部仍深（lum 9）保留明暗对比。
3. **全站光晕**：`.section-glow--{about,strengths,experience,media,account}` + `.work-glow` + Footer 三色，每个板块色相/定位/形态各异（About 左上玫红 / Strengths 右亮紫 / Experience 左下粉 / Projects 居中蜜桃 / Media 右上双色 / Account 底部粉），blur(90px) + pointer-events:none，内容层 `~ *` 兜底 z-index:1。**板块 JSX 各插一行 `<div className="section-glow ..." aria-hidden />`，新增板块记得跟进**。
4. 数字点阵亮度 0.15→0.34（亮彩背景下保持可辨）；灯泡缩至 210px 上移避让 120px 标题；Hero padding 96/84。

**验收记录（dev server 实测）**：像素字 `document.fonts.check` 加载+应用双确认、标题三行文案零改动；1440×900 布局灯泡 32-242/徽章 118-149/标题 185-627/CTA 767-820/SCROLL 803-866 全在视口零遮挡；375×812 标题 72px 宽 235px 不溢出、CTA 纵排；WorkModal 开/Esc 关、螺旋 10 卡 Y 全相异、rail `is-in` 触发（**面板 instant 滚动不派发 scroll 事件，需手动 `window.dispatchEvent(new Event('scroll'))` 验证；真实浏览器无此问题**——第一轮记录的"smooth 滚动能触发"经验仍对）。lint 0 error，build 通过。

**面板工具新坑（本次发现）**：
- 截图管线会返回**滞后帧**（滚动后截图全黑/无红色标记，但 DOM rect 正确）——验证视觉要"像素采样首屏（不滚动）"或纯 DOM 几何，滚动后的截图不可信。
- `scrollTo({behavior:'instant'})` 在面板里**不派发 scroll 事件**，依赖 scroll 监听的逻辑（如 rail is-in）必须手动 dispatchEvent 验证。

## 全站视觉语言迁移：羊皮纸亮调 → 暗场发光 + 点阵数据感（2026-10-10）

按用户提供的参考图与《视觉设计规范-深色AI视觉语言-20261009.md》执行整站换肤，提交 `9998fb9`（20 文件，+898/−720）。**这不是调色，是设计语言替换**；功能、交互、动画全部保留。

**四个已确认的翻译决策**（改视觉前先看这里，别走回头路）：

1. **全站纯暗场**，单一主题（`--bg-base #0d0a0c` 近黑微暖红棕），无亮色模式回退。
2. **衬线全站退役**——`--font-serif` token 已删除。中文标题用 **Noto Sans SC 900** 极重字重对位参考图像素标题的"情绪权重"；拉丁标签/序号用 **Silkscreen** 像素字（`--font-pixel`，OFL 免费商用，走 fonts.googleapis.cn；缺 em-dash 等字形，写 kicker 文案时只用拉丁/数字/斜杠）。词重音从"衬线斜体"改为 900→300 字重对比 + 浅蜜桃 `--accent-warm #f3c6a6`。
3. **UI 层几乎无彩色**：层级靠明度差。唯一强调色为**蜜桃 `--accent #e9a57f`**（取自光域中段），仅用于 hover/焦点/kicker 编号微点缀。数据数字一律纯白 `#fff` 无衬线 700。
4. **Hero 是唯一彩色光源**（A1）：4 个强 blur 的 blob（洋红 `#c2265a` / 蜜桃 / 淡紫 `#cfc9ec` / 暖白核心）组成光雾，色值收在 `--glow-*` token；全页其余部分不铺光。

**构图与组件**：

- Hero 从"左文右球"改为**居中单轴**：灯泡吊在中轴上部（`left:50%` + 负 margin 居中，注意它不用 translateX 居中——wrap 上有 JS 视差 transform），往下依次徽章药丸 → 三行大标题 → 副文案（max-width 560）→ 白药丸主 CTA + 深色药丸次 CTA。新增 `HeroDigits.jsx`（数字点阵 canvas，mount/resize 绘一次，密度波带调制，无动画）。
- Nav 从全宽贴边改为**悬浮白药丸**（`translateX(-50%)` 居中——`.nav-hidden` 隐藏态必须带着这个 translate 一起写，踩过一次差点丢掉）。active 项用 3px 小圆点（`::after`），旧 `.nav-indicator` 滑动胶囊已删（JSX 本就无引用，是死 CSS）。**进度条移出了 `.nav` 元素**：nav 自带 transform 会让 `position:fixed` 子元素相对它定位，全宽进度线必须渲染在 nav 外。1180px 断收状态文案、800px 转全宽条+暗玻璃抽屉。
- Footer 居中化，白药丸 CTA「发邮件聊聊」，底光晕改光域同族色。
- SpiralGallery：几何零改动；**`.spiral-edge-mask` 里的 `#fff` 改成了容器底色 `#070508`**——mask 渐变必须与底色一致，否则亮调白雾在暗底上会渲染成四条白框（本次最隐蔽的一处）。冷蓝系（`#5b8fc4`/`rgba(15,30,60,…)`) 全部换暖暗系。
- 聚光灯 `mix-blend-mode` **difference → screen**（暗场上白斑 difference 会翻成互补色刺眼补丁；screen = "手电提亮"）。`isolation: isolate` 层叠结构保留。
- 颗粒层 `body::after` **multiply → soft-light**（multiply 在近黑底上不可感知）。
- 图片类：卡片封面默认 `brightness(0.82) saturate(0.88)` 压亮融入暗场，hover 恢复。
- `index.html` theme-color 已换 `#0d0a0c`。

**验证记录（dev server 实测，1440×900 + 375×812）**：暗底/白药丸/900 标题/Silkscreen 徽章/screen 聚光灯/4 blob/点阵 canvas/数据栏纯白/软光颗粒 全部实测命中；桌面居中单轴（nav/h1/灯泡中轴偏差 -7px = 滚动条宽度）；灯泡 hover `is-lit` 开合、VideoRail `is-in` + scrollLeft 推进、11/11 Reveal、螺旋 10 卡 Y 全相异（阶梯几何完好）、WorkModal 开/Esc 关、移动端抽屉开/Esc 关。`npx eslint src/` 0 error，`npm run build` 通过。

**残留审计已清零**：`#faf9f5 / #cc785c / #d97757 / #1f1915 / #e8e6dc / rgba(204,120,92 / rgba(217,119,87 / Fraunces / Noto Serif / --font-serif / --text-main` 全局 grep 仅剩注释文字，代码零命中。**下次改配色 token 时照这个清单再搜一遍。**

**未解决 / 待人工**：

- **动画推进本机不可验**：Windows 动画效果关闭 → 浏览器恒 reduce-motion，光雾缓漂（42s blobDrift）、灯泡 idle 自转、入场 stagger 在本机全停在终态。需在开着动画效果的真实浏览器人工过一遍手感（同 2026-10-09 修复 6 的验收要求）。
- VideoRail 播放钮/详情图等真实视频海报的暗场观感（本机 reduce 下 tick 不推进）需人工确认。
- Silkscreen 像素字若后续要用于更多文案，注意缺字形（em-dash、中文全角符号）会回退 DM Mono，混排时字重观感略跳。
- `dist/` 是旧产物，部署时需重新 build。

## 本轮修复清单（2026-10-09，动效排查）

对全站动效做了一次排查（读码 + dev server 实测），修掉 4 个真实缺陷 + 3 处性能/手感问题。`npx eslint src/` 0 error，`npm run build` 通过。

## 参考图视觉迁移：暗场下潜 + 缘光 + 点阵（2026-10-10 第二次，未提交）

31 文件 +1279/−889，工作区未提交（用户未要求提交）。以参考图（AI 作品集风格）为方向做**设计语言迁移**，不是改色：功能、交互、动画全部保留并逐项实测。

**语言三构件**

- **下潜梯度** `--void-1…--void-7`（#0b0706→#020202）：七个板块逐档变深，实测单调。板块分隔由旧的 `.section-glow` 彩色光晕改为 1px `.section-rim` **缘光发丝线**（`transparent → --rim-wine`）；全站唯一彩色收在 `--rim-*` 一族，UI 层零彩色。
- **卡片面三档**：`--card-void` #0f0a09（卡底，比所在档抬一档）/ `--card-void-hi` #16100e（卡内嵌件与 hover 再抬一档）/ `--void-7`（图像井 letterbox）。`--ring-card` = `inset 0 1px 0 --rim-brick-a28`，卡片上缘一线光。
- **图片统一** `filter: brightness(0.9) saturate(0.72) contrast(1.06)`，hover `filter: none`（工具画廊 / rail poster / 项目详情图三处同一条）。
- 新增令牌 `--glass-void` `--glass-ink` `--scrim` `--paper-a92` `--card-void-hi`。组件里裸色只剩 3 处，全是中性黑原语（video letterbox `#000`、play 遮罩 `rgba(0,0,0,.3/.16)`），与黑色阴影同组，不强行令牌化。

**机制级改动（再动动画前必读）**

- **Reveal 由 transition 改为 `@keyframes reveal-up` + animation**。原因：组件里任何 `transition: box-shadow …` 简写会**整条替换** `.reveal` 的过渡列表 —— 实测 7 个宿主中招（4 个卡片 + 3 组 stagger 子节点），不止最初记录的那几个。
- **位移一律走独立 `translate` 属性，把 `transform` 留给 hover。** `both` 填充的动画终值会永久压住它所动画的属性：VideoRail 卡片 hover 的 -6px 位移此前正是被 `rail-card-in` 的 `translateY(0)` 杀掉的（既有缺陷，本轮修好）。
- VideoRail 的 reduce 块原先只有 `transition: none`，补了 `.video-rail.is-in .video-rail-card{animation:none}`；实测安全 —— `opacity:0` 只挂在 `:not(.is-in)` 上，关掉动画不会把卡片留在隐形态。

**首页与导航**

- 灯泡重定位为穹顶缘光的光源。`CursorGlow` 改为**只在暗场出手**：光标 y < `hero.top + heroHeight*0.66`（`.hero-sky` 亮部下沿实测位置）时收灯，scroll/resize 重测。
- `index.html` 加预绘制 `html{background:#020202; color-scheme:dark}`，`theme-color` 同步 `--void-7`。`favicon.svg` / `404.html` 重写为暗场语言。
- 导航三段明度节拍 paper → ink → charcoal → paper；`.nav-tail` 抽屉底改走 `--glass-ink` 令牌。

**实测清单（browser-use 取值，非读码推断）**

- token 审计 0 处未定义 `var()`；`npx eslint src/` 0 error；`vite build --outDir dist-verify` 通过（CSS 55.44 kB / JS 246.75 kB / 169ms）；console 无报错。
- 820/900/1000/1100/1200/1440 六档：零横向溢出，导航三段无重叠且始终落在轨道内，`.nav-items` 不溢出。
- `.metrics` `max-width:66%` 生效（1440 实测 862px），点阵刻度线 `::after` 命中 rim-brick-a40 / 7px pitch / repeat-x。
- 移动端抽屉全链路：开（`aria-expanded=true`、玻璃底、6 项纵排、尾件由抽屉承底）/ Esc 关 / 点链接关并跳转 / **展开时向下滚动不隐藏导航** / 收起后向下隐藏、向上显现。
- WorkModal：开（body 锁滚、焦点进关闭键、`role=dialog`、backdrop `--scrim`、panel `--card-void`、media `--void-7`）/ Esc 关 / **焦点还原到触发元素**。
- Projects 概览卡是"点击锁定内联详情面板"，不是弹窗：锁定→解锁→切第三张均正确，`activeCount=1`。
- SpiralGallery：滚轮与拖拽都改变卡片矩阵、点击开 WorkModal 并正确关闭；井底/卡底/缘光/提示条色值命中。
- VideoRail：悬停 tick 停（2s 内 scrollLeft 零变化）、next/prev 各 ±368（= 卡宽 + 18）、移出恢复推进。
- Magnetic 4 个实例：跟手位移 + `is-tracking`（transition none）、超半径归零、离开归零。
- CountUp：0 → 3+ / 270W+ / 1000W+ / 50+ 平滑收敛。
- 整页扫掠（真实 427×561 视口）：11 个 `.reveal` + 18 个 stagger 子节点 = 29 节点全部 opacity ≥ 0.99，无 `translate` 残留。

**新踩的坑**

- **SVG / XML 注释里不能出现连续两个减号**：`favicon.svg` 注释写了 `--text-bright` 这类令牌名，直接解析失败、图标渲染成 broken image。写注释时令牌名去掉 `--` 前缀。
- **npm 会吞 `--outDir`**（EUNKNOWNCONFIG）：临时构建用 `npx vite build --outDir dist-verify`。
- **iframe 裁片台不能用来验滚动揭示**：Chrome 把子文档的 IntersectionObserver root 裁到**父视口**高度 —— 在 427×561 的宿主里，1440×1120 子帧的 `rootBounds.bottom` 恒为 516，与 `scale()` 无关。所以裁片台里滚到 516px 以下的揭示永不触发，会误判成"动画坏了"。裁片台只用于量布局与取色；滚动揭示必须在真实视口里扫。
- 编辑 `index.html` 会触发 Vite 整页 reload，注入的 iframe / 样式全清 —— 验 404 一类别依赖注入态。

**对本文档此前记录的更正**

- 「`.spiral-edge-mask` 的 mask 渐变必须与容器底色一致，否则渲染成白框」**结论错了**：CSS masks 默认 `mask-mode` 是 **alpha**，mask 渐变里只有 alpha 参与结果，实色色值不影响。当时的问题出自 alpha 与底色不匹配。
- 「theme-color 已换 `#0d0a0c`」「数据数字一律纯白 `#fff`」「Nav 悬浮白药丸」三条已被本轮取代：theme-color = `#020202`；数字用 `--text-bright` #f5f3ff；导航药丸是 `--ink` 底 + 亮字 —— 纸白压在天光带上实测只剩 29 级差，会漂。
- 「本机 Windows 动画关闭 → 浏览器恒 reduce-motion，动画推进不可验」这条**本轮不成立**：browser-use 起的 Chrome 实测 `matchMedia('(prefers-reduced-motion: reduce)').matches === false`，本轮所有动画都是真实推进的（CountUp、rail tick、reveal currentTime 都在动）。对用户日常浏览器是否仍恒 reduce，本轮未验证。

**未解决 / 待人工**

- **og:image / twitter:image 仍是 Unsplash 外链电路板图**。仓库里唯一的自有封面 `public/assets/og-cover.jpg` 是 08-03 羊皮纸亮调（衬线标题 + 米白底），与暗场语言直接冲突，不能直接换上；且 `canonical` / `og:url` 仍是 `lizongheng.example.com` 占位。需要一张新的 1200×630 暗场封面 + 正式域名。
- **VideoRail 自动滚动速度是帧率相关的**：`speedRef = 0.75px/帧`（注释按 60fps ≈ 45px/s 写），本机实测 97px/s ≈ 120Hz 下的两倍。属既有实现，本轮未改（改成按时间积分会改变手感，超出视觉改造范围）。
- `.nav-tail`（53px）比 `.nav-items`（41px）高 12px，1:1 裁片观感可接受，未强行对齐。
- `TiltCard.jsx` / `useParallax` 仍是死代码，删除需用户确认。
- 本轮改动**未提交**；`dist/` 是旧产物，部署前需重新 build。

## Scrollytelling 独立页（2026-10-11，纯 HTML/CSS/JS，不经 React）

用户要一条「滚动驱动视频进度」的作品集短片页。落在 `public/scrolly/`（Vite 原样拷贝，不进构建图），
入口挂在 `Media.jsx` 第二条 `.portfolio-bar`。**访问路径必须是 `/scrolly/index.html`**：
Vite dev 的 SPA fallback 会把 `/scrolly/` 直接回落到根 `index.html`（实测 3117 字节的首页，不是本页）。

### 素材实测（这些数字是决策依据，别再重测）

| 素材 | 时长 | 分辨率 | 编码 | 帧率 | 关键帧 |
|---|---|---|---|---|---|
| 主视频.mp4（原始） | 15.072s | 1280×720 | avc1 | 24fps | **2 个 / 361 帧** |
| 首屏视频.mp4 | 10.080s | 1280×720 | avc1 | 24fps | 1 个 / 241 帧 |

**关键帧稀疏是这条页目的头号障碍**，不是画质问题。真实 Chrome（browser-use 起的实例）实测单次 seek：

| 版本 | 体积 | p50 | p90 | max | 可持续刷新率 |
|---|---|---|---|---|---|
| 原始（2 关键帧） | 2.55 MB | 55.7ms | 101.3ms | 115.2ms | ~17 次/秒 |
| **GOP6（已采用）** | **7.81 MB** | **5.6ms** | **7.7ms** | 9.5ms | **~169 次/秒** |
| 全 I 帧 | 15.91 MB | 4.0ms | 4.3ms | 8.5ms | ~259 次/秒 |

倒放不比正放慢（backward p50 56.5ms ≈ forward 55.7ms）——瓶颈是「从上一个关键帧解到目标帧」，与方向无关。
全 I 帧只比 GOP6 快 1.6ms 却贵一倍体积，所以取 GOP6。重编码命令（用户批准后执行）：

```
ffmpeg -i main-src.mp4 -an -c:v libx264 -preset slow -crf 20 \
       -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p \
       -profile:v high -level 4.1 -movflags +faststart main-gop6.mp4
```

`-sc_threshold 0` 关掉场景切换自动插帧，GOP 才是严格 6；`-an` 丢音轨（页面恒 muted）。
用的 ffmpeg 是 `C:\Users\lzh\AppData\Roaming\bilibili\ffmpeg\ffmpeg.exe`（3.0.1，含 libx264），**没有新装任何东西**。

### 叙事节奏点（抽帧 + 逐帧亮度实测，不是目测）

16 帧等间隔亮度扫描给出两个明确台阶：6.20s→100 / 6.80→106 / 7.40→113，以及 11.40→118 / 12.00→122。
加密到 0.2s 后定位切换区间为 **6.5–7.0s**（特写→椅上办公）与 **11.4–12.0s**（腾空→落地）。
据此定三幕边界 6.8s / 11.6s，写进 `scrolly.js` 的 `ACT_1 / ACT_2`（按 15.072 归一化，运行时再乘真实 duration）。

### 实现要点与踩过的坑

- **一次只允许一个 seek 在飞**：`seeking` 标志 + `seeked` 解锁 + 400ms `SEEK_STALL` 兜底。
  不能读 `video.currentTime` 判断是否到位——seek 在飞时 Chrome 已经返回**目标值**，会误判为「已跟上」。
- **目标时间量化到整帧**（`Math.round(t*24)/24`）：落在同一帧内的两次 seek 显示同一画面，却各花一次解码。
- 三层用 `opacity` + `transition: .5s` 交叉淡入淡出；`is-on` 同帧互斥地开关，交叉淡化由 CSS 承担。
- **隐藏的循环层要 `pause()`**（`applyStage` 里），否则三份 1280×724 解码常驻。尾屏按用户决定改成
  `<img>` 定格（`outro-poster.jpg` = 主视频第 361 帧，109KB），不是第三段视频。
- **点阵遮罩挂在 `.line` 上，不挂在标题容器上**：容器居中时每行的「容器左缘→首字」距离不同，
  圆点网格相位会逐行漂移。每行 shrink-wrap 后相位恒为 0。沿用主站 `Hero.css` 的 `pitch=fs/12`、
  `--dot-r=0.35·pitch`、`--dot-ox=0.95·pitch`、`--dot-oy=0.25·pitch`。
- **窄屏撤掉点阵遮罩**：12 的整倍数在 375px 上放不下 10 个全角字（36px×10=360px > 335px 可用宽），
  降到 24px 又太弱。≤640px 保留 Fusion Pixel 字形、去掉圆点遮罩、字号 30px。
- 视差位移每帧写 `transform`，所以 `.film--parallax` **不能**再挂 CSS `transition`——两套时钟互相拉扯
  （同 2026-10-09 Magnetic 被双重平滑那个坑）。
- 首屏保留 `EPS_TOP=0.007`（约 10vh）而不是严格 `p===0`：滚一格鼠标（~100px）就会把 hero 直接抹掉。

### 视觉验证已补做（2026-10-11 第二轮，headless Edge + CDP）

内置 Browser 面板拿不到可见 surface，于是换了条路：**自己起 headless Edge 并用 CDP 驱动**，
就不依赖面板了。可复用的最小配方（脚本已删，方法记下）：

1. `msedge.exe --headless=new --remote-debugging-port=9333 --user-data-dir=<临时目录> --no-first-run
   --autoplay-policy=no-user-gesture-required about:blank`（**不要加 `--disable-gpu`**，见下）
2. `GET http://127.0.0.1:9333/json` 拿 page 的 `webSocketDebuggerUrl`，Node 24 的全局 `WebSocket` 直连；
3. **连上 page 端点就是 target-relative 模式，不能再调 `Target.attachToTarget`**（回报 `Invalid parameters`），
   直接发 `Page.*` / `Runtime.*` / `Emulation.*` 即可，不带 sessionId；
4. `Emulation.setDeviceMetricsOverride` 改视口 → `Page.navigate` → `Runtime.evaluate`（`scrollTo` 后 sleep 1.6s
   让 seek 落地）→ `Page.captureScreenshot` 存 PNG → 用肉眼读图。
   `Emulation.setEmulatedMedia` 可以模拟 `prefers-reduced-motion`。

### 这一轮改掉的两个真问题

- **文案在亮背景上看不清**（肉眼看截图才发现，数值检查看不出来）。
  实测「标题矩形背后那块画面」的平均亮度（canvas 采样当前帧 + `object-fit:cover` 反算映射）：
  1440px 下 5 个采样点为 **37 / 75 / 116 / 126 / 137**，375px 下最高 **146**。
  白点阵 L≈250 对 L=146 的底只有 **2.75:1**，连大字号的 3:1 都不到。
  修法：`.caption::before` 挂一层 `radial-gradient` 椭圆暗底（核心 α=0.58，86% 处衰减到 0），
  只在文字范围内压暗，不做整屏蒙版。效果是**暗场（L=37）几乎看不出加了东西，亮场（L=146）拉到约 6.6:1**。
  注意 `z-index:-1` 要求 `.caption` 自己是层叠上下文，所以同时补了 `position:relative; z-index:0`
  ——`is-on` 态下 `transform:none` 且 `opacity:1`，两个都不产生层叠上下文，少了这一条暗底会沉到 `.stage` 背后彻底看不见。
- **`prefers-reduced-motion` 下首屏循环没停住**。只在脚本里 `intro.pause()` 不够：
  autoplay 的启动是排队任务，跑在这次 pause 之后（实测 `t=3.55 / paused=false`）。
  改成 `removeAttribute('autoplay')` + 在 `play` 事件里持续钉回 `pause(); currentTime=0`，
  实测 `t=0 / paused=true`，滚走再滚回仍保持静止。视差位移本来就带 `!reduce` 门，未动。

### 素材更新（首屏换无水印版）

| 素材 | 时长 | 分辨率 | 体积 | 说明 |
|---|---|---|---|---|
| `intro.mp4` | 10.080s | 1280×720 | **1.518 MB** | 用户 2026-10-11 提供的「首屏视频（新版）」，右下角烧录水印已消失（截图肉眼确认），直接覆盖同名文件，代码零改动 |
| `main.mp4` | 15.083s | 1280×720 | 7.81 MB | GOP6 重编码版 |
| `outro-poster.jpg` | — | 1280×720 | 109 KB | 主视频第 361 帧定格 |

### seek 延迟的三个环境读数（同一份 GOP6 文件）

| 环境 | 正放 p50 | 倒放 p50 | p95 |
|---|---|---|---|
| browser-use 真实 Chrome 实例 | **5.6ms** | — | 7.7ms |
| headless Edge，**不加** `--disable-gpu` | 13.1ms | 8.5ms | 18.6ms |
| headless Edge，`--disable-gpu`（纯软解） | 23.2ms | 23.1ms | 29.4ms |

结论只敢说到这一步：**同一份文件，seek 成本随解码路径在 5.6–23ms 之间摆动，最坏 max 33ms**。
页面每帧最多发一个 seek（`seeking` 门 + 整帧量化），所以软解兜底下也是「约 40 次/秒刷新」而不是卡死。
至于「倒放到底比正放慢还是快」——第一轮测出「一样慢」（56.5 vs 55.7，原始稀疏关键帧版），
这一轮 headless 反而测出倒放更快（8.5 vs 13.1），**方向依赖性列为未证实**，别拿它做设计依据。

### 其余已实测通过

- 状态机与时间轴：16 个采样点（1440/900/375 三档 × 5-6 个滚动位）全部满足
  `layers`/`caps`/`ct` 三者一致，`ct` 全是 1/24 整倍数（1.5 / 4.5417 / 8.2917 / 12.0833 / 15.0417）。
- 断点：1440→hero 72px、act 60px；900→48/40；375→30px 且 `masked=false`（≤640 撤遮罩按设计生效）。
- 遮罩参数实测：`radial-gradient(circle, #000 2.1px, transparent 2.7px)` / `mask-size 6px 6px`
  / `mask-position 5.7px 1.5px` —— 与 `pitch=fs/12`、`r=0.35·pitch`、`ox=0.95·pitch`、`oy=0.25·pitch` 逐项对上。
- 淡入淡出：`.layer` 计算值 `0.5s opacity`，`.caption` `0.5s, 0.7s, 0s` —— 符合规格的 0.5s fade。
- 首屏 `autoplay` 真的起播：`t` 从 3.95→5.16→6.93 递进，`paused=false`，`error=null`（第一轮的 `paused=true` 是隐藏页环境所致）。
- 光标视差：`Input.dispatchMouseEvent` 打到 (120,120) 与 (1320,780)，`#v-intro` 的 `transform`
  实测 `+10.83/+6.6px` ↔ `-10.83/-6.6px`，方向相反、lerp 生效。`scale(1.08)` 在 1440×900 上
  给出水平 57.6px / 垂直 36px 余量，大于 26/18px 的最大位移，不会露黑边。
- 零横向溢出（三档 `scrollWidth-innerWidth` 都是 0）；字体族解析为 `Fusion Pixel 12px …`（自托管生效）。
- `npx eslint src/` 0 error；`npx vite build --outDir dist-verify` 通过。

### 仍未做 / 待决定

- **手感类判断给不了数值**：60fps 下跟手是否「顺」、视差幅度是否舒服，只能由用户在自己浏览器里滚一遍定。
- `.gitignore` 无 mp4 规则，三个新素材（**9.44 MB**）会被 `git add` 收进去；**是否入库等用户点头**。
- 本机 `127.0.0.1:51351` 端口的进程在本轮被误杀（`taskkill` 时把 netstat 里预存在的 PID 认成了自己起的
  临时服务）。内置 Browser 面板随后就拿不到可见 surface，**时间吻合但因果未证实**；重启 Qoder 应可恢复。
  本轮的视觉验证是绕开面板做的，面板本身仍未恢复。

## 影片层搬进首页 + 留白分区（2026-10-11 第三次，未提交）

需求转向：scrollytelling 不做独立页，**直接落在首页 `/`**。首屏用「首屏视频（新版）」跟鼠标，
其余全程用主视频、进度跟滚动。用户两项决定：① 手工搭的天光/数字雨/穹顶/缘光/手灯五层
**彻底移除，只留视频**；② **整页都铺在主视频上**。

### 结构

- `src/components/FilmStage.jsx` + `FilmStage.css`：三层 `<video>` 同时渲染，`opacity` 切换（0.5s），
  `.film-layer--intro`（鼠标视差 `scale(1.08)`）/ `--main`（滚动驱动，`scale(1.12)`）/ `--outro`。
  常量：`FPS=24`、`SEEK_STALL=400`、`HANDOFF=0.35`、`FILM_K=1.12`。
- 各板块背景改为「方向遮罩 + 平坦档」两层，透明到能看见影片；`Hero.jsx` 里的旧背景层已删。

### ⚠️ 最大的一个坑：`object-fit: cover` 是**裁切**，不是溢出

`cover` 把媒体裁进元素盒子，**绝不会画到盒子外面**。所以给一个 `inset:0`（=视口宽）的 cover 元素
加 `translate3d` 时，位移一超过 `(k−1)/2 × 视口宽`（k=1.12 时是 85px）**画面边缘就整条被拖走，
露出 `.film-stage` 的黑底** —— about 那一屏左边 90px 全黑就是这么来的，而且碰撞检测脚本完全查不出来。

修法：盒子本身比视口宽 —— `.film-layer { left:-6%; width:112% }`。盒子中心仍在视口正中，
cover 的映射一点没变（媒体都是 1.25 倍居中），只是裁切边界跟着放宽了。
**于是平移预算变成纯几何量，与素材无关：横向 ±0.06×1.12×W ≈ ±0.127W、纵向 ±0.06H。**
`FilmStage.jsx` 的 `DODGE` 表就是照这两个上限定的（最大 x 用了 0.122，留余量）。
另一条同类警告：**不要给 `.film-layer` 加 `will-change`** —— 会把 `<video>` 提升成独立合成层，
headless 的 `Page.captureScreenshot` 从此拿不到稳定帧（25s 超时）。

### 信息道（`--lane-w`）：文字走影片留白的那一侧

`global.css` 每个板块一个 `--lane-w`，= (该板块居中帧的主体最左 x − 60) / 1320，向下取整留 10px 气口：
about 38% / strength 48% / experience 48% / work 46% / media 46% / account-ops 43% / footer 47%。
配套 `DODGE` 把画面往反方向推开。主体位置是 `lanes.js` 量的（canvas 画视频帧 → 亮度 0.2126R+0.7152G+0.0722B
→ 4× 降采样 + 可分离盒式模糊 R=14 做背景减除 → `|gray-bg|>13` 且连续 ≥3 列算主体）。

- **media 是有意例外**：泼咖啡那一镜满屏都是飞散物件，轮廓检测在 x 73–297 就报警，没有干净一侧可收，
  所以它的道宽按对比度定（平坦档给到全站最强 0.66），不按主体定。
- 限宽只限内容：五个板块同时带 `.section` 与 `.wrap`，`.wrap` 的宽度约束会把下潜底色切成中间一根柱子
  （>1820px 视口时两侧露出 body 纯黑）。改成等价的 `padding-inline` 后列宽不变、底色与缘光铺满整幅。
- `.footer-inner` **不能**限宽：`.wrap{margin:auto}` 会把它重新居中，要限的是它的直接子元素。
- 窄屏（≤900px）撤销分区：竖屏 cover 只留画面中间一条，头肩占满整幅，没有「另一侧」可让，
  退回「整幅压暗 + 内容满宽」。

### 对比度：从目测改成量合成结果

`--lane-w`/`DODGE` 只保证「字形不压在主体上」，不保证读得清。声明的 `color` ≠ 屏幕上的颜色
（点阵遮罩、半透明底色、影片亮部都会改它），所以只能量截图合成结果：
`Page.captureScreenshot` → base64 回灌进页面 → canvas `getImageData` → 逐字墨迹框取 WCAG 相对亮度。

**改掉的三处（都是实测出来的真问题）：**

1. **文字色阶从四档收成三档**：`--text-dim #8f8b8e → #a3a0a2`，`--text-muted #6f6a6d` **退役**
   （5 处引用改指 `--text-dim`）。依据：影片文字区背景亮度实测 0.002–0.034（about 最亮、footer 最暗），
   4.5:1 反推最低档不得低于 L≈0.33；而 `#6f6a6d`（L 0.148）在 about 那一屏只有 **2.62:1**，
   「记者团宣传部干事 · 2026年应届生」这种实信息基本读不出。第四档在影片背景上根本站不住，
   层级改由字号/字重承担。
2. **首屏右栏加局部压暗**（`Hero.css` 的 `.hero` 两层渐变）：首屏整屏没有遮罩，副文案落在打光的墙上，
   实测背景 **L=0.142（全站最亮）**、`#c8c6c4` 只有 **3.1:1**。横向 55%→82%（从人头右缘之后才开始咬）、
   纵向底部往上 60% 收干净 → 实测这两行 3.1 → **8.77 / 9.82:1**（`final-1440.log` 里 x=974 那两行），
   首屏整屏最低仍是左侧大标题的 5.51:1；标题区没动过（本来就 5.0:1 起）。
3. **窄屏给文字垫羽化暗板**（`Hero.css` 的 `.hero-sub`、`About.css` 的 `.about-copy p`）：
   竖屏 cover 把整张脸推到正文后面，about 导语实测背景 L=0.140（眼白的亮度）、**2.12:1**。
   把整块平坦档提到压得住眼白需要 0.92，影片就没了；只给文字本身垫板 → **7.67:1**，
   脸在段落之间的空档里照样露出来。

**最终实测（`Range.getClientRects()` 取墨迹、祖先链 opacity 过滤、行距/元素盒内取背景）：**

下表是本轮三处布局改动**之后**重跑的五个视口（原始输出 `after-1440/1280/1241/1024/390.log`）：

| 视口 | hero | about | strength | experience | work | media | account-ops | footer | 采样点 |
|---|---|---|---|---|---|---|---|---|---|
| 1440×900 | 5.49 | 4.97 | 4.92 | 6.12 | 6.30 | 5.46 | 7.33 | 9.39 | 71 |
| 1280×800 | 5.09 | 4.84 | 4.98 | 6.01 | 6.21 | 6.69 | 7.27 | 9.38 | 65 |
| 1241×800 | 4.73 | 4.87 | 5.04 | 5.92 | 6.15 | 6.22 | 7.23 | 9.33 | 65 |
| 1024×768 | 6.03 | 5.62 | 5.00 | 6.08 | 6.06 | (1.06)\* | 7.04 | 9.36 | 65 |
| 390×844 | 7.52 | 5.64 | 6.18 | 6.33 | 6.63 | 5.33 | 7.51 | 9.07 | 60 |

（每格 = 该板块最低的一条**画得出来的**文字，全部 ≥4.5:1；1241 是两条断点上方的最窄两列档。）
\* `media` 那一格是探针假阳性，不是页面问题：那一行「AI 产品出海实战活动」的墨迹框在 1024 下
落在跑马灯的裁剪区里，`getClientRects` 照报布局位置，量到的是一块什么都没画的区域
（text 0.095 ≈ bg 0.087 就是特征），截图那个位置根本没有字。它在 1241/1280/1440 三次采样里
**根本没进样本集**（被视口边界和 60px 宽度下限挡掉），所以不能拿别的宽度的数当「同一行改好了」的证据 ——
判别只靠 `elementFromPoint` 和截图，见下面「假阳性教训」第 4 条。

**hero 和 media 两格在同一个宽度上重跑会漂**（hero 1241：4.55 ↔ 4.73；media 1440：5.46 ↔ 7.04、
390：5.33 ↔ 7.00）：首屏光晕跟着指针走、`media` 的跑马灯自己在横移，两者都在动文字底下的背景，
所以这两格要当**区间**看，不是稳定值。
**其余六格跟上一版基线（`final-1440.log` / `final-390.log`）逐格完全相同**（1440 的 about/strength/
experience/work/account-ops/footer 与 390 的对应六格，漂移 0.00；1440 的 hero 5.51→5.49 属光晕漂移），
即本轮布局改动**没有动到宽屏和手机的对比度**。

### 实测出来的两个真问题

**① 信息道「百分比减固定像素」把正文挤没（`Experience.css` 的 `.experience-item`、`About.css` 的 `.education-grid` 两条新断点）**

`--lane-w` 是百分比，板块内部又写死列宽和 gap —— 道变窄时减掉的 120px 是**定值**，
正文列不是线性变窄而是超线性塌掉。用 `geom.js` 沿视口宽度扫（`node geom.js W H .selector`，
打印容器链和计算后的 `grid-template-columns`）：

| 视口 | `.experience-text` | `.education-skills` |
|---|---|---|
| 1440 | 306px | 291px |
| 1280 | 230px | 250px |
| 1180 | 182px | 221px |
| 1151 | **168px** | 217px |
| 1024（改前） | **68px** | 180px |

1024 下正文列只剩 68px —— 一行五个字，整节散架（`lane-before-1024-experience.jpg`）。
原先的堆叠断点在 800px，管不到这一段。

**改法**：各加一条堆叠断点，把**内部列**收成单列（日期移到正文上方）。
**缩的是内部列，不是让位** —— 主体在画面右侧跟视口宽度无关，所以 `--lane-w` 和 `DODGE` 一律不动。
两个断点数字不同是各自量出来的：Experience 的列宽随视口约 0.48px/px，210px（≈14 字/行）
是能读的位置 → 反推视口 1238 → 定 **1240**；About 的 38% 道本来就宽，1151 处右列还有 217px，
所以留在 **1150**。复测：1241 两列 211px（`lane-after-1241-experience.jpg`）、
1240 单列 410px；1024 由 68 → **268px**（`lane-after-1024-experience.jpg`）、
教育右列 180 → **307px**（`lane-after-1024-about.jpg`）；1440 两处的 `grid-template-columns` 与改前逐字节相同。

**② 教育块日期列被「gap + padding」双份留白饿死（`About.css` 的 `.education-period`）**

`.education-grid` 已经有 `gap: 60px`，`.education-period` 自己又写了 `padding-right: 60px`，
两块空白叠成 120px，日期 `<p>` 的内容盒在 1440 下只剩 84px。字符串 `2022.09 — 2026.06`
实测 13px 等宽下整行 **133px**、前半 `2022.09 —` **70px**，于是 1280 时内容盒 64px
→ 断成 `2022.09` / `—` / `2026.06`，**破折号单独一行**（1151 的截图里看得见）。
**这条跟本轮改版无关，是仓库里原来就有的**，1280 是最常见的笔记本宽度所以一直在漏脸。

第一反应是把多余的 `padding-right` 整个删掉，但**删干净反而引入新问题**：列宽随视口连续变
（实测 1151→108px、1280→124、1366→135、1440→144），总有某个宽度刚好容得下 133px 的一整行，
字尾离分隔线只剩 **2px**（1366 那一档，1352–1440 整段都在 11px 以内）—— 数字是量出来的，不是猜的。
所以最终留 **24px**：让日期在两列档里任何宽度下都稳定断成 `2022.09 —` / `2026.06`，
最窄的 1151 处内容盒 84px、前半 70px，字尾离线 38px；1440 处 74px。

| 视口 | 内容盒（改前 → 改后） | 改后断行 / 字尾离线 |
|---|---|---|
| 1440 | 84 → 120px | 两行 / 74px |
| 1366 | — → 111px | 两行 / 65px |
| 1280 | 64 → 100px | 两行 / 54px |
| 1151 | 48 → 84px | 两行 / 38px |
| ≤1150（堆叠） | — → 361px | 一行 / 分隔线一并撤掉 |

顺带两件：**堆叠之后那条 `border-right` 会悬在信息道右缘**（右边什么都没有），所以把
`border-right: none` 从 ≤800 提到 ≤1150 那一档；≤800 里因此空转的 `padding-right: 0` 删掉。
分隔线本身画在列的**边框**上，padding 改多少都不动它的位置。

### 顺手清掉的死 token：`--sky-*`

首屏改成影片层后，天光那几层没了，`--sky-core / --sky-mid / --sky-edge` 在 `src/` 里
`var()` 命中数 = 0，已从 `global.css` 删除（命名约定注释同步改掉，并注明退役原因）。
这符合本项目「不要留下无定义的 var()」的既有约定（前几轮做过两次同类审计：`--text-main` 残留、
「残留审计已清零」那两条记录）。
**注意 `public/scrolly/scrolly.css` 里另有同名的三个变量，那是独立页自己的副本，仍在用（`:271`），
两边不是一回事，别再跨文件搜个同名就删。** 删的都是零引用声明，不影响渲染，故未重跑对比度。

### 探针自身的五个假阳性教训（写下来免得又信一次坏数据）

- **Node 模板字符串会吃掉正则里的 `\(` `\)`**：`/rgba?\(([^)]+)\)/` 在模板里变成 `/rgba?([^)]+)/`，
  捕获组吃进左括号 → `parseFloat` 出 `NaN` → `NaN >= bg` 恒 false → **每一个元素都去采暗尾**，
  整张表全报 1.0:1。改用 `[(] [)]`。这类「全部一样」的结果本身就是信号，别当结论用。
- **`element.getBoundingClientRect()` 不能当墨迹用**：块级元素报的是整列宽，会假碰撞；必须用 Range。
- **背景取样点必须在元素自己画出来的范围内**：整幅排满的段落，「墨迹右侧 6px」正好落在暗板外面，
  板明明生效（截图看得见）却读出 2.1:1 的假失败；而行高 1.12 的大标题，「下方 6px」又压在下一行字上
  读出 0.559 的「背景」。改成两条候选（行距内 / 盒内右侧）都算、报较差的那个。
- **`Range.getClientRects()` 报的是布局，不是绘制**：被 `overflow:hidden` 裁掉的那一行，
  rect 照样在视口内、照样通过过滤，于是量到一块什么都没画的区域。
  特征是 **text 分位数 ≈ bg 分位数**（1024 下 `.media` 的「AI 产品出海实战活动」text=0.095 / bg=0.087 →
  「1.06:1」，而截图那个位置根本没有字，元素盒右缘 1158 早已出屏）。
  判别办法：`elementFromPoint` 命中自己**或自己的后代**才算画出来了，命中祖先＝被裁（`paintcheck.js`）。
  注意 `paintcheck.js` 用的是元素盒中心，宽元素中心出屏会走 `offscreen` 分支而漏判 —— 要量墨迹矩形本身。
- **探针自己也会算错，别拿它当决策依据**：`midcheck.js`（本轮写的中间态检查）在**已知没问题的 1440**
  上就误报 5 个板块，还报出「墨迹右缘 6651」这种超出视口的数 —— 因为它把被裁掉的跑马灯文字也算进去、
  并且对所有 y 带一视同仁。发现探针在对照组上失败，正确动作是**丢掉这个探针**回到已验证的 `contrast.js`，
  不是拿它的结论去改页面。该文件已删。

### 废弃件清理（用户点头后做的）

`HeroGlobe.jsx` / `HeroDigits.jsx` **已删除**（2026-10-11，用户明确授权）。删前三项核对：
全库 grep 只剩 `Nav.jsx:45` 的一句注释、没有任何 `import`；两个文件用到的 16 个 class
（`hero-globe*` / `hero-digits` / `bulb-*` / `rim-brick|ember|peak`）在 `src/**/*.css` 里
**一条选择器都没有**，全是 inline/SVG stop 样式 → 删完不留死 CSS。
**最硬的一条证据**：删前删后 `vite build` 产物哈希完全相同（`index-Dya2qOYa.js` 245.51 kB），
说明它们本来就被 tree-shake 掉了，对页面零贡献。`eslint` / `build` 均 exit 0。
两份在 HEAD 里还有旧版本（`git checkout HEAD -- <路径>` 取得回），但工作区那版是「天光／极性反转」
那一轮的改动，随着首屏图层整体移除已经作废。

**没删的两个，理由不同，别再当垃圾扫掉：**

- `TiltCard.jsx` —— `global.css:640` 明写「当前未被引用，**保留待用**」，是前一轮留的有意决定，
  不是漏网。要删得再问一次。
- `useParallax` —— 它**不是文件**，是 `src/hooks/useScroll.js:74` 里的一个导出。同文件的
  `useScrollProgress` / `useScrollDirection` 正在被 `Nav.jsx` 用着，所以只能删这一个函数、
  不能删文件。零引用已确认，等用户点头。

### headless CDP 环境（本轮新增）

- `document.visibilityState === 'hidden'` 会**同时**停掉 IntersectionObserver 和节流 rAF
  → 必须先 `Target.activateTarget`（这个方法在 browser endpoint 上，不在 page session 上）。
- **`activateTarget` 只做一次不够**：第二次起页面又回到 hidden，rAF 完全不跑，
  所有滚动驱动的量为零。启动无头 Edge 时要带
  `--disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-features=CalculateNativeWinOcclusion`。
- **零值不等于通过**：`visibility=hidden` 时所有 `got` 都是 0，而 `0 < 0` 为假 → 单调性打印「OK」，
  在什么都没发生的数据上报了成功。探针必须自带有效性闸门（本轮是 `valid = vis==='visible' && frames>=4`），
  无效时输出「无效」而不是判定。
- **Qoder 内置浏览器量不了 rAF**：它在 `hidden` 且 `hasFocus:true` 时照样能执行 JS、能读 console，
  但 rAF 一帧都不发 —— 看得到日志不等于测得到动画。
- navigate 之后**第一次** `captureScreenshot` 必挂 → 先做一次预热截图。
- 有 `<video>` 在播时 `captureScreenshot` 挂住 → 先 `pause()`。
- `html{scroll-behavior:smooth}` 要用 `scrollTo({behavior:'instant'})` 才跳得过去。
- Vite HMR 会在复用的页面里留下旧布局状态 → 量之前一定 `Page.navigate` 重来。
- Git Bash 的 heredoc 会吃 JS 字符串里的 `\\n`；写脚本一律用 Write 工具。

### 仍未做 / 待决定（更新）

- ~~`HeroGlobe.jsx` / `HeroDigits.jsx`~~ **2026-10-11 已删**（见上面「废弃件清理」）。
  `TiltCard.jsx`（`global.css:640` 注明「保留待用」）和 `useParallax`（`useScroll.js:74` 的一个导出，
  同文件另两个导出在用）仍是死代码，删不删等用户点头。
- `CursorGlow.jsx` 的 `litBottom = 0.66`：原先是已删除的天光带下沿，现在这个数正好落在首影片那一镜
  的人头下沿（实测头占 y 0–607/900 = 0.67），语义没变，**只改了注释、没动常数**。
- 手感类判断仍给不了数值：60fps 下跟手是否「顺」、避让推镜的幅度是否舒服，只能由用户自己滚一遍定。
- **版本存档**：用户明确「先把现在遇到的问题解决，其次再考虑是否需要用 git 存档或 GitHub 保留版本」，
  所以 `backups/2026-10-11-film-stage/` 那个提案**搁置中**，git/GitHub 也还没动。
  已核实的前提（别重复查）：`.githome` 里本轮改动**零提交**，会话开始前的状态本来就没提交过，
  所以 git 回不到「改版前」；桌面原始素材文件仍在；`backup-20261011-film/` 是**参考件不是回滚件**
  （它早于信息道那一轮，与现版差异 473/199/122 行）。
- `.gitignore` 无 mp4 规则，三个素材（**9.44 MB**）会被 `git add` 收进去；**是否入库仍等用户点头，目前零提交**。
- 本轮所有改动**未提交**；`dist/` 是旧产物，部署前需重新 build。
- 本轮三处 CSS 改动（Experience 断点提到 1240、About 新增 1150 堆叠、About 日期列去掉重复 padding）
  之后复跑：`npx eslint src/` exit 0；`vite build --outDir dist-verify` exit 0
  （157ms，CSS 52.97 kB / JS 245.51 kB，gzip 10.99 / 79.12 kB），产物目录已删。
- **滚动机制本身已实测正常**（`functional.js`，1440 与 390 各跑一遍）：下滚 `currentTime` 单调递增、
  上滚递减，误差 ≤0.02s；`HANDOFF` 交递点正确；视差推镜在动。控制台无报错。
  也就是说本轮唯一找到的真缺陷就是上面那条信息道挤压。

### 复测脚本清单（留在 scratch 里，别当垃圾删）

`C:\Users\lzh\Documents\Qoder\2026-10-11\86bb0198\`，744 KB / 21 个文件 + 2 个目录：

- 探针 8 个：`contrast.js`（对比度，主力，已验证）、`lanes.js`（主体轮廓）、`check.js`（碰撞）、
  `shot.js`（分区截图）、`face.js`（`CursorGlow` 那个 0.66 常数的出处，**别删**）、
  `geom.js`（容器链 + 计算后的 `grid-template-columns`，`node geom.js W H .selector`，
  就是它量出 68px 正文列）、`paintcheck.js`（`elementFromPoint` 判画没画）、
  `functional.js`（滚动→seek／交递／视差，自带有效性闸门）。
- 日志 8 个：`after-1440/1280/1241/1024/390.log`（修完之后的 AA 表）、`final-1440/390.log`（修之前，
  上面对比表的对照组）、`lanes2.log`（留白分区原始输出）。
- 证据截图 5 个：`lane-before-1024-experience.jpg`（68px 正文列散架现场）、
  `lane-after-1024-experience.jpg`、`lane-after-1024-about.jpg`、
  `lane-after-1241-experience.jpg`（两列最窄档）、`lane-after-1280-about.jpg`（日期不再断出孤立破折号）。
- 目录 2 个：`frames/`（20 张抽帧＝留白分区的证据）、`backup-20261011-film/`（改版前 Hero 图层）。
  这两个等用户认可新版观感后再删。
- 已按名删除（不 glob 扫）：`midcheck.js`（对照组上就失败的坏探针）、`killedge.ps1`、`who.ps1`、`edge.log`、
  一次性截图 23 张（`con-*.jpg` ×8、`shotw1024*.jpg` ×8、`shotc1024media.jpg`、`shotm390media.jpg`、
  断点定案前的 `shotz*.jpg` ×5）。
- 无头 Edge 已收尾：本轮为量断点起了三次，`taskkill /PID 20108`、`/PID 24544`、`/PID 20080` 各收一棵进程树，
  靠命令行里 `--user-data-dir=…\86bb0198\edge-profile` 这个专有路径确认全是自己起的
  （`Get-NetTCPConnection -LocalPort 9333` 拿监听 PID → `Get-CimInstance Win32_Process` 查它的 CommandLine
  → 比对路径，**不是按进程名杀**），三次杀完都复查 `msedge.exe` 里带 `edge-profile` 的残留数 = 0，配置目录已删。
  **踩坑**：比对时别在 bash 的 `case` 里写带反斜杠的 Windows 路径 —— `*86bb0198\\edge-profile*` 没匹配上，
  脚本走了「不是我的」分支没杀，而同一行的 `rm -rf edge-profile` 照跑，结果在浏览器还活着的情况下
  把 profile 删成半死不活的一堆 `Device or resource busy`。改成只匹配 `*edge-profile*` 才杀掉。
  **顺序必须是：验身份 → 杀 → 复查残留 = 0 → 再删目录**，反过来会留一地锁冲突。
  上一轮那个 490 MB 的 `%TEMP%\qoder-film-edge` 同样已删；`%TEMP%` 里其余当日目录属别的工具，未动。
  **本轮的 profile 特意放在 scratch 目录而不是 `%TEMP%`**，避免和别的工具混在一起。
  重起无头实例后要记得它默认开的是 `edge://sync-confirmation-dialog/` 和 MSN 新标签页，
  没有 localhost target，得先 `curl -X PUT "http://127.0.0.1:9333/json/new?http://localhost:5173/"`。

## 素材核对与 VideoRail 封面重做（2026-10-11 第四次，未提交）

桌面两份素材（`C:\Users\lzh\Desktop\作品集.pptx`、`李纵横15087322631.pdf`）与站内内容做了逐项对照。
**核对方法（可复跑，别凭肉眼再来一遍）**：pptx 当 zip 用 `zipfile`+`lxml` 直读 `ppt/slides/slideN.xml`，
按 EMU 坐标（914400/inch）把文字块与图片配对，`_rels/slideN.xml.rels` 解 rId→media；
站内同名图片用**字节 md5 一致**才敢套用 PPT 里的结论（唯一例外 `image15_compressed.jpg` 是重压缩过的）。
**踩坑**：视频节点是 `<a:videoFile r:link>`（drawingml 命名空间）＋`<p14:media r:embed>`，
按 `p:` 去找全是 `None`；`<a:blip r:embed>` 不带命名空间取属性同样全空。

### 封面错配的根因（重要，别再犯）

09-28 那次「删除未引用的 `public/assets/pptx-media/` 8 个遗留文件」，删掉的**正是 6 张真视频封面**
（image14/16/17/19/20/22 等），卡片随后被随手填了别的图 → 11 张卡里 10 张封面与视频无关
（例如「阿里云栖大会宣传视频」挂的是 PPT 第 1 页的 AI 出海海报）。
**所以：现在被换成 `video-covers/` 后重新变成"未引用"的 image7/8/10/11/12/13/18/23/15_compressed
一律不许删**，它们是 PPT 原始海报，删了就又回到这次 bug 的起点。

### PPT 权威映射（实测：海报 → 内嵌 mp4 → 时长/分辨率 → 新封面取值秒数）

| 卡片 | 海报 | mp4 | 时长 | 分辨率 | 封面 |
|---|---|---|---|---|---|
| 01 虎扑视频 | image21 | media8 | 18.18s | 1920×1080@60 | t=2 字卡 |
| 02 云栖宣传 | image14 | media1 | 37.71s | 3840×2160@30 | **t=34**「云栖大会 欢迎你的到来」 |
| 03 飞书训练营 | image17 | media4 | 60.42s | 3840×2160@30 | **用户提供的截图**（AIPO 校园AI创投活动·飞书 正式启动） |
| 04 云栖总结 | image15 | media2 | 119.44s | 3840×2160@30 | t=5 |
| 05 秒哒切片 | image23 | media6 | 96.94s | 1920×1080@30 | **t=90** 朱广翔金句帧 |
| 06 万相活动 | image16 | media3 | 114.15s | 1280×720@30 | **t=105**「AI切磋大会 NO.22 龙虾街区」 |
| 07 万相切片 | image20 | media9 | 106.72s | **960×1280 竖** | t=75 |
| 08 直播切片合集 | image18 | media5 | 45.49s | **960×1280 竖** | t=26 |
| 09 剪辑加调色 | image19 | media10 | 18.79s | 1920×1080@60 | t=6 落日镜 |
| 10 动漫混剪 | image22 | media7 | 15.07s | 1920×1080@60 | t=5 |
| 11 AI 工作流分享 | image18（同 08） | media5 | 同上 | 竖 | t=2 |

**加粗三项是 2026-10-11 用户第二轮点名指定的秒数，覆盖了我原来的选帧 —— 别再"优化"回去。**
卡 03 的封面不是抽帧，是用户给的 `chat-attachment-staging/7d4efb6f-…​.png`（2559×1439，已等比缩到 1280×720）。

选帧不是自动的：先 1fps 缩略图跑场景切分打分（`pick.py`）出候选，再逐个视频看 24 格 filmstrip
（`pick2.py`）**人工定秒数**，最后 `pick3.py`/`pick4.py` 抽全帧；第二轮改帧用 `pick5.py`。
**竖屏 3 张**（07/08/11）用「模糊填充」合成 16:9（背景 cover＋高斯模糊 28＋压暗 0.72，前景按高度缩放居中），
因为槽位是 `aspect-ratio:16/9` + `object-fit:cover`，直接放竖帧会被裁掉标题和字幕。
产物：`public/assets/video-covers/*.jpg`，11 张全部 1280×720，合计 **1.07 MB**（单张 30–183 KB）。
`.gitignore` 无 jpg 规则，`git add` 会收进去。

### 顺手修掉的链接

`videos.js` 里云栖宣传那条写成了 `1eWKSfh2…`（大写 S），PPT 原文是 `1eWKsfh2…`。
百度网盘分享码区分大小写 → 点开 404。**已改回小写**，全站只有这一处出现该 ID（已 grep 确认）。
其余 8 条链接逐字符比对与 PPT 一致。

### 验证（本轮实测）

`npx eslint src/data/videos.js` exit 0；`vite build --outDir dist-verify` exit 0
（918ms，CSS 52.99 kB / JS 245.55 kB，gzip 11.00 / 79.17 kB），产物目录已删。
`vite --port 5199` + browser-use：22 个 `.video-rail-poster img`（轨道重复一份）全部 `1280x720`，
`bad=[]`，控制台无报错；截图确认 3D 轨道里新封面正常。dev server 已按命令行含 `5199` 精确杀进程
（**不是按进程名杀**），端口只剩 TIME_WAIT。

### 仍未处理（用户本轮没下指令，别擅自动）

- **卡 11「AI 工作流分享视频」与卡 08 同源**：PPT 只有 10 个视频，卡 11 的 `link` 还是飞书那条
  （`…fuz-Uyw?pwd=mwcy`），等于两张卡指向同一个不属于自己的网盘。要么给它独立视频＋链接，
  要么与卡 08 合并 —— 等用户定。本轮只保证它的封面取自 media5 的另一帧（t=2），不与卡 08 重复。
- **卡 03 与卡 11 共用同一条飞书链接**（`…fuz-Uyw?pwd=mwcy`）。卡 03 的封面用户 2026-10-11 已定为
  「AIPO 校园AI创投活动·飞书 正式启动」那张截图，即承认这条视频就是飞书那条活动片；
  误点网盘链接跳到的分享页里只有一个文件「飞书商务——多维表格.mp4」（永久有效，150\*\*\*\*\*631），
  **卡 11 到底该用哪条网盘链接仍未定**。
- ~~抖音作品墙 6 条文案与数字~~ —— **2026-10-11 第五次已处理**，见下一节。
- 素材里查不到的：商界传媒经历、`Experience.jsx` 硬编码的「20,000+ 校运会」、1000W+/270W+ 口径。

### 中间产物

脚本与证据在 `C:\Users\lzh\AppData\Local\Temp\audit-20261011\`（27 MB）：
`extract.py`/`geom.py`（PPT 结构）、`pick.py`（自动打分候选）、`pick2.py`（filmstrip，**定秒数靠它**）、
`pick3.py`/`pick4.py`（抽帧出图）、`pick5.py`（第二轮按用户指定秒数重抽＋截图转封面）、
`sheet.py`/`sheet2.py`（复核拼图）、`out/*.txt`（映射与文本证据）、
`png/film-*.png`（10 张 filmstrip）、`png/covers-sheet.png`（11 张封面复核表）。
临时 mp4（合计约 760 MB）逐个抽完即删，`vid/`、`film/`、`covers/`、`stage/` 已清空。
**踩坑**：`-ss` 放在 `-i` 之前是输入定位，对 4K/60fps 源会漂到转场帧（media1 t=2 抽到动画中间帧、
media10 t=6 抽到「夏」字卡），改成 `-i` 之后 `-ss`（解码定位）才拿到指定秒；
这台机器只有 `…\bilibili\ffmpeg\ffmpeg.exe`，**没有 ffprobe.exe**，时长/分辨率得从 `ffmpeg -i` 的 stderr 正则取。

---

## 抖音作品墙补全与数据核实（2026-10-11 第五次，未提交）

### 做了什么

1. `C:\Users\lzh\Desktop\抖音\新建文件夹\` 的 5 张新截图（1552×3317）压成 800×1709 JPEG，
   按文件名顺序装为 `public/assets/douyin/douyin-11.jpg … douyin-15.jpg`，合计 **1.15 MB**
   （单张 148–316 KB，quality=85 progressive），与已有 10 张同规格。
2. `src/data/douyinWorks.js` 全表重写：10 张老截图逐条重读，**8 条杜撰文案换成截图实测文案**；
   追加 5 条新作品；修掉原来 id 4↔`douyin-05.jpg`、id 5↔`douyin-04.jpg` 的错位，
   现在 **id N 与 `douyin-0N.jpg` 一一对应**。
3. 截图↔素材图的配对是用灰度平均绝对差证明的：第 k 张截图（按文件名排序）对 `douyin-0k.jpg`
   差值 3.1–3.3，对次优候选 ≥41.8，不存在猜。

### 15 条实测对照（日期＝截图上的发布日；数字＝赞 / 评 / 藏 / 转）

| id | 文件 | 日期 | 实测文案首句 | 赞/评/藏/转 |
|---|---|---|---|---|
| 01 | douyin-01 | — | 北伐失败，怎么不找找自己问题 | 2.7万/300/1764/— ｜**播放 266.8万** |
| 02 | douyin-02 | 2025-11-30 | 老法拉利怎么啦？依旧霸气外露 | 3.1万/356/1462/4138 |
| 03 | douyin-03 | 2024-08-11 | 「网红」黑神话悟空 | 1.4万/310/559/906 |
| 04 | douyin-04 | 2024-09-02 | Passion! | 1.2万/257/1020/1040 |
| 05 | douyin-05 | 2025-07-08 | 诶！我不是天才吗？ | 1.4万/103/3582/1259 |
| 06 | douyin-06 | 2025-07-10 | 为什么《强风吹拂》没有第二季？ | 7880/56/1747/448 |
| 07 | douyin-07 | 2025-01-01 | 黑田朝日！牛X！ | 5944/123/571/505 |
| 08 | douyin-08 | 2024-10-18 | 真正的超级英雄 | 1712/34/62/66 |
| 09 | douyin-09 | 2024-11-21 | 朋友，「我们总是要再见 为了再见」 | 2073/25/153/185 |
| 10 | douyin-10 | 2024-10-07 | 所以是时势造英雄还是英雄造时势 | 2390/145/383/190 |
| 11 | douyin-11 | 2025-01-13 | 金珠玛米亚布都！ | 4343/184/412/117 |
| 12 | douyin-12 | 2024-08-14 | 3A「网红」——黑神话悟空 | 7033/1977/323/1159 |
| 13 | douyin-13 | 2024-08-12 | 你告诉我！谁才是真正的「网红」！ | 3067/133/141/280 |
| 14 | douyin-14 | 2024-09-13 | 近期最具影响力的虎扑男神评分 TOP10 | 3061/148/202/286 |
| 15 | douyin-15 | 2025-01-05 | 纵走疾风谁人拦，不破驿传终不还！ | 1557/31/155/63 |

### 三条判断，改的时候别推翻

- **`views` / `category` / `featured` 三个字段站内没有任何组件读取**（grep 全 `src/` 确认）。
  进 `WorkModal` 的只有 `title` / `image` / `caption` / `tags`。所以「数据」目前只活在源码注释里，
  页面上看不到；本轮把互动数写进 `caption` 文本，才真正对用户可见。
- **被「展开」截断的句子一律以 `……` 原样保留，不许补全。** 上一版的毛病就是把
  「因为等你看完穿上跑鞋的那一刻，第……」脑补成完整句。
- 老 title 里的「无论道路多么崎岖，坚持跑步的人总能找到前行的力量」**不是凭空编的** ——
  `douyin-05` 图像卡里确实有这句中英双语，它是照抄了画面文字而不是作品文案。
  本轮仍换成真文案「鲜衣怒马少年时，不负韶华行且知」，因为用户要的是抖音文案。

### 本轮新查出的问题（未动，等用户定）

1. **同一页面 270W+ 与 280W+ 打架**，标签都叫「单条最高播放」：
   `About.jsx:64` 和 `douyinWorks.js` 的 `accountIdentity` 写 270W+，`experiences.js:29` 写 280W+。
   两个数**都来自源文件**：简历 PDF 经历段是 280W+，简历/PPT 能力自述段是 270W（且限定「付航」「黑神话」系列）。
   截图实测最高只有 266.8万，说明还有更高的作品不在这 15 张里，无法判定该用哪个 —— 涉及对招聘方的事实陈述，不自选。
2. `src/data/mediaLinks.js` **全仓无人 import**（grep 确认），内容与 `accountIdentity` 重复，
   且 label 误写成「个播作品最高播放」。死文件，删前要用户点头。
3. `Footer.jsx:45` 把抖音链接硬编码在组件里，绕开了数据单源。
4. 视频轨道 **卡 05 / 卡 09 / 卡 10 共用 `…SLGnOIia8Qg?pwd=c8st`** —— 这次查清了**不是站内抄错**：
   PPT 原文（PAGE 3）就把同一条链接分别写在「视频剪辑加调色」「百度秒哒直播切片」「动漫混剪」三行下面。
   卡 04 的 `pwd=xxx4` 同样是 PPT 原文，不是占位符。要不要拆开得去网盘确认。
   （卡 03/卡 11 共用飞书那条是上一轮已知项，仍未定。）
5. `og:image` / `twitter:image` 仍是 Unsplash 外链电路板图、`canonical` 仍是 `lizongheng.example.com`
   —— 已知项，需要一张暗场 1200×630 新封面 + 正式域名。仓库里那张 `og-cover.jpg` 是亮调羊皮纸，不能直接换。

### 验证（本轮实测）

- 自查脚本：`src/` 里 **34 个 `/assets/文件` 引用，0 缺失**；douyin 目录 15 个文件、数据里 15 条引用，
  无孤儿无缺引；id 1..15 连续；15 组 title/caption/image/tags 齐全。
  （第一版自查脚本的正则写错把 `s` 和 `\` 排除掉了，报出 2 个假「缺失」，改对后为 0。）
- `npx eslint src/` exit 0；`vite build --outDir dist-verify` exit 0（162ms，CSS 52.99 kB / JS 249.78 kB，
  gzip 11.00 / 81.32 kB，JS 比上轮 +4.2 kB 就是 5 条新文案），产物目录已删。
- 视觉：browser-use 面板 `visibilityState=hidden` → `take_screenshot` 不可用，且**懒加载的图在隐藏页里
  永远 `naturalWidth=0`**，别把它当成图坏了。改用 headless Edge + CDP 实测：
  1440×900 下 15 张卡全部 `naturalWidth=800`，正前方卡 249×533，两侧阶梯对称（x 588→1159 / 588→244），
  滚轮 5 档能把 11–15 号新卡依次轮到正前方；点 `douyin-14` 弹窗正常（标题 16 字、正文 155 字、3 个 tag，
  图 295×630 落在 688×710 容器里 `object-fit:contain` 不裁切）；390×844 移动端正常。
  **CDP 坑**：`Page.captureScreenshot` 的 `clip` 是文档坐标不是视口坐标，拿 `getBoundingClientRect`
  的值直接填会拍到全黑（3 KB 的 PNG），改成整视口截图才对。
- dev server 按命令行含 `5199` 精确杀（不是按进程名），headless Edge 子进程按 `edge-profile` 命令行杀；
  9333/9334/9335 已无监听。

### 中间产物

`C:\Users\lzh\AppData\Local\Temp\audit-20261011\` 新增：`douyin_new_assets.py`（压缩）、
`verify_assets.py`（引用自查）、`cdp_spiral.js`/`2`/`3.js`（headless CDP 截图）、`cap1.py`（老截图分区裁图）、
`dynew/`（5 张新截图的文案带与统计列裁图）、`dyold/`（10 张老截图裁图）、
`shots/`（`v-front` / `v-r1..r3` / `v-mobile` / `modal-14.png` + `modal-14.json`）、
`out/`（`verify-assets.txt`、`rendered-titles.txt`、`cdp3.txt`、`modal-probe.json`）。

---

## 卡 01 封面改用项目封面图（2026-10-11 第六次，未提交）

用户指令：「作品里面的『虎扑视频』的封面换成『虎扑 CSGO 上海 Major』项目的封面图」。

改动只有一行：`videos.js` 卡 01 的 `cover` 从 `/assets/video-covers/hupu.jpg`
改成 `/assets/pptx-media/image21.jpeg`（即 `projects.js` 卡 01 用的那张）。
**直接引用原文件，没有复制**：`image21.jpeg` 本身就是 1280×720，和轨道槽位的
`aspect-ratio:16/9` + `object-fit:cover` 完全对齐，零裁切，也不在仓库里留第二份字节。
`hupu.jpg` 因此变成未被引用的孤儿文件（121 KB）。**用户 2026-10-11 回「删」，已删除**，
不留回退路径；要再拿这张帧得回 PPT 的 media8 用 `-i` 之后 `-ss 2` 重抽（注意别用 `-ss` 前置，会漂）。

### 换之前先量过：这两张其实是同一个画面

`hupu.jpg`（上一轮从 media8 t=2 抽的帧）与 `image21.jpeg` 都是
「虎扑 2024 年度评分 · 最受欢迎的虎扑男神 TOP10」的标题卡，只是横向取景和亮度不同。
灰度平均绝对差 56.23、57% 的像素差值 >20 —— 差值大主要来自黑边位置和明暗，不是内容不同。
所以**这次替换在页面上几乎看不出变化**，用户如果想要的是"换个不一样的画面"，这条指令没有达到他的意图。

### 顺带查出来的真问题：CSGO Major 项目根本没有 CSGO 素材

- 项目是真的：简历 PDF 有「虎扑CSGO上海Major赛后宣发」整段（`resume.txt:18-20,34`、`jili.txt:67-69`）。
- 但 **PPT 全文没有一处 CSGO / Major 字样**（grep 过），
  `pptx-media/` 16 个文件里也没有任何电竞画面：`image21.jpeg` 是男神 TOP10 标题卡，
  `image18.jpeg` 是「海辛&阿文AI工作流分享」，`image23.jpeg` 是「百度秒哒 × 通往AGI之路」。
- 结论：`projects.js` 卡 01「虎扑 CSGO 上海 Major」现在配的是一张**虎扑男神评分视频**的帧，
  和它下面视频轨道卡 01 用的是同一个镜头。要修得用户提供真正的 Major 素材，站内造不出来。

### 验证（本轮实测）

`npx eslint src/data/videos.js` exit 0；`curl` 该图 200。
headless Edge + CDP（9336）跑真实 DOM：轨道 22 个 `.video-rail-poster img` 全部加载（`notLoaded: []`），
第一个 `src=/assets/pptx-media/image21.jpeg`、`naturalWidth=1280`、`naturalHeight=720`，
渲染盒宽高比 `1.778` ×4 个采样点全等 → `object-fit:cover` 下**没有被裁切**。
（视觉截图没拍到：轨道是居中 coverflow，我的 `scrollBy` 三次分别落在项目区、媒体区标题、账号运营区，
没截到卡 01 本体；数值证据已足，画面由用户在已打开的 Chrome 里自行确认。）
CDP 坑复记：`proc.kill()` 只杀父进程，headless Edge 子进程会留着占调试端口，
必须按 `remote-debugging-port=9336` 的命令行精确补杀一次。

**删掉 `hupu.jpg` 之后复测**：grep 全仓只有本文件提到它，代码零引用；
引用自查脚本从 34 个 `/assets/文件` 引用降到 33 个，**仍然 0 缺失**；
`vite build --outDir dist-verify` exit 0（186ms，JS 249.79 kB），产物已删。
`public/assets/video-covers/` 现在 10 张、988 KB，全部被引用。


