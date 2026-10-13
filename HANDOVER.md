# self web · 项目交接说明（HANDOVER）

> 生成：2026-09-23 · 由 Codex 汇总本项目历史对话后生成
> 更新：2026-09-26 · Qoder 完成 git 治理（大文件排除 + 6 次分批提交），并修正本文档中过期的配色与站点结构描述
> 用途：本项目的历史对话已归档清理（详见 `D:\AI工作文件夹\全局工作台\Codex执行记录\工具维护-三项目对话归档清理-20260923.md`）。本文档保存关键结论，供后续接手的对话快速了解项目情况。

## 项目是什么

个人作品集网站（求职用），React 19 + Vite 8。当前视觉（2026-10-12）是**参考图「黑场 + 火光 + 白墨」海报排版**：整页铺在滚动影片上，无衬线实心大字、文字只用一种白墨、层级靠字号不靠灰度。面向内容 / 运营岗求职（详见 AI工作文件夹 HANDOVER 中的求职诊断结论）。**"羊皮纸亮调"（08-03）与"暗场发光 + 点阵数据感"（10-10）两版都已退役**，读到旧描述一律以 `global.css` 的 Design Token 与文件头注释为准。

- 项目路径：`D:\AI工作文件夹\self web`
- 站点结构（`src/App.jsx` 实际滚动顺序）：Hero（首屏）→ About（关于）→ Strengths（能力与优势）→ Experience（经历）→ Projects（精选项目）→ Media（作品 / 视频轨道）→ AccountOperations（账号运营，螺旋照片墙）→ Footer。首屏起各区块背景透明，共用 `FilmStage` 那一层影片：**首屏是「眼神跟随鼠标」（不滚动时画面钉住不动），滚过交接点后换成滚动驱动的主视频**（`HeroGlobe` / `HeroDigits` 已删除）。
- 版心约 1700px，PC 优先展示；移动端有抽屉导航与响应式降级。

## 技术栈与结构

| 项 | 内容 |
|---|---|
| 框架 | React 19 + Vite 8 |
| 规范 | ESLint 9 + Prettier（`npm run lint` / `npm run format`），当前 0 error |
| 组件 | `src/components/`：Nav、Hero、FilmStage（滚动驱动影片层）、About、Experience、Projects、Strengths、Media、VideoRail、AccountOperations、SpiralGallery、WorkModal、Footer、SectionHeading、SectionDots、CountUp、CursorGlow、Magnetic、Reveal、TiltCard、Arrow、ErrorBoundary（`HeroGlobe` / `HeroDigits` 已于 10-11 删除）|
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

`C:\Users\lzh\Documents\Qoder\2026-10-11\86bb0198\`，**第九轮收尾后 6.3 MB / 78 个文件 + 3 个目录**
（`frames/`、`gaze/`、`backup-20261011-film/`）：

- 探针 8 个：`contrast.js`（对比度，主力，已验证）、`lanes.js`（主体轮廓）、`check.js`（碰撞）、
  `shot.js`（分区截图）、`face.js`（`CursorGlow` 那个 0.66 常数的出处，**别删**）、
  `geom.js`（容器链 + 计算后的 `grid-template-columns`，`node geom.js W H .selector`，
  就是它量出 68px 正文列）、`paintcheck.js`（`elementFromPoint` 判画没画）、
  `functional.js`（滚动→seek／交递／视差，自带有效性闸门）。
  **第七轮（10-12）新增 3 个**：`shotpage.js`（`node shotpage.js <url> <W> <H> <frac> <out.jpg>`，
  顺带打印 `fonts` / 当前亮起的 caption id / `rain` 是否存在，用来证明独立页真的加载了）、
  `railprobe.js`（轨道 frame/poster/caption/scrim 几何 + 卡片 opacity + 计算后的 `p` 颜色）、
  `raillist.js`（把每张轨道卡的 `VIDEO / nn` 与标题按 DOM 打出来 —— 小字别从缩略截图里认）。
  **第八轮（10-12）新增 2 个**：`gaze.js`（`node gaze.js W H`，`SHOT=1` 顺带出图：九个指针位 → 落在哪个
  注视锚点、intro seek 延迟 p50/p90/max、交棒两态）、`gaze2.js`（`node gaze2.js idle|reduce|touch W H`：
  三条兜底支路 + 控制台 error/warning 计数）。`functional.js` 本轮改了口径：原来那行「跟鼠标」
  量的是 intro 的内联 transform，眼神版不再有 → 改成「首屏层无位移」（断言三个指针位内联值都是空串）。
  `contrast.js` 本轮第三处变更：**`GAZE_T=<秒>` 把 intro 钉到指定注视帧**，才能逐帧量首屏 AA。
  `contrast.js` 本轮两处变更：支持 `MODE=caption PAGE=… FRACS=…` 量多页，以及**沿祖先链求 `overflow` 裁切交集**
  （见下文 ⚠️ 假阳性），改完它 `paintcheck.js` 基本就是冗余件了。
  **第九轮（10-12）新增 2 个**：`settle.js`（`node settle.js W H`，`DBG=<用例序号>` 打事件流＋调用栈：
  页内劫持 intro 的 `currentTime` setter 与 `play/pause`，rAF 采样，量「单次转耗时／指针停→定住／每次过渡的 seek 数／
  静止期 0 seek」，它是本轮的判据来源）、`turn.js`（`node turn.js W H 90,180,270`：起播后 N ms 抢一帧截图，
  用来证明播进画的是素材自己的转头帧而不是跳切）。`contrast.js` 本轮再加 `ONLY=<选择器,…>`。
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

## 参考图海报排版语言全量还原（2026-10-12 第七次，已提交 `9936f44` + `cbbef9e`）

用户指令：「先做现有版本的存档，然后先分析图片的排版语言（字体衬线/无衬线、字重对比、是否全大写 / 字号层级 / 对齐方式 / 颜色体系 / 装饰元素 / 整体气质），然后把这套排版语言完整应用到每段文案上：字体/字号比例/颜色/布局全部还原参考图」，附一张 1920×1434 的黑底火光海报。
存档 = 上一轮的 `f321f9f`；本轮 19 个文件的改动全部叠在它上面，**未提交、未推送**。
各板块 CSS 文件头都写了本轮的落法与理由（搜「第四轮」），下面只记全局层与验收数字，别把这份文档当第二份注释抄。

### 参考图实测（决策依据，别再重测）

- **字体**：无衬线 neo-grotesque，实心不描边；同一行内 800 与 300 字重对撞；主标题全大写、微标签全大写 + 大字距。
- **字号层级**：主标题 cap 273px = **19.0% 视口高**，横跨 **94% 视口宽**（x 3.1%–97.1%）；正文 28px；微标签 26px。→ **主标题:正文 ≈ 13.5:1**，**微标签:正文 ≈ 0.93:1**（同字号，差别只在大写 + 字距）。标题带落在 y 15.0%–34.0%，正文与 CTA 沉到 84.7%–96.3%。
- **对齐**：左对齐为主，非对称多栏（左文右图 / 两角微标签）。
- **颜色**：全部文字实测为纯 `#FFFFFF`，白墨只占画面 **5.5%**；橙色占 **29.7%**，均值 `#A4430B`、最亮一颗 `#FFC489`，**100% 来自画面光，没有一处是 UI 印的色**。
- **装饰**：只有三样 —— 白药丸（CTA）、大写微标签、发丝分割线。没有 icon、没有点阵、没有发光描边。
- **气质**：极简 + 强对比 + 大字压画面，呼吸感来自留黑而不是留白。

### ⚠️ 中文做不到同一件事，本轮还原的是「满幅」这条轴

拉丁大写平均 advance ≈ 0.5em，所以参考图能"满幅 + 19vh 高"同时成立；全角汉字 advance = 1em，
一行 12 字要占满 94vw，字号上限就是 94vw/12 ≈ 7.8vw，此时字高只有约 9vh。
**两条轴必须选一条**，本轮选满幅（视觉结果就是"大字压画面"），不选绝对高度：
`--fs-display: clamp(30px, calc((100vw - 120px) / 14), 122px)`（首屏 14 个全角字铺满内容列）、
`--fs-h2: clamp(30px, calc((100vw - 120px) / 10), 168px)`（板块标题最长一行 10 字）。

### 全局层落了什么

- 字号阶六档：`--fs-display` / `--fs-h2` / `--fs-h3` 19–27px / `--fs-body` 15px / `--fs-label` 12px / `--fs-micro` 10px；
  `--lh-display` 0.92、`--lh-body` 1.6、`--track-display` −0.015em（全角负字距的可用下限）、`--track-label` 0.16em。
- 字体栈：`--font-display` = Archivo → Noto Sans SC（拉丁走 Archivo 的 300/900 两端，汉字自动落到 Noto Sans SC 同字重），
  `--font-sans` = Noto Sans SC，`--font-mono` = DM Mono（只剩 About / WorkModal 4 处引用）。
- **一条墨规则（D2'）**：正文与标题一律白墨（`--text-bright` 1 / `--text-base` 0.88 / `--text-dim` 0.66），
  火光色 `--accent` 只允许出现在 ≤`--fs-label` 的拉丁/数字微标签上，以及 hover/focus 这类瞬时状态。
  例外都写在 `global.css` 头注释里，加新色文字前先对这条。
- **分工**：只有 `h2` 出车道（`width:100%`，满幅压画面），`<p>` / 标签 / CTA 仍受 `--lane-w` 约束。
  可读性由各板块顶部的 `--title-band-h` 渐变压暗层负责，不靠给文字加底板。
- 本轮退役：`--font-pixel` / `--font-pixel-zh` / `--rim-rose(-a16/-a30)` / `--sky-*` / `.dot-matrix` 圆点遮罩 /
  About 数据栏刻度底纹 / Silkscreen 与 Fusion Pixel 两套像素字。火光阶整体从 hue 340–10 的玫瑰平移到 20–30 的琥珀。

### scrollytelling 独立页同步（`public/scrolly/`）

纯 HTML/CSS/JS 那页与主站同源，`scrolly.css` 整个重写：token 抄 `global.css` 的实测值（改色两边都要对）、
`.film` 加上与 `FilmStage.css:42` 同款的暖调 `sepia(.38) hue-rotate(-6deg) saturate(1.3) brightness(.74)`、
scrim 从玫瑰/天光径向改成纯黑线性、点阵遮罩与天光带上的数字雨（`<canvas class="rain">` + `drawRain()`）全部删除、
metrics 从 `<dl>`+字形 icon 改成 `<b class="m-val">`+`<span class="m-key">`、导航 active 从 LED 点改成 800 字重 + 1px 下划线、
`.pill--mark` 换成主站同款 LZH wordmark。
**这一页刻意没有还原对齐轴**：主站 h2 是满幅左对齐压画面，这一页的字浮在会动的短片上、主体在画面中央来回移，
居中才压得住 —— 文件头有 ⚠️ 注释，别看到"没还原居左"就当成漏做。

### 本轮踩到的两个坑（都是我自己先信了坏数据）

1. **`getBoundingClientRect()` / `Range.getClientRects()` 不遵守祖先 `overflow:hidden` 的裁切。**
   `contrast.js` 因此把 `.video-rail` 里一个**被裁掉、屏幕上根本不存在**的字幕行当成可见文字去采样，
   报出 1.84–3.87:1 的假 AA 失败，我基于它改了两处 CSS（字幕提到 `--text-base`、scrim 只压封面带）。
   `railprobe.js` 打出真实几何才发现：该元素盒 x 862..1129，而 `.video-rail-frame` 的右边界是 807。
   两处改动**已全部回退**，`VideoRail.css` 的注释也重写过，不留基于假测量的"实测"字样。
   修法：探针现在沿祖先链求 clip 交集，交集小于自身盒 60% 就跳过 —— 以后所有量屏的脚本都要这一层。
2. **scrim 缩短 = 视觉更差。** 试过让 `.video-rail-frame::before/::after` 只盖封面带（不整列到底），
   截图 `shotv14media.jpg` 里字幕行在 frame 边缘被拦腰硬切（「频」「AI 直播精彩片段」），
   比原来的淡出难看得多，已回退成 `top:0; bottom:0`，`shotv15media.jpg` 复确认。

### 验证（本轮实测）

- `npx eslint src/` exit 0；`npx vite build --outDir dist-verify` exit 0（65 modules / 205ms，
  CSS 51.96 kB → gzip 10.44，JS 249.68 kB → gzip 81.31），产物已删；`dist/scrolly/` 是本轮的最新文件。
- **AA 对比度（合成截图回灌取样，clip-aware）：主站 4 档视口 × 8 板块 = 0 失败**。
  全局最低：1440 → 5.17（`.account-ops`）、1280 → 5.49（`.hero`）、1024 → 5.31（`.account-ops`）、390 → 5.41（`.account-ops`）。
- **scrolly 页 0 失败**：1280 五档滚动位置最低 8.66、390 最低 6.22。
  ⚠️ 量这页必须用 `PAGE=http://localhost:5173/scrolly/index.html` —— dev server 的 SPA fallback 会把
  `/scrolly/` 直接吞掉返回 React 首页，用那个 URL 跑出来的数字全是主站的，看着也像通过（本轮就中招一次）。
  站内入口 `Media.jsx:51` 用的就是 `/scrolly/index.html`，是对的。
- 车道未破：`geom.js 1240 .experience` → lane 48%（h2 宽 1105 出车道 / `p` 宽 366 受车道 / 内容列 410 = calc(48%−120px)）；
  `geom.js 1150 .about` → lane 38%。
- 影片层功能：`functional.js 1440 900` → 首屏跟随鼠标 OK、下滚 seek 递增 OK、上滚倒放 OK，
  main 段最大 |want−got| = **0.02 s**（一帧 0.042 s）。
- 截图复核：`scrolly-real-{0,0.45,0.9}.jpg`（1280×800）三档，`shotpage.js` 报
  `fonts:"loaded"`、`missing:0`、`rain:false`，亮起的是 `cap-intro` / `cap-1` / `cap-3`。

### 仍未做 / 待决定

- `public/fonts/` 的 Fusion Pixel woff + woff2 共 **2.07 MB**（外加 19 KB OFL 许可）现在零引用，全仓无 `@font-face`。
  等一句话就删；本轮没动。
- `TiltCard.jsx` 已无引用（「保留待用」），同样等用户定。
- 参考图的对齐轴（满幅左对齐）在 scrolly 页刻意没还原，见上。
- 主站首屏是否再往"绝对字高 19vh"靠（代价是不满幅），本轮按满幅定了，要翻盘得重开这条轴。

## 首屏改成「眼神跟随鼠标」（2026-10-12 第八次，已提交 `0528416`）

> ⚠️ **本节里的「按 0.18 逐帧插值」已被下一轮（第九次，`c81703b`）整段替换成「锚点播进」**，
> 机制请看文末那一节。仍然有效的部分：锚点表的六个时刻、`FACE` 枢轴、GOP6 重编码要求、
> 兜底/交棒那张表、以及逐帧 AA 的结论。

用户原话：**「开头首屏视频里的人物眼神是跟随鼠标移动而移动(用户未滚动时保持画面不动），例如，鼠标放在人物左侧，则人物眼神跟随看向左侧」**。
"未滚动时保持画面不动"这一半否掉了原来的首屏行为（自动播放 + 整层鼠标视差），所以这一轮是**替换**，不是叠加。

### 机制：把首屏那条素材当"视线精灵图"用

`intro.mp4` 本来就是一条 10s 的表情＋视线镜头。逐张看过抽帧后定出 6 个注视锚点，
`FilmStage` 的首屏层改成**暂停 + 按指针方向 seek 到锚点帧**：

- 指针相对**眼睛枢轴**求单位向量 → 取与锚点单位向量点积最大的那个 → 把 `currentTime` 以 0.18 的系数逐帧推过去。
  中间经过的是素材自己的帧，所以看起来是"眼睛转过去"，不是跳切。
- 锚点表（`FilmStage.jsx` 的 `GAZE`）：`0.15` 正面平视（默认，直视镜头）/ `1.30` 画面右 / `2.85` 右上 /
  `5.40` 画面左 / `5.75` 左下 / `6.80` 正下。
- ⚠️ **锚点时刻不能按方向加权平均**：这条视线轨迹在时间轴上不单调（2.85s 的右上和 5.40s 的左之间隔着整段朝右的大笑），
  平均出来的时刻对应的还是朝右。只能选一个锚点再平滑。
- **素材缺三个方向**：纯上、左上、右下没有对应镜头，这三个象限由角距最近的锚点代打。
  最弱的是右下（1440 上角距 45.3°，指针在那附近时"右"和"下"会随动）；要补只能换素材，别指望代码。
- 死区 `GAZE_DEAD=0.1`（短边一半的 10%）：指针贴脸时回正面，别在鼻尖附近抖出大跳。
- `moved` 标志必须有：页面刚加载时指针逻辑上在 (0,0)，不判一下就会把"左上角"当成用户意图。

### 眼睛枢轴点 `FACE = (0.498, 0.41)`

实测自 t=0.15 那帧叠的 128×90 网格（左眼 (575,295) / 右眼 (700,295) → 中点 (638,295) ÷ 1280×720）。
`measure()` 里按 `object-fit:cover` 的真实缩放换算成屏幕坐标，所以换视口不用重标。

### 素材必须重编码：单关键帧的 mp4 逐帧 seek 不了

- 原 `intro.mp4`：1.52 MB / 241 帧 / **1 个关键帧** → 浏览器 seek 只能回到那唯一的 IDR，逐帧定位无从谈起。
  （量关键帧数只能走解码路径 `-an -f null -`；用 `-c:v copy` 会把过滤绕过，数出来等于总帧数。）
- 重编码配方沿用 `main.mp4` 那条，只把 crf 降到 23 控体积：
  `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 23 -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -profile:v high -level 4.1 -movflags +faststart out.mp4`
- 结果：3.37 MB / 242 帧 / **41 个关键帧**，时长 10.08s、1280×720、24fps 不变，音轨丢掉（页面永远 muted）。
- **代价：首屏字节 1.52 → 3.37 MB。** 原文件在 `f321f9f` 里且当时工作区干净，随时可取回。
- 实测 seek 延迟（三档视口 ×24 次）：p50 5.8–12.3 ms、p90 11.1–21.4 ms、max 35.8 ms，都在一帧（41.7 ms）以内。

### 兜底与交棒（都实测过）

| 情况 | 行为 |
|---|---|
| 触屏（`pointer:coarse`） | 没有指针可跟 → 退回原来的循环自动播（2.4s 内净前进 2.42s） |
| `prefers-reduced-motion: reduce` | 不播、不 seek，钉在正面帧；移动鼠标也不动（实测 t 不变） |
| 鼠标从没动过 | 停在 0.15 正面帧 |
| 滚过 `HANDOFF=0.35×hero高` | 交棒主视频，intro 暂停；滚回顶部又回到 `is-intro` |

`autoPlay` 属性已从 `<video>` 上摘掉，`play` 事件里再钉一道 `holdIntro()`（autoplay 的启动是排队任务，会跑在脚本 `pause()` 之后）。

### 顺带查出来的真问题：换注视帧会把首屏文字挤出 AA

眼神一改，首屏就有 6 个确定帧可停，"字压在头发上"这种帧相关问题第一次变成可复现的。
给 `contrast.js` 加了 `GAZE_T=<秒>` 钉帧后逐帧量：**390 上 t=2.85 / 5.4 两帧，右侧微标签 4.31 / 4.25:1，不过 AA**（bg 0.075–0.078，正压在头发上）。

- 这不是本轮引入的：触屏分支本来就在循环播同一批帧，以前只量了随机一帧所以没暴露。
- 试过 `text-shadow: 0 0 10px`：只抬 0.1 就停了 —— 探针的背景取样在墨迹右侧 6px，阴影到那儿已经淡了。**放弃这条路。**
- 最终把 `.spec` 的颜色从 `--text-dim`（0.66 白）改回纯白 `--text-bright`：
  参考图本来就是**所有字纯白 #FFFFFF，层级只靠字号与字距**（第七轮实测过），所以这是回归参考图，不是妥协。
- 复测：390 六帧 min 5.02–6.34；1280/1440 六帧 min 10.3–11.17（原来 5.5–5.85 的最弱项不再是标签）。
- ⚠️ 顺手修掉一条过期注释：`FilmStage.css` 里 `scale(1.08)` 的理由写的是"鼠标视差预算"，现在这一层 JS 不写 transform 了，
  注释改成"纯取景裁切"。

### 探针自己错的两处（别又信一次坏数据）

1. `gaze.js` 第一版把「右下」的期望手写成了 6.80，实测拿到 1.29 → 我判成 bug，其实是我的期望不成立
   （素材没有朝右下的镜头）。改成：**死区与四个正向写死我从片子里读出的那一帧，三个缺素材的方向改判"是否落在角距最近的锚点"**，
   并且用**夹取到窗口内之后**的坐标算方向（窄屏 ±520px 会被夹到边缘，用未夹取的偏移会得到页面根本没收到的方向）。
2. `gaze2.js` 第一版用 `getComputedStyle(v).transform === 'none'` 判"没有视差位移" → CSS 上有静态 `scale(1.08)`，假失败。
   改成「无内联 style 且两次采样计算值相同」。触屏那条也一样：直接比首末 `currentTime` 会看到 7.27→0.19 误判成没播，
   改成按绕回 loop 起点累加净前进量。**`functional.js` 那行「跟鼠标」同理已改口径**（见复测脚本清单）。

### 验证（本轮实测）

- `gaze.js`：1440×900 / 1024×768 / 390×844 三档，九个指针位**各 9/9 命中**（±0.12s 内）。
- `gaze2.js idle|reduce|touch`（touch 另测 390×844）：全 OK，控制台 **0 error / 0 warning**。
  idle 实测 3s 内 `currentTime` 一点没变、`paused=true`、JS 未写首屏层 transform。
- 首屏 AA：6 个锚点帧 × 390/1280/1440 = **18 组 0 失败**。
- 全站 AA 复测：1440 / 1280 / 1024 / 390 × 8 板块 = **0 失败**（最低仍是 `.account-ops` 5.17@1440、5.41@390）。
- `functional.js 1440 900`：首屏层无位移 OK、下滚递增 OK、上滚倒放 OK、main 段 max |want−got| 0.02s。
- `npx eslint src/` exit 0；`npx vite build --outDir dist-verify` exit 0（65 modules / 217ms，
  CSS 51.96 kB → gzip 10.44，JS 250.44 kB → gzip 81.63），产物已删。
- 观感复核：`gaze-left.jpg` / `gaze-right.jpg`（1440 与 390 各一轮）确认人物真的看向指针那一侧；
  `hero-idle.jpg` 确认静止态是"咧嘴直视镜头"，作为跟随的起点正合适。

### 中间产物（scratch）

`gaze/` 抽帧证据（`seq/` 25 帧＝锚点判定的原始依据、`faces12.jpg` 0.25–5.75s、`faces8.jpg` 6.25–9.75s、
`left9.jpg` / `right9.jpg` 0.25s 步进、`grid0.jpg` / `grid54.jpg` 128×90 网格叠图＝`FACE` 那两个小数的出处、
`sheet20.jpg` 总览）；`gaze-left.jpg` / `gaze-right.jpg`（1440 与 390 各一轮）、`hero-idle.jpg`（静止态）。
三个候选编码（c20g6 / c22g12 / c23g6）与一批早期拼接图**已删** —— 采用的那一份与
`public/assets/scrolly/intro.mp4` md5 相同（`0466a75a…`）且已入库，留着只是 11 MB 重复字节。

### 仍未做 / 待决定（本轮新增）

- 首屏 3.37 MB 是 GOP6 换来的。若以后要再压体积，可另编一版 crf22 / GOP12（当时量到 3.14 MB，产物已删，重编即可）
  —— 代价是 seek 颗粒变粗，得重测延迟。
- 右下象限角距 45°，是眼神跟随在这一点上"看着不像"。要真做全，需要一条带右下视线的素材镜头，不是代码问题。
- 眼神锚点目前只在 intro 层用；主视频（滚动驱动）不看指针，这是刻意的：滚动已经是意图表达，再叠一层视线跟随会打架。


## 首屏眼神跟随去卡顿：改成「锚点播进」（2026-10-12 第九次，已提交 `c81703b`）

用户原话：**「在转动鼠标时，人物眼神确实跟随鼠标了，但有滞后性，有明显卡顿。是否可以优化呢？你打算怎么做」**，
对方案的确认是**「你先试一下」**。上一轮的插值法被整段替换，锚点表、`FACE`、GOP6 素材、兜底/交棒表都沿用。

### 病根（算式，不是量出来的）

0.18 的逐帧插值，从左(5.40)换到右(1.30) 要跨 4.1s 素材 = 98 帧：收敛到一帧以内要
`ln(0.0417/4.1)/ln(0.82) ≈ 23` 个 rAF 拍 ≈ 0.4s，而每拍跳的是**剩余距离**的 18%，
头三拍就是 17/14/12 帧（一跳跨过 0.5–0.7s 素材，把朝右大笑那一整段扫过去）。
单次 seek 实测 p50 5.4–12.3ms 且一次只允许一个在飞 → 追不上。
**"滞后""卡顿""倒着扫不相干表情"是同一个算法的三条后果，不是三个 bug。**

### 机制：起播点 + 素材自己的 24fps

`GAZE` 每个锚点多一个 `from`（起播点，一律只往回 0.30–0.35s，逐张看过 `gaze/strip-A…D.jpg`
那几条 10fps 脸部裁切才定的）。指针换向 → seek 到 `from` → `play()` → 播到 `t` 附近 `pause()` →
再 seek 一次把画面钉死在锚点那一帧。状态机四态 `hold / arming / playing / settle`，
推进只认 `seeked` 事件（读 `currentTime` 判"seek 到位"不可信，它在飞的时候就返回目标值）。
一次过渡**最多 2 次 seek**。`0.15` 那一档 `from===t`：它离片头只有 3 帧，往回没有进入动作可播，
所以只发 1 次 seek、不播。
播进过程**不打断**：中途指针又换了方向也先转完这一次，落位后再看新方向 —— 这是"一次过渡"的定义，
也是它不会变成 seek 风暴的原因。

### 三个坑（都会复发，记全）

1. **StrictMode 双挂载下漏摘监听器**：`play` 与 `main` 的 `loadedmetadata` 用的是匿名函数、
   cleanup 里没有对应的 `removeEventListener`。第一份（死闭包）监听器永远挂在元素上，
   它看到的 `phase` 停在初值 → 每次我们 `play()` 它立刻 `holdIntro()` → `pause()` + seek 回正面帧。
   **播进被静默降级成硬切**，症状是探针里「播放段 0ms」＋紧跟起播 seek 之后一次 `to=0.1667` 的野 seek。
   定位靠给插桩的 setter 加 `new Error().stack`（`settle.js` 的 `DBG=<序号>` 会打调用栈）。
   这条在第八轮就存在，只是那版不播所以看不出来 —— 按 React 的口径 StrictMode 只在 dev 下双跑 effect，
   **这一条我没在 `dist` 产物上复测**，所以"线上本来就没这个问题"是推断，不是实测。
2. **横扫必然经过脸上死区**：左→右的路径从鼻尖上掠过，死区是它中途的一站，会把一次转向拆成
   "回正→再转向"两段（多一对 seek，看着就是两次抖）。给「切回正面」加了 `GAZE_DWELL=120ms` 停留门槛，
   别的方向变化照常立即响应。
3. **量化值要和量化值比**：到达判定原来拿原始秒数 `aim.from`（5.05）比 `currentTime`，
   而 `from` 量化后是 5.0417（`Math.round(5.05*24)/24` 往下舍）→ 一开播就满足"绕回 loop 起点"，
   直接跳过播进。加了 `q()`，两边都过它。

交棒行为也改了一处：滚回首屏时不再只把 `phase` 复位，而是**重新钉一次锚点帧**（`aim` 在滚走期间可能已经落伍）。

### 实测（`settle.js`，1440×900 与 1024×768 两档，9 条用例 + 快扫 + 静止共 11 项全过）

- **单次转耗时**（最后一次真正起播 → 画面定住）＝ **339–375 ms**。339–341 是"发了一次落点校准 seek"的那种，
  375 是播进去刚好落在整帧上、省掉那次 seek 但多等一个 rAF 拍。六个锚点都在这个带里，与方向无关。
- **指针停 → 定住**：正常拖动 **78–232 ms**（转向在拖拽途中就已经起播，所以指针停下时只剩尾巴）；
  一次性横跨 1040px 甩动 **348 ms**；切回正面那一档 **2–93 ms**（纯切，本来就没有播）。
- **seek 次数**：每次过渡 ≤2；连续 12 次快甩（每 420ms 换向）1.3–1.6 个/过渡，无风暴；
  **指针停住后 3s 内 0 次 seek** —— 「未滚动时画面不动」这条硬保证没被播进破坏。
- 对角扫（左上→右下）4 次 seek：路径确实跨过 3 个方向区，按过渡算仍是 2/过渡，不是缺陷。
- **视觉确认**：`turn.js` 在起播后 90/180/270ms 各抢一帧（截图前后都读了 `currentTime` 证明拍在中途，
  1.0423→1.0934 / 1.1388→1.1907 / 1.2243→1.2759，一帧一帧在走），
  `gaze/turn-montage.jpg` 从上到下＝左锚点→三段中途→右锚点，视线是连续扫过去的。
- **交棒后回滚重新钉锚点**：`gaze.js` 的 seek 延迟探针会把 intro 手动拖到 8.51s 这种脏位置，
  滚回顶部后实测回到 `t=1.29 paused`（＝最后一个指针位的锚点帧），新加的这条生效。
- 回归全绿：`gaze.js` 1440/1024/390 三档各 **9/9** 命中、intro seek p50 **5.0–5.4ms**（max 9.8）；
  `gaze2.js idle|reduce|touch` 全 OK、控制台 0 error/warning；
  `functional.js` 首屏层无位移／下滚递增／上滚倒放 OK，main 段 max |want−got| 0.02s；
  **首屏 AA 11 帧（6 锚点 + 5 起播点）@1440 = 每帧 7 组、0 失败，min 10.86–11.19:1**
  （起播帧也量是因为 seek 卡死的兜底路径可能把画面留在中途那一帧）；`eslint` 0、`vite build` 0。

  > ⚠️ **2026-10-12 第十一次更正：上面这组 AA 数字作废。** 当时 `contrast.js` 的 `GAZE_T` 是靠直写
  > `currentTime` 选帧，而 `pin.js` 实测：眼神状态机的 tick 会在 700ms 内把直写值打回正面帧
  > （写 3.5 → 回读 8.5417）。也就是说"11 帧"量的其实是**同一帧**，min 10.86–11.19 那条不是逐姿势的结论。
  > 第十一次换成"指针驱动稳态帧 + reduced-motion 冻结态直写"两条路重测了 16 帧，数字见第十一次那节。
  > 同一处坑的根因是探针误以为「写进去就归我」，组件随时可以收回 —— 别在别的地方再犯一次。

### 没达到的那一条（说清楚，别让下一个人以为全绿）

承诺的口径是「指针停稳→定住 ≤0.3s」。**拖动场景 78–232ms 达标；一次性横甩 348ms 不达标**，
而且按现在的素材不可能达标 —— 那 0.35s 是素材里真实发生的 8 帧转头，播它就得花 8 帧的时间。
唯一的旋钮是把起播点从 0.30–0.35s 缩到 0.24s（省 2 帧 → 约 270ms），
代价是转头动作被吃掉开头两帧、更像"弹过去"而不是"转过去"。**没做，等用户先看观感再定。**

### 探针自己错的两处

1. `settle.js` 第一版判「定住」用「paused ＋ 连续 12 个采样 `currentTime` 不变 ＋ 前 200ms 无 seek」，
   这套检测本身要 ~390ms，于是量出"尾延迟 376–394ms"—— **量到的是探针的迟钝，不是页面的**。
   改成取「最后一个 seek 的 `seeked` 落回时刻」。
2. 但那条又漏了一种：**播进去正好落在整帧上时不会发校准 seek**，于是"最后一个 done"是**起播**那次的，
   拿它当定住时刻就得到 `单次转耗时 0ms`、`尾延迟 −147ms` 这种不可能的数。
   现在加了两级：`done` 的时刻值必须等于终态 `currentTime` 才认，否则退回「最后一个"在播"采样之后的第一个 paused 采样」。
   另外打分口径从「每次拖拽 ≤2 seek」改成「每次过渡 ≤2 seek」—— Node 侧照 `gazeAnchor` 同一条点积规则
   沿路径重算一遍得出过渡次数与期望落点帧，顺带成了对锚点映射的第二路交叉验证。

### 中间产物（scratch 新增）

`settle.js`（播进复测；`DBG=<用例序号> node settle.js` 打事件流＋调用栈）、
`turn.js`（`node turn.js W H 90,180,270` 抢中途帧截图）、`gaze/turn-090/180/270.jpg`、
`gaze/turn-montage.jpg`（拼图的半截件已删）。
`contrast.js` 新增 `ONLY=<选择器,…>`（只量指定板块，配合 `GAZE_T` 逐帧量 AA 时才不用每次跑完 8 个板块）。

探针环境已收尾：无头 Edge 那棵进程树（`Get-CimInstance Win32_Process -Filter "Name='msedge.exe'"` 里
CommandLine 带 `remote-debugging-port=9333` 的 5 个 PID，启动时间全是本轮 03:17/03:19，用户自己的 Edge 不带这个参数）
先列清单核对身份 → 杀 → 复查 `after=0` 且 9333 无监听 → 才 `rm -rf edge-profile`（480 MB）＋`edge.log`＋`vite.log`，
按上一轮定的顺序走，没有撞锁。**dev server（5173）留着没杀**，因为「起播点要不要缩到 0.24s」这一条等用户亲眼看观感。



## 抖音截图墙换成 InfiniteSpiral 无限螺旋（2026-10-12 第十次，未提交）

用户指令：把「账号运营」板块里那张抖音截图墙的效果，换成 React Bits `<InfiniteSpiral/>`
（贴了完整源码 + props 表 + 用法示例）。**边界就是这张墙**：板块标题、账号身份卡、
`WorkModal` 一律不动。改动只落在 `SpiralGallery.jsx` / `SpiralGallery.css` 两个文件，
`AccountOperations.jsx` 零改动（props 签名 `{works, onSelect}` 保持不变，所以没有第二处要改）。

### 几何换了范式，这才是真正的收益点

旧版 v7 是**单圈圆柱**：`theta = 2π/N`，张数直接决定环的疏密。补进 5 张新截图后 N=15，
相邻只剩 24°、间隙约 13px，卡片开始互相挤压。新版是**无限螺旋**：offset 用 modulo 折回
`(-N/2, N/2]` 连续行进，每 `cardsPerTurn` 张才绕一圈 —— 张数不再决定疏密，多出来的张数
沿纵向堆叠。这就是"15 张放不下了"这个既有问题的正解，不是靠缩小卡片硬塞。

### 照抄示例会出错的四处（都是接入必需，不是风格偏好）

1. **卡片尺寸必须给 178×380**。示例是 92×200，组件默认 100×100 正方，而 `imageFit` 默认 `cover`：
   素材是 800×1709 的手机截图，正方卡会上下各切掉 26%，正好切掉抖音那行文案和点赞/收藏读数。
   178/380 = 0.46842 vs 素材 0.46811 → 裁切量 0.25px，等于不裁。窄屏降档 132×282（同比）。
2. **卡片渲染成原生 `<button>` 并接 `onSelect`**。上游只支持 `href` 跳转，没有回调口子。
   顺带把键盘可达从手搓 `role=button + tabIndex + onKeyDown` 换成原生 button（Space 免费拿到）。
   上游那句 `role="listitem"` 挂在可点元素上会吃掉 button 语义，没抄。
3. **`touch-action` 用 `pan-y`，不用上游的 `pan-x`**。`pan-x` 等于禁掉从照片墙上起手的竖向翻页滚动，
   触屏笔记本（`pointer:fine` 但有触摸屏）拿到 `animationMode='all'` 就会把整页困死在这个板块 ——
   旧版专门做过「端点释放」就是为了它。另外 `animationMode` 在触屏退成 `auto`。
   ⚠️ 无头 Edge 的 `mobile:true` 仿真下 `matchMedia('(hover:hover) and (pointer:fine)')` 仍报 `true`，
   所以这条分支**在本机没法实测，是按规范推的**；`pan-y` 那一处是无论分支对错都不会锁死页面的兜底。
4. **卡片外观走站内缘光族**。上游 CSS 给卡加 1px 白边 + 白底 + 浅投影，压在 `--void-7` 上会读成亮边毛刺。
   描边/阴影/圆角沿用旧版那三层深投影，只换几何。

### 数据微调（相对示例值）与反推依据

| 参数 | 示例 | 采用 | 依据 |
|---|---|---|---|
| `cardsPerTurn` | 8 | 8 / 窄屏 5 | 见上，疏密与张数解耦 |
| `radius` | 420 | 420 / 210 | 组件内部还会按 `min(radius, 容器宽×0.36)×fit` 再收 |
| `verticalSpacing` | 58 | **58** / 50 | 58 是"200 高卡的 0.29 倍"，但真正的约束是纵向铺开量，见下 |
| `perspective` | 725 | 1600 / 1200 | 725 时 `depthScale` 顶到 1.45 上限，叠 `centerScale 1.2` 会把正面卡放大到 310×660，吃掉 880 高容器的大半；1600 下实测正面 284×606 |
| `speed` | 0.6 | 0.55 | 15 张一圈约 27s，截图上全是中文文案 |
| `edgeFade` | 0.3 | **0.62** | 见下，为了把越界卡压到不可见 |
| `cardRadius` | 10 | 14 | 对齐旧版卡圆角 |

`verticalSpacing` 和 `edgeFade` 是**量出来反推的，不是试出来的**。判据定成
「卡片被容器硬切时，不透明度必须已经 ≤0.3」。第一版按示例比例给 110，CDP 实测
`prefers-reduced-motion` 下最外一张**带着 0.65 不透明度被切掉 84px**；改 72 还剩 84px@0.65；
58 才做到四档全部越界 ≤8px 或已淡到 0.25。中间这个判据之所以必须存在，见下面那条死代码。

### ⚠️ 查出来一条既有死代码：`.spiral-edge-mask` 从来没画过东西

它写着 `mask-composite: intersect`，两层渐变各自"两端实色、中间 transparent"，取交集后
只有 4 个小角保留 —— 而且这个 div **根本没有 `background`**，遮没遮住都不产生像素。
2026-10-12 用等尺寸纯红探针 + 同一套 mask 实测：正中、四边带、角上采样点全部读到底色，
证实它一直是死的（旧版也一样，不是本轮改坏的）。**所以照片墙的边缘一直是
`overflow:hidden` 硬切，没有任何羽化可依赖。** 规则原样留着没删也没修（改法是
加 `background: var(--void-7)` + `mask-composite: add`），因为那等于顺手改视觉语言，等用户点头。

### 两个上游 bug，是实测交互才暴露的

1. **`onPointerDown` 一按下就 `setPointerCapture` 到根节点 → 真鼠标点不开弹窗。**
   捕获会把 `pointerup` 改派到根节点，`click` 的目标于是变成「mousedown 与 mouseup 目标的
   最近共同祖先」= 根节点，卡片的 `onClick` 永远轮不到。实测：真鼠标点击 CLOSED、
   `.click()` 合成事件 OPEN —— 后者绕过派发所以一直"看起来是好的"。
   改成越过 4px 阈值才接管指针。复测记账：拖拽收尾的 click 落在 `DIV.spiral-field`（`detail:1`）→ 不误开；
   拖完再干净单击落在 `IMG`（`detail:1`）→ 正常开。
2. **拖拽守卫 `dragMovedRef` 会吃掉下一次键盘激活。** 键盘激活的 click 是 `detail:0` 的合成事件，
   跟拖拽无关，一律放行：`if (!dragMovedRef.current || event.detail === 0) return`。
   不修的话"拖一下再按回车"会静默失灵一次。

顺手补回一条旧版有、上游没有的行为：**滚出视口就停写 DOM**（旧版注释里叫"静止自动停"）。
上游 rAF 常驻，这张墙在整页里只占一屏，全站 60fps 空转不划算。保留速度衰减，滚回来平滑续上。

### 本轮唯一一处动到板块布局的决定

窄屏 `.spiral-gallery` 高度 `70vh/min 440` → **`92vh/min 560`**（与桌面同档）。
原因：591px 高的容器里正面卡已占 371px，螺旋第 5 张必然越界，而那时不透明度还有 0.56 ——
`verticalSpacing` 再怎么压都会同时造成"同角度上下两张叠死"，只能给高度。
复测手机 362×776：最大越界 17px 且发生在 `op≈0.5` 的边侧卡上，正面卡完整居中无切。
**如果用户觉得手机上门照片墙太高挡了翻页，这一条是唯一要回退的地方**（CSS 里注释已标出）。

### 验证（全部实测，无推断）

`npx eslint` exit 0；`vite build` exit 0，65 modules，JS 253.21 kB（旧 249.79，+3.4 kB）。
headless Edge + CDP，`#account` 锚点，5 档视口 1920×1080 / 1440×900 / 1024×768 / 780×900 / 390×844：

- 15 张卡 `naturalWidth=800` 全部加载，`cardTag=BUTTON`，7 个 `section[id]` 齐全（其余板块未波及）。
- 硬切指标 `worstClip`（不透明度 >0.5 的卡越出容器的最大像素，负数=还有余量）：
  1920 档 +8、1440 档 −10、1024 档 −5、780 档 +18、390 档 +17。
- 位移探针（`translate3d` 数值差，3.5s 窗口）：正常 `median≈393px` 在走；
  **reduce-motion `maxDrift=0.00px`**；**滚出视口 `maxDrift=0.00px`**；滚回来 `median≈216px` 恢复。
  （⚠️ 探针口径：一开始用 `style.transform` 字符串相等判"动没动"，得到过 `static:false` 的假阳性 ——
  指数衰减残留的亚像素漂移会改到第 3 位小数。数值化以后才是 0。）
- 交互矩阵：真鼠标单击 → OPEN `douyin-09.jpg`；拖拽 84px → CLOSED 且位移 971px、cursor 回 `grab`；
  Enter（`keyDown` 带 `text:'\r'`）→ OPEN `douyin-02.jpg`；Space → OPEN `douyin-03.jpg`；Esc → 关闭。
  ⚠️ `Input.dispatchKeyEvent` 的 `rawKeyDown`/不带 `text` 的 `keyDown` **不触发 button 默认激活行为**，
  量出来是"Enter 失灵"的假故障，必须带 `text`。
- `:focus-visible` 真键盘命中：`fv:true`，outline `2px solid rgb(255,196,137)`。
- 控制台 error/warning **0 条**（`Log.enable` + `Runtime.consoleAPICalled` + `exceptionThrown` 三路记账）。

### 没做的事

- 没补旧版那套按远近写的 `saturate(60%~100%)`（远景降饱和）。上游只有常数 `grayscale`，
  远景改由 `edgeBlur` + opacity 承担；要加回去是在逐帧 filter 里并一项，属于自造改动。
- 没有保留滚轮 step-snap 吸附。换成连续行进后每张仍会依次经过正前方完整露出，可达性不亏。
- `FilmStage.jsx` 那条未提交改动不是我的，全程没碰。

### 回退路径

两个文件在 `.githome` 里都是 tracked 且本轮之前是 clean 的，整条回退：
`git --git-dir=".githome" --work-tree="." checkout -- src/components/SpiralGallery.jsx src/components/SpiralGallery.css`

### 中间产物

`%TEMP%\audit-20261011\`：`cdp_spiral4.js`（四档几何 + 硬切/间隙探针 + mask 探针）、
`cdp_spiral5.js`（1920 档 + reduce-motion + 键盘 + 控制台）、`cdp_spiral6.js`（位移量化回归套件）、
`cdp_kb.js`/`cdp_kb2.js`/`cdp_kb3.js`（点击与键盘激活取证，`kb3` 用 document 捕获阶段记账）、
`shots/sp-*.png`（各档实拍 + `sp-maskprobe.png`）。
CDP 坑复记：`proc.kill()` 只杀父进程，headless Edge 子进程留着占调试端口，
每轮跑完要按 `remote-debugging-port=93` 的命令行精确补杀一次再复查 `after=0`。

---

## 螺旋墙放大 + 四边暗角做实 + 全站死代码审计（2026-10-12 第十一次，未提交）

### 用户这一轮要什么

1. 「螺旋半径太小，电脑端左右两侧留白过多，放大到最佳效果」；
2. 「就比如你刚刚说的没有背景色这个问题」—— 上一轮记录的 `.spiral-edge-mask` 死规则，要它真的生效；
3. 「再次检查整个项目里是否还存在用不到的代码或错误，并检查是真的用不到、还是问题没解决；能优化效果的就解决掉」。

### 一、半径为什么小，以及放大它的约束链

组件里环半径是 `responsiveRadius = min(radius, max(72, width × 0.36)) × fit`，
而 `fit = min(1, width/(卡宽×2.8), height/(卡高×2.35))`。上一版桌面 `radius=420`，
1700 容器下 `0.36×1700=612` 根本不 binding，是 420 自己把环夹死的 —— 所以留白不是响应式造成的，是参数造成的。

横向最宽的一张恒在 90° 侧位（那里 z=0 → `depthScale=1`，x=半径），外沿 =
`fit × (半径 + 卡宽 × (1+0.2×focus)/2)`，`focus = 1 − 1/(4×0.65) = 0.615`。

- 旧值：`0.985 × (420 + 99.9) = 511`，容器半宽 850 → **填充率 60%，左右各空 339px**。
- 新值：`radiusWidthRatio` 提成显式 prop（默认仍 0.36，不绑死上游语义），桌面给 **0.41** →
  半径 697，外沿 782 = **92%**，左右各剩 66px 气口。`radius` 700 只在 >1707 容器上兜底。
- `perspective` 必须跟着半径同比放大：`depthScale` 有 1.45 上限，1600 配 697 会得到 1.77 被夹平，
  中心一排卡全成同一尺寸、纵深观感消失。按旧版 p/R=3.81 的比例给到 **2600** → 正面 1.36、背面 0.79，与旧版一致。
- **窄屏反向**：0.41×362=148 会把卡推到外沿 197 > 半宽 181，所以窄屏改由 `radius=124` 抢先夹住
  （旧值 210 在这个式子里同样不 binding，实际一直是 130 在夹），越界只剩 11px，交给暗角羽化。
  窄屏 perspective 保持 1200（p/R≈9.7，纵深刻意压平）：小屏上 1.36 倍的大小跳变会读作闪烁。

实测填充率 / 左右余量（`fillPct` = 不透明度>0.5 的卡的最大外沿 ÷ 容器半宽）：

| 视口 | 容器 | 填充率 | 每侧余量 | 横向越界 | 纵向越界 |
|---|---|---|---|---|---|
| 1920×1080 | 1700×880 | 92.2% | 66px | −66（未越界） | +16 |
| 2560×1440 | 1700×880 | 91.3% | 74px | −74 | −14 |
| 1440×900 | 1305×828 | 90.3% | 63px | −63 | +16 |
| 1024×768 | 809×614 | 73.4% | 108px | −108 | +21 |
| 780×900 | 725×720 | 86.0% | 51px | −51 | 0 |
| 390×844 | 362×776 | 105.8% | −11px | **+11** | +10 |

1024 档只有 73% 是 `fit` 被容器高度（614）压到 0.687 的结果，不是参数没给够 —— 那一档要更宽就得先更高。
390 档 +11px 与纵向 +16~21px 现在都落在暗角带内（横向带 8%=29px、纵向带 10%=78px），不再是硬切线。

### 二、四边暗角：从死规则改成真的画得出来

上一版是 `mask-image` 两层渐变 + `mask-composite: intersect`，且 div 自身没有 background。
intersect 取两层遮罩的**重叠**部分，而这两层各自的不透明区一个在左右边、一个在上下边，互不重叠 → 交集为空 → 整个元素一个像素都不产生。

改成两层 `background: linear-gradient()`（并集，正是"四周压成底色、中间透明"），删掉全部 mask 属性。
端点用 `transparent`：`--void-7` 本身就是 #020202，且 CSS 渐变按预乘 alpha 插值，不会掺出灰边 —— 这一点是量出来的，不是推断（见下）。

**A/B 像素取证**：把 `.spiral-edge-mask` 的计算值 `background-image` 原样克隆到一个 800×400 纯红底之上，
同一位置去掉遮罩作对照，两张截图逐点比对（读的是真实合成像素）：

| 取样点（相对 800×400） | 有遮罩 | 无遮罩 |
|---|---|---|
| 正中 400,200 | 255,0,0 | 255,0,0 |
| 左 1px | 8,2,2 | 255,0,0 |
| 左 4%（32px） | 130,0,0 | 255,0,0 |
| 左 8%（64px） | 255,0,0 | 255,0,0 |
| 右 4%（768px） | 126,1,1 | 255,0,0 |
| 上 1px | 12,2,2 | 255,0,0 |
| 左上角 | 2,2,2 | 255,0,0 |

中心完全不动、边缘线性压到 #020202、四个方向对称 —— 暗角成立。

### 三、全站死代码审计：脚本枚举 + 逐条判定

三轮扫描（`audit_static.js` 类名/token/占位、`audit_static2.js` keyframes/url()/导入顺序、`audit_cls.js` 精确类名差集）。
**⚠️ 扫描器本身错了两次，都被复核抓回来**：
1. token 定义的正则 `--x\s*:` 看不见 `'--x': v` 这种带引号的 inline style 键 → 误报 6 个"无定义变量"，
   实际 `--rail-delay` / `--object-fit` / `--reveal-delay` 全部由 JSX 内联写入且带 fallback。
2. `animation` 声明里含 `var()` 就被跳过 → 误报 10 个"没人用的 @keyframes"，逐个复核后**全部在用**。
3. 类名差集对模板字符串 `` `a${x} b` `` 会拆错 → 误报 `.nav` / `.reveal` / `.magnetic` / `.section-dot` 等，
   逐个 grep 确认为动态拼接，都活着。
结论口径：只有"整词都搜不到"的才算真死。

**判定为真死、且本轮动手的（2 处，都是"问题没解决"而非"用不到"）**：
- `global.css` 里 `.nav-contact:hover .arrow, .contact-row a:hover .arrow, .email:hover .arrow { transform: translate(3px,-3px) }`
  —— 后两个类名全站没有任何元素使用（页脚邮件按钮实际是 `.footer-cta`），
  所以三分支只有导航那条生效，**页脚 CTA 的箭头一直只变色、不位移**。改成 `.footer-cta:hover .arrow`。
  实测 hover 前 `none` → hover 后 `matrix(1, 0, 0, 1, 3, -3)`。`.arrow` 自带 `transition: transform .3s`，无需补。
- `responsive.css` 的 `.side-note { display:none }`：该元素在更早一轮已并入 hero-badge（`Hero.css:104` 有记录），属重构残留，删除。

**判定为真死、但只报告不动手的（等用户点头）**：
- `src/components/TiltCard.jsx` 全站无人 import，连带 `global.css` 的 `.tilt-card` / `.tilt-glare::after`
  和 `--glare-x/y/opacity` 三个变量一起空转。`global.css:749` 自己写着"当前未被引用，保留待用"，
  所以这是**故意留的钩子**，不是漏挂 —— 要不要真给项目卡加 3D 倾斜是设计决定，不是 bug。
- `src/data/mediaLinks.js` 无人 import：它的 `douyinStats`（270W+/1000W+/50+）已被
  `douyinWorks.js` 的 `accountIdentity` 取代，`douyinProfile.url` 则被 `Footer.jsx:45` 硬编码抄走一份。
  **它就是 270W vs 280W 那个矛盾的第三处副本**，删之前先定数字。
- `@fontsource/fusion-pixel-12px-proportional-sc` 在 dependencies 里，`public/fonts/` 躺着 1.44MB woff + 588KB woff2 + 19KB license，
  全站没有任何 `@font-face` 或 `font-family` 引用它 —— 纯死重量。
- `--void-1/2/3/4/6` 五个 token 无人 `var()`。但它们不是漏挂：各板块的底色是按影片帧实测改写成裸 `rgba()` 的
  （见 `global.css:271-315` 的 --lane-w 那组），token 现在是调色板注释。留着无害。
- `SpiralGallery` 里 `rootStyle.perspective`、`.spiral-stage{transform-style:preserve-3d}`、`.spiral-card{backface-visibility:hidden}`
  全是惰性的：纵深是用 `scale(depthScale)` 假画的，卡片的 `translate3d` z 恒为 0，没有任何 3D 变换可给 perspective 作用。
  删掉零风险但也零收益，保留以维持与上游组件的同构。
- `public/assets/pptx-media/*` 若干未引用图 —— 那是从 PPTX 抽出来的素材库，故意留在站上供后续挑图。
- `public/404.html` / `robots.txt` / `sitemap.xml` 是扫描器的假阳性（本来就不该被代码引用）。
- `public/scrolly/`（css+js+index.html）**不是**死代码：`Media.jsx:51` 挂着 `/scrolly/index.html` 入口，
  且必须带 `index.html` 全路径（Vite 的 SPA fallback 会把 `/scrolly/` 回落成首页）。

### 四、⚠️ 我自己的 PNG 解码器写错，差点报出一个假故障

为了"读像素而不是推断"，写了个最小 PNG 解码器（`png.js`）。第一版把 **Paeth 预测器写成 `b+c−a`**（正确是 `a+b−c`），
filter-4 扫描行全部重建错误 —— 表现为纯红底上冒出 `231,255,255` 这种"黑渐变叠出青色"的荒谬像素，
当时我第一反应是"遮罩在某几行画错了"。
排查方式不是再猜，而是**拿 Chrome 自己当 oracle**：`png_verify.js` 把同一张 PNG 用 `data:` URL 塞进页面、
`img.decode()` + canvas `getImageData` 取 700 个点，与我的解码结果对表。修完 `不一致 0`，暗角数据才作数。
（对照图 `maskB.png` 是无遮罩参照，全红 —— 它解码"看起来很干净"恰恰因为纯色图掩盖不了 filter bug。）

### 五、本轮实测

`npx eslint` exit 0；`vite build` exit 0（65 modules，CSS 51.09 kB / JS 253.60 kB）。
headless Edge + CDP，`#account`，1440×900：
- `IMAGES {total:15, ok:15}`、`SECTIONS 7`、`EXCEPTIONS 0`。
- 位移探针：正常 `median=526.90px/3.5s`（半径变大后同样的角度进度换算成更多像素，符合预期）；
  **reduce-motion `maxDrift=0.00px`**；**滚出视口 `maxDrift=0.00px`**；滚回来 `median=205.92px` 恢复。
- 正面卡渲染 243×519。真鼠标单击 → OPEN `douyin-14.jpg`；Esc → CLOSED；
  拖拽 8 段共 208px → 位移峰值 1092px 且弹窗 `CLOSED`（拖拽不吃点击）；
  **拖过之后**再 Tab+Enter → OPEN `douyin-02.jpg`（`detail===0` 旁路仍有效）；
  `:focus-visible` → `tag:BUTTON, fv:true, 2px solid rgb(255,196,137)`。
- 页脚箭头 hover 位移见上节。
- 5 档视口实拍 `shots/r7-*.png` + 收尾 `shots/r8-final-1440.png`。

### 六、没做的事

- 没把 `radiusWidthRatio` 做成用户可调的界面参数，只是组件 prop；两个断点各写死一个值。
- 没动 1024 档 73% 的填充率 —— 那一档受容器高度限制，要改的是 `height: 80vh` 而不是半径，属于上一轮"手机高度 92vh"同一类布局取舍，等用户看实拍再定。
- `TiltCard`、`mediaLinks.js`、fusion-pixel 字体三件只报告，未删（删除是他们的决定，且 mediaLinks 牵动 270W/280W 那个还没定的数字）。
- `FilmStage.jsx` 那条未提交改动不是我的，全程没碰。

### 七、回退路径

本轮动了 4 个文件，全部 tracked：
`git --git-dir="D:\AI工作文件夹\self web\.githome" --work-tree="D:\AI工作文件夹\self web" checkout -- src/components/SpiralGallery.jsx src/components/SpiralGallery.css src/styles/global.css src/styles/responsive.css`
（⚠️ 这条会把 `global.css` / `responsive.css` 里**别人**的未提交改动一起回滚 —— 本轮之前它们是否 clean 未核对过，
真要回退请逐文件 `git diff` 看清再决定，别整条粘贴执行。）

### 八、中间产物

`%TEMP%\audit-20261011\` 新增：`audit_static.js` / `audit_static2.js` / `audit_cls.js` / `audit_kf.js`（四路静态扫描）、
`png.js`（最小 PNG 解码器，Paeth 已修正）、`png_verify.js`（拿 Chrome 当解码 oracle 的自检）、
`px.js` / `pxcmp.js` / `pxgrid.js`（像素读数）、`cdp_spiral7.js`（6 档几何探针 + 暗角注入）、
`cdp_mask.js`（暗角 A/B 取证）、`cdp_spiral8.js`（交互回归）。
截图 `shots/r7-*.png`、`shots/maskA.png`、`shots/maskB.png`、`shots/r8-final-1440.png`，
Edge profile 目录 `shots/edge-profile-{spiral7,spiral8,mask,verify}`。

---

## 首屏眼神改成「视线弧」：指针角度→素材时刻连续映射（2026-10-12 第十二次，已提交 `39e958b`）

### 用户这一轮要什么

原话：**「我想要的效果是，让首屏视频里面的人物跟随鼠标转动。提取视频的帧动画，跟鼠标的位置相绑定：
鼠标往上，人物就往上看；鼠标往下，人物就往下看。你是按这个理解去做的吗？」**
方案确认是**「先按一走」**（= 逐帧标注 + 直接 scrub，不做精灵图那条路），后续两次「继续」。

先记账一条：第九次那版**不是**这个行为。六个离散锚点 + 锚点间不响应，等于对一条连续的视线弧做了粗采样。
我在回答里直接说了这点，没有替上一版辩护 —— 用户问的正是"你是不是按我说的做的"。

### 转折点：先逐帧看素材，再定机制

`g2/mk.sh` 用 ffmpeg 按 8fps 抽了 81 张脸部裁切（`crop=640:480:320:60`），
拼成 4 张带**源帧号 + 毫秒**标签的联表 `g2/sheets/s01–s04.jpg`（24 格/张），人眼逐张读视线方向。
读出来的是：**10.08s 的 intro 本身就是一条 270° 的连续视线弧** ——
右(1.15) → 右上(2.3) → 正上(3.5) → 左上(4.15) → 正左(5.15) → 左下(5.7) → 正下(6.4) → 回正(8.55)。

这条事实把整个方案定了：中间帧在素材里**真实存在**，所以「提取帧动画绑到鼠标位置」这件事
不需要任何插值/补偿算法，只需要一条 **角度→时刻** 的映射。
第九次遗留的"一顿一顿"里，有相当一部分是采样点太少，不是 seek 慢 —— 这一点如果不先看素材就会一直往 seek 性能上找。

### 角度约定与钳位（写死在 `gazeTarget()`）

- 屏幕坐标系、逆时针、**向上为正**：`vy = faceY − my`，`atan2` 归一到 0–360°。
- 映射表 `ARC` 七个点 `(a, t, lead)`：(0,1.15,0.35) (45,2.3,0.4) (90,3.5,0.4) (135,4.15,0.45)
  (180,5.15,0.4) (225,5.7,0.25) (270,6.4,0.55)；死区单独给 `FRONT = {t:8.55, lead:0.35}`。
- 素材没有「右下」这一档 → 被钳位：`(270,315] → 270`、`(315,360) → 0`。
- 死区半径 `GAZE_DEAD = 0.1 ×（短边一半）`，落在里面才回正面。

### 两条 seek 策略与三个阈值

- `SCRUB_MAX = 0.3`：目标与当前差 ≤0.3s 就**逐帧直 scrub**（一次 mousemove 一次 seek，
  右→上那一档实测 23 次 seek / 30 次 mousemove，这就是设计上限）；更远才用素材自己的动作播进
  （seek 到 `t−lead` → `play()` → 到位 `pause()` → 必要时补一次校准 seek）。
- `GAZE_EPS = 1.5/FPS`：差在一帧半以内不重发 seek，否则静止画面会自己抖。
- `GAZE_DWELL = 120`：切回正面要在死区停满 120ms（横扫必然擦过脸上方，不设门槛会把一次转向拆成两段）。
- `q(t)=round(t*24)/24` 两边都量化后再比 —— 拿原始秒数比会在起播点被舍入变小那一档误判成"绕回 loop"。
  第九次那三条坑一条没退场，都还在生效。

### 本轮唯一一处真 bug：播进会抱着过期目标跑完

`phase==='playing'` 时只检查"到没到位"，不检查"目标还成不成立"。指针在播进途中又挪，
这一版会把这一次播进跑完，画面被拖向一个已经过期的姿势，落位后才发现要重转。
判据行（改动前那一跑，`settle.js` 同一用例）：

```
左上→右下 平滑30步  定住偏差 0°  拖拽中 p50/p95/max 0/130.7/141.3
  停→定住 546/600(播进 711ms)  seek 8/30 停手后 2  落点 1.166≟1.1667  ✗
```

加了 `GAZE_REAIM = 3/FPS`：播进进行中若新目标挪出三帧半，就地 `pause()` 退回 `hold`，下一帧改瞄新目标。
改后同一用例（`settle-r10.log`）：

```
左上→右下 平滑30步  定住偏差 0°  拖拽中 p50/p95/max 0/3.7/120.7
  停→定住 331/600(播进 498ms)  seek 9/30 停手后 1  落点 1.1667≟1.1667  OK
```

⚠️ "改动前"那行现在**不可复现**（要复现就把 `tick` 里 `if (dwell && Math.abs(q(want.t) - q(aimT)) > GAZE_REAIM)`
那一支删掉）。用户看到的"跟不上"主要是这一段 546ms，不是单次 seek 慢 —— 单次 seek 一直是 6ms 量级。

### 判据整条换掉：旧的两条是探针自己的错，不是页面的

1. **「seek 个/秒 ≤60」作废**。本机 headless rAF 实测 166Hz（`settle.js` 会打印 `rAF/600ms`），
   按帧率当分母会把逐帧 scrub 的正常行为判成风暴。改成**逐 mousemove 预算**：
   一次拖拽内 `seek ≤ mousemove 次数 + 2`，且停手后 ≤2。
2. **「尾延迟 ≤400ms」对播进是错的**。播进按设计就要花 `lead` 秒真实播放，那是素材成本不是滞后。
   现在分两档：播进档预算 = `lead×1000 + 250`，只有纯 scrub 才拿 400ms 硬账。
3. **误差单位从"素材秒数"换成"角度差（度）"**。正下那一段素材里时间走了 0.5s、视线角度几乎没变，
   用秒当误差会把设计读成缺陷。（这条是用户说的"滞后"到底该怎么量，才终于有了对口单位。）
4. Node 侧**原样重放 120ms 死区停留**，并把起点前站着的 1800ms 计入初值 ——
   否则"设计上按住的上一姿势"会被判成滞后。拖拽路径用**实测窗口** `tStop−t0` 而不是名义 300ms，
   这一处改完 max 从 141° 降到 120°（残差是被钳位的右下区间切出来的，见下）。
5. 上一轮定的口径「指针停稳→定住 ≤0.3s」**对弧线不再适用**（相邻角度走 scrub，本来就没有 0.3s 这一说），
   已由上面 1–3 取代。别照着它再判一次。

### ⚠️ `currentTime` 回读有 ±1 帧的不确定性，别拿它当证据

`facecheck.js` 实测：直写 `k/24` 的回读落点**非确定**（同一值两次跑差一帧），
而且相邻两帧（123/124）的 64×64 canvas 像素哈希**完全相同** —— 这一帧素材里本来就没变化。
所以：判"画面落在哪一姿势"要么信**像素哈希**，要么信"指针角度对应的稳态"，不能信时钟。
`settle-r10.log` 里 `落点 5.1244≟5.1667` 这种 0.04s 差是回读噪声（判据容差 ±0.05s），不是没到位。
这条左右为 1 帧的差异我追过一轮，最后是拿"两帧像素相同"关掉的 —— 下一个人别重追。

### `contrast.js` 选帧机制重写（第九次那批 AA 作废的原因）

- `GAZE_T=<t>`：把指针摆到该时刻对应的方向，让**页面自己** seek 过去（真实渲染路径，只到得了稳态帧）。
- `FREEZE_T=<t>`：先用 CDP 仿真 `prefers-reduced-motion` 让 `gazeLive()` 为假（tick 不再发 seek），
  再直写 `currentTime` —— 专量播进途中的过渡帧，那些时刻不是任何角度的稳态，指针摆不过去。
  代价：这一档是 reduced-motion 排版下拍的静帧，已在输出里标「（冻结态直写）」。
- 为什么必须分两条：`pin.js` 证明**直写会被组件在 700ms 内收回**（写 3.5 → 回读 8.5417）。
  第九次就是拿"直写"当"选帧"，于是 11 帧量的是同一帧 —— 已在那一节原地标注作废。

### 实测（本轮全部重跑并留档，日志就在 scratch 目录）

- `settle.js` **1440×900**（`settle-r10.log`）：9 条拖拽用例 + 连续甩 12 次（seek 共 16 次，≤36 即无风暴，2.5 个/秒）
  + **指针停住后 3s 内 seek 0 次** → **全部通过**。定住偏差 0–2.5°；播进档"停→定住"221–434ms（预算 600/800），
  scrub 档 0ms（提前到位）。
- `settle.js` **1024×768**（`settle-r10-1024.log`）：同样全部通过（seek 14 次 / 无风暴，停手后 0）。
- `gaze.js` 1440×900（`gaze-r10.log`）：**视线弧命中 9/9**，含「右下(素材无) 318° → t=1.17」那条钳位；
  intro seek 延迟 **p50 6.4 / p90 14 / max 16.5 ms**；滚出交棒、滚回顶部重新钉帧都正常。
- `gaze2.js idle|reduce|touch`（`gaze2-r10.log`）：三条 OK；reduce 下移鼠标也不 seek；
  触屏仍走"intro 循环播"兜底（2.4s 内净前进 2.43s）；控制台 0 error/warning。
- `functional.js`（`functional-r10.log`）：下滚递增 / 上滚倒放 OK，main 段 max |want−got| 0.02s（一帧 0.042s）。
- `contrast.js` **16 帧**（`contrast-r10.log`）：8 个稳态角（`GAZE_T`）+ 8 个播进首帧（`FREEZE_T`，各角度 `t−lead`）
  @1440×900，每帧 7 组文字 → **逐帧 min 10.72–11.11:1，16/16 帧 `<4.5:1` 计数为 0**；
  16 帧的"回读 t vs 量化帧"一条 ✗ 都没有（说明选帧这步这次是对的）。
- `npx eslint` exit 0；`vite build` exit 0（65 modules，CSS 51.09 kB / **JS 253.60 kB**）。
- 视觉确认：`g2/pose-<方向>.jpg` 九张 + `g2/pose-montage.jpg`（3×3 带标签拼图，`g2/mkpose2.sh`）。
  1440×900 与 1280×720 两档都逐张看过：九个方向各自的表情/头位与标签一致，没有串位。

### 素材带来的取舍（要用户点头，不是我这轮能改的）

1. **「往上」那一档在素材里就是吐舌大笑** —— 抬头动作和那个表情是同一批帧，不重新拍素材换不掉。
2. **「往下」是低头咬牙**，脸压到画面下缘，下巴刚好在 SCROLL 提示上方；两档视口内都没出画，但构图确实比正面沉。
   `pose-down.jpg` 就是给用户看这一条的。
3. **「右下」不存在**，被钳到「右」。指针从右下扫到右上时角度会穿过被钳区间，
   所以 `max` 那一列仍有 120° 尖峰 —— 那是**拖拽途中的瞬时值**，定住后是 0–2.5°。
4. **左→正的播进先向下掠过正下再回正**（133° 的前向行程；播进只能顺着素材往前播，倒放就变成"抬头回去"）。
   唯一旋钮是 `FRONT.lead`（现在 0.35），缩它会吃掉转头开头几帧。**没动，等用户看观感。**

### 没做的事

- `public/fonts/fusion-pixel-*`、`TiltCard.jsx`、`mediaLinks.js` 三件仍未删（第十一次那节已报告，等用户点头；
  `mediaLinks` 还牵动 270W/280W 那个没定的数字）。
- 没把 `ARC` 从 7 点加密到 12 点：现在近邻已经逐帧 scrub，加密只改映射表不改观感，等用户先看这一版。
- 没做触屏拖拽映射（无 hover 就是循环播）。
- 本轮源码只动 `src/components/FilmStage.jsx` 一个文件，`FilmStage.css` 的 `.film-layer--intro{transform:scale(1.08)}`
  仍是纯静态取景裁切（JS 不写首屏层 transform，这条由 `gaze2.js idle` 的「无内联」断言守住）。

### 回退路径

`git --git-dir="D:\AI工作文件夹\self web\.githome" --work-tree="D:\AI工作文件夹\self web" checkout -- src/components/FilmStage.jsx`
⚠️ 会把整条视线弧一起退回**第九次的六锚点版**（`c81703b` 之后我没再提交过这个文件）。
只想撤"播进作废"这一条的话，删 `tick` 里 `GAZE_REAIM` 那一支即可，其余映射不受影响。

### 中间产物（scratch 新增）

`facecheck.js`（y 向扫帧 + `k/24` 回读复现 + 64×64 像素哈希比对）、
`pin.js`（证明直写 `currentTime` 被组件收回）、`g2/mkpose2.sh`（3×3 标注拼图）、
`g2/pose-*.jpg` 九张 + `g2/pose-montage.jpg`；
日志 `settle-r10.log` / `settle-r10-1024.log` / `gaze-r10.log` / `gaze2-r10.log` / `functional-r10.log` / `contrast-r10.log`。

探针环境已收尾：无头 Edge 那棵树用 `probe-kill.ps1` 处理 ——
**按 `--user-data-dir` 里含 `86bb0198` 认身份**（不是按端口：同机并发会话也开无头 Edge，
只筛 `remote-debugging-port` 会把别人的那棵一起带走），先打 PID 清单 → 杀 → 复查
`after=0` / `listen_9333=0` / 用户自己的 Edge 24→15 未被波及 → 才删 `edge-profile`（482 MB，scratch 从 499 MB 回到 14 MB）。
`vite.log` 与 dev server（5173）**留着**，因为「正下那档低头能不能接受」「左→正播进要不要掠过正下」
这两条要用户在真页面里移动鼠标看。`%TEMP%\audit-20261011\` 是并行会话的探针目录，没碰。

---

## 抖音截图白边重做：10 张素材重新导出（2026-10-12 第十三次，未提交）

### 用户这一轮要什么

原话：**「这个手机图片里有白边，需要你把项目里的部分图片重新替换一遍。需要重新上传的都在这个文件夹里了，其余图片不用变」**
（附件：WorkModal 里 `douyin-06`「为什么《强风吹拂》没有第二季？」的截图 + 文件夹 `C:\Users\lzh\Desktop\抖音`，里面 10 张原始 PNG）。
边界写得很清楚：**只换这 10 张，其余 5 张（`douyin-11..15`）不许动**。

### 一、白边不是"截图本身白"，是**上一版把 alpha 摊到了白底上**

这批素材是 1552×3317 的 **RGBA** PNG —— 手机样机图（带银色机身外壳），
alpha 通道就是那圈样机轮廓遮罩：圆角 + 机身以外的区域。实测（`edge_probe.py` / `alpha_view.py`，10 张的 alpha 掩膜**逐字节相同**）：

- 全透明像素 57,410 个，**它们存的 RGB 全是纯 0**（`zero-alpha px rgb are all zero? True`）；
- 半透明（羽化边）18,732 个，存的 RGB 均值 128.7 灰；
- 掩膜分布：右边缘 12 列是全透明，圆角处向内羽化 ~150–200px。

⚠️ 顺带记一条方法：第一版探针打印"10 张图的边行均值、透明比例**完全相同**"，我按第十一次那三次扫描器翻车的经验
先怀疑是自己读错了，用 `hash_probe.py` 逐文件比像素 md5 才确认**数据是真的** ——
`row0_md5` / `col0_md5` 十张全等，因为样机外壳就是同一张模板。
"结果好到不像真的"要先证伪，但证伪完要敢认它是事实。

所以同一张源图有两种落法：

| 处理 | 手机轮廓以外画成 | 站内文件 |
|---|---|---|
| 摊平到白底（旧版，脚本已不在 scratch，具体命令未证实） | **白** | `douyin-01..10.jpg` |
| `convert("RGB")` 直接丢 alpha（`douyin_new_assets.py`，11–15 用的这条） | 黑（因为底下存的本来就是 0） | `douyin-11..15.jpg` |

**实测判据**（`corner_runs.py`：从 8 个角沿边向内的"连续近白（≥240）像素长度"）：
`douyin-01..10` 旧文件 = `89/63 · 87/94 · 86/57 · 401/901` px，`douyin-11..15` = **全 0**。
白边有多大不用目测，就是这串数。

⚠️ 别拿"外圈近白像素占比"当判据：旧版 13.16% → 新版 3.37%，看着像没干净，其实那 3.37% 是**真内容**
（顶部白色搜索条、底部评论区白字）压到边上。第一版脚本正是用这条判据，在 06 上把自己拦停了。

### 二、10 张 ↔ `douyin-01..10` 的配对是量出来的，不是按文件名认的

10×10 灰度 MAD 矩阵（`match_matrix.py`）：对角 **3.6–4.5**，非对角最小 **45**，
每张的次优候选都比最优差 **11.8–19.7 倍**。按文件名排序第 k 张 ↔ `douyin-0k.jpg`，与第五次那轮结论一致。
内部区域（去掉外圈 20%）新旧 MAD 1.4–2.0 = JPEG 噪声级 → **画面内容一字未变**，
所以 15 条 `title`/`caption`/互动数全部继续成立，`douyinWorks.js` 这次不需要动。

### 三、做法：复刻 11–15 那条流水线，脚本里放三道闸

`convert("RGB")` → LANCZOS 到 800×1709（与样机长宽 0.46789 vs 0.46811 差 0.05%，卡片 178×380 下 `object-fit:cover` 只裁 0.25px）
→ JPEG `quality=85, optimize, progressive` → 先写 `*.new` 再 `os.replace()`。
闸（`replace_assets.py`，任一不过就中止）：① 源图必须 1552×3317 且 RGBA；② 配对 argmin 必须等于 k、最优 MAD<12 且次优>25；
③ 写回后 8 条边的连续近白长度必须**全 0**。中途那次判据错误导致 01–06 已写入、07–10 未写入 —— 脚本幂等，重跑一遍即齐。

结果：10 张合计 **1.84 MB**（单张 120.8–247.6 KB），15 张现在同一条流水线、同一规格。

### 四、实测

- dev server 是**用户自己开着页面的那一个**（PID 11956，只听 `[::1]:5199`，`curl 127.0.0.1` 会假报 refused —— 别按 IPv4 判死，用 `localhost`），全程没杀。
  响应头 `Cache-Control: no-cache` + 弱 ETag，普通刷新就能拿到新字节。
- CDP（`cdp_assets12.js`，1440×900）：把 15 张全部用浏览器自己的解码器读进 canvas 量角 —— **15/15 `800x1709`，worst corner run = 0**；
  点正前方卡 → 弹窗 `douyin-09.jpg`「朋友，「我们总是要再见 为了再见」」，图 295×630，`complete:true`；`EXCEPTIONS 0`。
  实拍 `shots/r12-wall.png`（螺旋墙）、`shots/r12-modal.png`（弹窗，白边已无，样机外壳仍在）。
- `verify_assets.py`：`/assets/` 引用 35 条解析 33 缺 0；douyin 目录 15 个文件 ↔ 数据 15 条引用，无孤儿无缺引；id 1..15 连续。
- 改动范围：`git status` 只有这 10 个 jpg + 第十一次那 4 个源文件 + 本文件。**没有**新增/删除任何文件，`public/` 下无 `*.new` 残留。

### 五、留给用户看的两件事

1. **样机的银色机身外壳还在**（截图就是这么给的，不是白边）。要只剩屏幕，得重新裁图并改卡片长宽比 —— 等用户看 `r12-modal.png` 决定，我没自作主张裁。
2. 半透明羽化边丢掉 alpha 后落成 ~60–106 的灰（11–15 一直如此）。改成"按 alpha 合成到黑"实测只把外圈均值从 82.8 压到 81.6，肉眼无差、且会让这 10 张和另外 5 张不同源，**没做**。

### 六、回退路径

`git --git-dir="D:\AI工作文件夹\self web\.githome" --work-tree="D:\AI工作文件夹\self web" checkout -- public/assets/douyin/douyin-01.jpg public/assets/douyin/douyin-02.jpg public/assets/douyin/douyin-03.jpg public/assets/douyin/douyin-04.jpg public/assets/douyin/douyin-05.jpg public/assets/douyin/douyin-06.jpg public/assets/douyin/douyin-07.jpg public/assets/douyin/douyin-08.jpg public/assets/douyin/douyin-09.jpg public/assets/douyin/douyin-10.jpg`
这 10 个 jpg 本轮之前是 tracked 且 clean（`git ls-files -s` + 空 status 已核对），所以这条**只退我这次的改动**，不会牵连别人 —— 和第十一次那节 `global.css` 的警告不同，可以整条执行。

### 七、中间产物（scratch 新增，全在 `%TEMP%\audit-20261011\`）

`img_probe.js`（PNG IHDR / JPEG SOF 尺寸表）、`hash_probe.py`（逐文件像素 md5 + 全局均值）、
`white_probe.py` / `edge_probe.py` / `alpha_view.py` / `border_geom.py`（白边定位）、
`match_matrix.py`（10×10 配对矩阵）、`corner_runs.py`（本轮判据）、
`variant_sheet.py` + `dy12/`（旧版 / 丢 alpha / 合成到黑 三种边缘对照表）、
`replace_assets.py`（带三道闸的替换脚本）、`cdp_assets12.js`（浏览器侧复核），
截图 `shots/r12-wall.png`、`shots/r12-modal.png`，Edge profile `shots/edge-profile-a12`。

---

## 板块底板从「黑色磨砂」改成「不透明信息场」（2026-10-12 第十四次，未提交）
> 后记（2026-10-13 改）：本节这一版**已不在工作区** —— 他后来澄清要退回「方案 A 之前」，本轮与第十五、十六、十七次一起全部撤销，
> 当前停在第十三次末的黑磨砂板状态，见文末「第十八次」。想还原本节这一版：`cp r15-backup/{global.css,Footer.css,FilmStage.css}`
> 到 `src/styles/` 与 `src/components/` 对应位置（同一快照里的 `responsive.css`/`About.css` 实测与动手前字节相同，复制与否不影响）；
> 另外 6 个组件 CSS 本轮没碰，现在就是本节这一版。
> ⚠️ 更正一处上一版记录的错话：先前「第十四次至少动了 5 个文件」的"更正"是**我推错的**，证据（"与 HEAD 不同"）不成立 ——
> HEAD 是第十二轮的 `39e958b`，其后本来就堆着历轮未提交改动，与 HEAD 不同不能归给第十四次。
> 实测两份快照对拆（`r14-backup/` 动手前 vs `r15-backup/` 动手后）：`global.css` 差 180 行、`Footer.css` 差 9 行、
> `responsive.css` **字节相同**；`FilmStage.css` 只在第十四次加过一条注释（本轮工作区已恢复 HEAD 那份），`About.css` 与 HEAD 相同。
> 所以本节正文「只动 2 个文件」是对的（严格说另有 1 条注释行），不要照上一版那句改。


### 用户这一轮要什么

「整个个人网站的内容展示的底板不要用黑色磨砂底板」，并附两张图：图一是参考站（EMBER.dsgn），图二是本站板块上那块看得见的半透明黑玻璃。
要求不是"照抄参考图"，而是先按六个维度拆参考图的排版语言（字体/字重、字号层级、对齐、颜色体系、装饰件、整体气质），
再判断能不能和现有体系合并 —— 可以就给完整计划，不可以就给理由。

### 一、参考图的语言是「分区」，不是「压暗」—— 这条是本轮所有改动的根

拆完六维，真正可移植的只有一条：**文字不压在图上，图与字各占一侧，中间一条硬缝**。
其余（浅灰场 + 深墨正文、全大写 Archivo 微标签、居中 MENU）都不能照搬，理由见第四节。

⚠️ 我先入为主错过一次：以为参考图是"白字压浅灰"，`ref_contrast.py` 量出来正好相反 ——
正文是**深墨（像素 45–48）压在灰底 176 上 = 6.15:1**，全站只有顶栏和页脚的微文字是白，且只有 1.32–1.98:1（它自己就不合规，是它的取舍）。
分界在 x=318/640（≈49.7%），一像素内从灰底跳到照片，**刀口、无羽化**。

### 二、为什么不能"把板删掉"就完事（这是本轮唯一的技术硬约束）

撤板实测（`cdp_plate14.js` 同帧四张 + `plate_contrast.py`，逐字取样）：

- strength 说明文字 6.28–7.36 → **2.01–3.67**（14 个节点里 8 个掉出 AA）
- media 132px 大标题 9.01 → **1.88**，导语 12.49 → **2.00**

根因在素材本身，不在 CSS：grade 之后墙面 relLum 0.117–0.264、脸部 0.386（`FilmStage.css` 注释里那组数）。
**纯白压在 L=0.224 的墙上，数学上限就是 3.83:1** —— 所以"把墨色提亮"这条路是死的，只能改底。
（中途我拿错过一次数：把相对亮度当 sRGB 灰阶喂进阈值表，算出一张 nonsense 的墨色对照表；补了反 gamma 之后这张表才是本轮的决策依据。）

### 三、改动清单（只动 2 个文件：`src/styles/global.css`、`src/components/Footer.css`）

1. **七板块共用一条实色场**：删掉 `.about / .strength / .experience / .work / .media / .account-ops / .footer` 各自的
   「方向遮罩 `linear-gradient(96deg,…)` + 平坦档 `rgba(n,n,n,.34–.74)`」两层，换成一条硬断：
   ```css
   --pad:  max(60px, calc((100% - 1700px) / 2));
   --lane-w: calc(100% * var(--lane));
   --seam: calc(var(--pad) + (100% - 2 * var(--pad)) * var(--lane));
   background: linear-gradient(90deg, var(--field) 0 var(--seam), transparent var(--seam));
   ```
   `--field` 一律取该板块原本在 `--void` 阶梯上的那一档（void-1…7），「越往下越沉」的阅读顺序原样保留。
2. **`--lane-w: 38%` → `calc(100% * var(--lane))`**：子元素的 100% 是板块**内容盒**，板块自己的 background 100% 是**填充盒**，
   两者差一个 `--pad`，所以缝必须写成 `pad + (100% - 2*pad) × lane` 才对得齐。所有 `width: var(--lane-w)` / `max-width: var(--lane-w)` 的既有用法不用改。
   实测对齐：1920 下 `.work` 的 `--pad`=102.5、boxW=1905、缝在 884.5 = 102.5 + 1700×0.46，与内层 `.wrap` 左缘同源；
   1920 的 strength 实拍里能力网格右边框 x≈915，缝 918.5（留的就是注释里那 10px 气口）。
   ⚠️ `--lane` 必须无量纲 —— 它是乘数；写成 `0.48 * 100%` 之类会让整条 calc 失效。
3. **道宽值不重标**：38/48/48/46/46/43/47% 全部沿用 `lanes2.log` 的主体避让实测，`DODGE` 位移也没动 —— 本轮只换"底"，不换"道"。
4. **`::before` 纵向暗带整组退役**（连同 `--title-band-h: 46%`）。它是"大字横穿主体"的补丁：h2 出道压在 L 0.26 的墙上才需要自上而下再压一道。
   底成常量之后补丁失去存在理由，而它本身就是"板感"的另一半（一块矩形里外两层暗）。全站 grep 只剩注释里一处提及，无悬空引用。
5. **墨色按常量底重排（A4）**：`--text-base .88→.94`、`--text-dim .66→.78`。
   旧值是从遮罩**反推**的 —— 0.66 要求底 L ≤ 0.034，也就是必须先有那块板把影片压到 0.034 才成立；板一撤同一档就掉到 3.49:1 / 2.60:1。
   现在底是 `--void-N` 实色（L 0.0024–0.006，常量），0.78 在最深档上 = 12.1:1、0.94 = 15.6:1，余量留给压在影片上的少数元素。
6. **≤900px 保留半透明整幅压暗**（`--lane: 1` + `rgba(11,7,6,.72)…rgba(2,2,2,.88)`）。
   不是妥协：手机竖屏上暗档铺满整个视口，**没有可见边界就没有板感**（板感恰恰来自看得见的边），而实色会把影片在手机整个糊掉。
7. `Footer.css` 顶部注释：可读性来源从"顶部暗板"改成"实色信息场"，并删掉那句已经不存在的"暗板"警告。

### 四、被我自己否掉的三项子改动（都写在这里，免得下一轮又被"参考图里有"捞回来）

- **`--line .10→.14`**：原计划理由"板把分割线压暗了，撤板要提回来"——**方向反了**。撤板之后底更暗（实色 void vs 板压影片），
  白线的相对可见度只升不降；实测不提也已 0 失败。无依据的改动不做。
- **kicker 前加圆点**：全站 kicker 已经是「`01 // ABOUT ME`」编号+斜杠这套分隔，导航另有 4 点阵 active 指示（`Nav.css`，
  5px 周期 / 1.5px 点径）。再加一套点就是第三套同级标记，只会互相稀释。
- **页脚三列微信息**：参考图那三列是 地址 / 时间 / `GMT+5 // LOCAL` 读数。本站底栏已有 `© 2026 LIZONGHENG`、`长春 / 中国`、`BACK TO TOP↑`，
  补第三列要么编站内没有的内容（禁止），要么加实时时钟 —— 那是**新功能**不是样式移植，要用户点头。按 A6 自己那条"缺内容就不做并说明"停掉。

### 五、实测（六档视口，判据：逐字 p5 ≥ 阈值）

`cdp_field14.js` + `field_contrast.py`，每档 8 个板块各拍同帧两张（有字 / `color:transparent`）：

| 视口 | 取样节点 | 失败 | 最紧一档（p5） |
|---|---|---|---|
| 1440×900 | 115（+6 未渲染） | **0** | work h2 132px = 5.40 |
| 1920×1080 | 131 | **0** | work h2 168px = 5.36 |
| 1280×800 | 104 | **0** | work h2 116px = 5.40 |
| 1024×768 | 95 | **0** | work h2 90px = 5.40 |
| 800×900（半透明档） | 115（+1） | **0** | strength 15px = 9.68 |
| 390×844（半透明档） | 96（+4） | **0** | hero 10px = 7.86 |

- 全站**最差单像素** 4.69:1（1920 的 footer 168px 标题压在影片上的那半截；大字阈值 3.0，连最严的正文阈值 4.5 都过）。
- "未渲染"是横向轨道里没滚到眼前的卡（390 的 media 4 个、800 的 1 个），不是缺陷。
- `vite build` 通过（284ms，index CSS 50.53 kB / gzip 10.21 kB），CSS 里两条硬色标钉同一位置这种写法没被 Lightning CSS 拒绝。

⚠️ **这台机器上量对比度只认 v3 这套口径**（前两版都在误报，别再走一遍）：
同帧两张相减得 dE → 取 `dE > 0.7×dmax` 的位置当"确实被笔画盖住" → 墨色用**声明色**（含 alpha）合成到**实测背景像素**上算对比。
- 用渲染像素当墨色 → AA 边缘全是中间调，每个元素都测成 ~2:1（v2 的错）。
- 按元素矩形取最亮背景 → `.section-kicker` 这类满幅 flex 容器右半截伸到影片上却没有字，整条被判失败（v1 的错）。
- 另外 `plate_contrast.py` 有个 `worst = 1.0` 配 `min()` 的写法会把所有结果压成 1.00，已改成 999。

### 六、纠正一处我上一版报告里的错（同一个教训：没量就别下结论）

我曾断言"窄屏有留白缺陷：`--pad` 60px 撞 responsive.css 的 `.wrap` 100%−28px，390 屏上 About 只有 227px 而 Projects 362px"。
`out/geom390.js` 实测**否掉了它**：responsive.css 的 `.section, .work { padding: 60px 0 }` 简写把 `padding-inline` 归零，
390 下 `.about` 与 `.work .wrap` 都是 x=14 / w=347，两侧留白一致，**没有缺陷**。
仍然值得记的是结论的另一面：**`--pad` 在 ≤800px 是死值**，谁拿它推算窄屏就会算出一个不存在的 bug。

### 七、留给用户看的两件事

1. **巨型标题横过硬缝**：media / work / footer 的 h2 是"出血大字"（第七轮定的分工：只有 h2 出车道 `width:100%`，`<p>`/标签/CTA 仍受 `--lane-w` 约束），现在后半截压在影片上、前半截在实色场上，
   一条笔画中间换底。对比度实测仍过（≥4.69），但这是口味问题 —— 要不要把 h2 收回道内（`width: var(--lane-w)`），等用户看 `r14v-1920/*-bg.png` 决定，我没动。
2. **手机端 14–20px 的视口边缘没被压暗**（暗档只覆盖板块自己的盒子，`.wrap` 居中后两侧露出原始影片）。撤板前后行为一致，本轮没引入，肉眼在 390 上几乎看不出。

### 八、回退路径

⚠️ **不能 `git checkout`**：`global.css` 与 `Footer.css` 里还压着第十/十一/十三轮的未提交改动，checkout 会一并抹掉。
本轮改前已备份 → 覆盖回去即可（备份 = 撤板前状态，实测含 7 条 `linear-gradient(96deg` 与 `--title-band-h: 46%`，且无 `--seam`）：

```
copy /Y "C:\Users\lzh\AppData\Local\Temp\audit-20261011\r14-backup\global.css"  "D:\AI工作文件夹\self web\src\styles\global.css"
copy /Y "C:\Users\lzh\AppData\Local\Temp\audit-20261011\r14-backup\Footer.css"  "D:\AI工作文件夹\self web\src\components\Footer.css"
```

### 九、中间产物（scratch 新增，全在 `%TEMP%\audit-20261011\`）

`cdp_plate14.js` + `plate_contrast.py`（撤板对照，`r14/` 四张：板开/板关×有字/无字）、
`ref_contrast.py`（参考图取样）、`cdp_field14.js` + `field_contrast.py`（本轮验收，VW/VH 走环境变量，输出目录按视口分档）、
`out/geom390.js`（窄屏列宽实测）、`out/fc{1440,1920,1280,1024,800,390}.txt` + `out/tightest.txt`、
截图 `r14v/`（1440 基线，8 板块 × {`-bg`,`-notext`,`.texts.json`}）与 `r14v-{1920,1280,1024,800,390}/`、
备份 `r14-backup/{global.css,Footer.css,Footer.jsx,responsive.css,FilmStage.jsx}`（后三个本轮未改，属防御性备份）。

---

## 首片整条换掉 + 视线弧重标：新「新视频.mp4」上机（2026-10-12 第十五次，未提交）

> 后记（2026-10-13）：**本轮已撤销**，工作区的首片回到 HEAD 那份旧 `intro.mp4`（3,368,867 B）+ 旧视线弧表，见文末「第十八次」。
> 想恢复本轮：`cp r18-backup/FilmStage.jsx src/components/ && cp r18-backup/scrolly/intro.mp4 public/assets/scrolly/`（新素材 3,130,069 B）。
> 他给的原素材没删，还在 `C:\Users\lzh\Desktop\网站图片\新视频.mp4`，重做不必重新要文件。

### 用户这一轮要什么

原话：**「请你用这个"新视频"将首屏视频替换掉，并将现在的"首屏视频"的效果完全应用到"新视频"里，你可根据实际情况进行调整，让整体效果和观感更好」**
附件 `C:\Users\lzh\Desktop\网站图片\新视频.mp4`：10.08s / 24fps / 1280×720 / 带一条 AAC 音轨 / 容器 `start: 0.046440`，
抖音源标记 `vid:v0269cg10004db6f3r27dld96jh1l5u0`（旧素材那份的 `comment` 也是同一家族的 vid，所以元数据口径没变）。

"效果完全应用"我按字面理解做的：**视线弧机制整套在新素材上重标一遍**（ARC / FRONT / FACE 三张数），
而不是只把文件换掉 —— 只换文件的话，指针往上、人物会先看左再往下看，因为旧表的时刻在新素材里对应的是别的姿态。

### 一、同一角色同一场景，但弧完全不同

新素材还是那个 3D 卡通人物、同一批脸上贴纸（GOOD VIBES / WOW / Nice! / COUL / 皇冠 / 兔子）、黑毛衣、橄榄灰墙。
所以 `FilmStage.css` 那套影片调色（`sepia .38 / hue-rotate -6deg / saturate 1.3 / brightness .74` + `scale(1.08)` 取景）
**照旧成立，一个字没改**；板块避让表 `DODGE` 只管 `main.mp4`，与这次替换无关。
但旧表那七个时刻在新素材里**一个都不成立**（旧：右1.15→正下6.4→回正8.55；新：右0.08→正下4.75→回正9.58）。

### 二、判读必须落在「重编码后那份」的帧号上（本轮的方法账）

源片有 0.046s 的起始偏移，重编码后帧数 241→242、`start` 归零。
我第一遍是在**源片**上按 8fps 抽帧读的，第二遍改成在**装好的那份**上按**整帧号**读
（`-vf select='eq(n\,N)' -vsync 0`，这样 N/24 就是浏览器 `currentTime=N/24` 会落到的那一帧）。
两遍第一圈对得上（≤0.15s），第二圈最多差到 ~0.4s；差多少说不清是偏移还是第一遍读错，反正以整帧号那遍为准。
**最终这张表全部出自第二遍。** 下一轮要再改这张表，别在交付前的源片上量。

### 三、新素材的视线弧（实测，帧号 = 秒 × 24）

```
右 0.00–0.17(N=0–4) → 右上 0.21–0.38 → 正上 0.42–0.63 → 左上 0.67–1.25 → 正左 1.42–3.00
→ 左下 3.08–3.96 → 正下 4.04–5.25 ｜第二圈｜ 正左 5.83–7.00 → 左上 7.12–7.88
→ 右上 8.17–8.54 → 闭眼笑 8.58–8.75 → 右 8.79–9.21 → 回正看镜头 9.25–10.04
```

新表（控制点取各姿态窗**中点**，`lead` = 素材里"进入该姿态"那段动作的长度）：

| a | t | lead | 起播点 | 姿态 |
|---|---|---|---|---|
| 0 | 0.08 | **0** | — | 正右（张嘴惊讶） |
| 45 | 0.29 | 0.20 | 0.09 | 右上 |
| 90 | 0.54 | 0.25 | 0.29 | 正上（睁大眼） |
| 135 | 0.88 | 0.30 | 0.58 | 左上 |
| 180 | 2.38 | 0.40 | 1.98 | 正左（头转到左侧 3/4） |
| 225 | 3.42 | 0.40 | 3.02 | 左下 |
| 270 | 4.75 | 0.45 | 4.30 | 正下（低头、眼皮耷下） |
| 死区 | 9.58 | 0.35 | 9.23 | 回正、闭口微笑看镜头 |

四件素材决定、代码改不了的事（都写进 `FilmStage.jsx` 的注释了）：
- **仍然没有「右下」姿态** → `gazeTarget()` 那两条钳位原样保留，没动。
- **正右压在片头第 0–4 帧**，前面没有可回摆的动作 → `lead` 只能给 0。代码里 `playIn = … && want.lead > 0`
  这道闸本来就在（第十二次为别的理由加的），所以 0 直接走硬 scrub，**不用改代码**。
  代价：**左→右这一跳不再有播进尾巴，是硬切**（旧素材这一跳有 0.35s 的动画）。
- 8.58–8.75 那次闭眼笑**落在可达帧集合外**：可达 = 弧 0.083–4.75 ∪ 七段起播窗 ∪ 9.23–9.58，指针摆不进去。
- 第二圈（4.75–9.25）整段不可达 —— 弧按角度单调排，只能用第一圈。

### 四、脸心 `FACE` 从 (0.498, 0.41) 改到 (0.521, 0.389)

新素材的头会转、会低，脸在画面里走的范围比旧素材大得多：8 个控制帧上逐个量虹膜中点，
x 跨 0.494–0.544、y 跨 0.347–0.493（旧素材基本钉在一点）。取均值 (0.521, 0.389)；
回正那一帧是 (0.524, 0.393)，与均值差 <20px，所以死区和 FRONT 的观感不受这个取舍影响。

### 五、GOP6 重编码与体积

配方沿用第十二次那条，一字未改（`-an -c:v libx264 -preset slow -crf 23 -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -profile:v high -level 4.1 -movflags +faststart`）。
新 `intro.mp4` = **3,130,069 B**（旧 3,368,867 B，小 7%），41 关键帧 / 242 帧 / `start 0.000000` / 无音轨。
`-an` 是有意的：首屏层从不发声，留着只会让 seek 多解一路。

### 六、实测（本轮全部重跑，日志在 `%TEMP%\hero2-20261012\probe\`）

- **视线弧命中 9/9**（`gaze-hero2.log`）：死区→9.582、0°→0.083、31°→0.208、90°→0.542、149°→1.333、
  180°→2.374、222°→3.375、270°→4.750、318°→夹到 0°→0.083。九个方向的合成视口截图 `probe/g2/pose-*.jpg`。
- **intro seek 延迟 p50 6.8ms / p90 9.9 / max 15.2**（旧素材记的是 5.6–23ms，同一档）。
- **连续跟随**（`settle-hero2.log`）：9 条用例 8 过 1 不达标（第七节单列）；连续甩 12 次共 19 次 seek（≤36，3.0 个/秒）；
  **指针停住后 3s 内 0 次 seek**（这条是"画面不跟着滚"的硬保证，没退）。
- **三条兜底**（`gaze2-hero2.log`）：idle 钉在 9.583 三秒不动、reduce 下移鼠标仍不 seek、触屏循环 2.4s 净前进 2.43s。
- **播进真的在放**（`turn.js`，本轮改判 右→左，起播点 1.98）：60/150/250/350ms 分别拍在 2.060/2.157/2.247/2.346，
  450ms 落在 2.3743 → 素材自己那段转头动作确实播出来了，不是两个静帧之间硬切。
- **AA 16 帧全过**（`contrast-hero2.log`）：8 个稳态姿态 + 8 个播进途中帧，`.hero` 逐字 min **10.78–11.23:1**，`<4.5:1 = 0`。
  与旧素材那批（10.7–11.1）同档 → 换素材没动到对比度预算。
- **交棒与主视频**（`functional-hero2.log`）：anchor=315、13 个滚动位最大误差 0.02s（一帧 0.042s）、上滚倒放正常。
- `eslint src/` 0 问题；`vite build --outDir dist-verify` 通过（418ms，index JS 253.60 kB / gzip 83.11 kB），
  产物里的 `intro.mp4` 字节数与仓库一致。
- 视口截图：1440×900 九姿态、1024×720、390×844（`probe/shot-*.jpg`）；窄屏是 cover 横裁 29%，脸仍完整在框内。

### 七、唯一一处不达标：判它是死区余量，不是追不上

```
右→上 平滑30步  定住偏差 7.4°  拖拽中 p50/p95/max 7.4/8.9/17.9  落点 0.5≟0.5417  ✗ 跟不上
```

`DBG=4` 的事件流给出的是：拖拽里 5 次 seek **每次都精确**落在请求的那一帧（0.1667/0.25/0.3333/0.4167/0.5），
最后一次 seek 之后指针才停手，此时目标 0.5417、画面 0.5，差 0.0417s < `GAZE_EPS = 1.5/24 = 0.0625` → 按设计不再补发。
**差一帧，不是跟不上。** 为什么旧素材不报：`GAZE_EPS` 的单位是**秒**，判据的单位是**度** ——
旧素材 45°→90° 跨 1.2s，一帧半只值 ~1.7°；新素材同一扇区只跨 0.25s，一帧半就值 7.4°。
两个可选解法都没动，理由摆在这里：
1. 把 `GAZE_EPS` 收到 1 帧以下 → 本轮 14 次 seek 全精确落位是**支持**收紧的证据，
   但样本不足以推翻第十二次那条"否则静止画面会自己抖"的实测，收紧后要重跑 settle 全套才知道会不会变成每帧重发。
2. 把 45°/90° 挪到各自姿态窗的两端（0.21 / 0.63）→ 扇区 0.25s→0.42s，偏差降到 ~4.4° 就过了，代价是稳态帧贴姿态边缘。
**要动哪个等用户先看观感**：现在的表现是手指在屏幕正上方 ±12°  cone 里挪，眼睛不动。

### 八、留给用户看的两件事

1. **正右那一档现在是张嘴惊讶**（素材第 2 帧就是它，旧素材正右是闭口的）。这一档没有别的帧可换 ——
   再往前就出片了。接受不了只能把 0° 让给空着的「右下」，那等于没有正右。
2. **`public/scrolly/index.html`（独立那页，导航 首屏/乱想/过载/落地/尾声）共用同一个 `intro.mp4`**，
   换文件等于那页的"首屏"循环也一起换了。实测该页布局、文案、时间轴都不受影响
   （那页的节奏由 `main.mp4` 决定，`shot-scrolly.jpg` 肉眼核过），但这是本轮**唯一一处超出首屏范围的影响**，记在这里。

### 九、回退路径

`public/assets/scrolly/intro.mp4` 与 `src/components/FilmStage.jsx` 本轮动手前都是**干净已入库**状态
（blob `7fd36aed`，最后由 `0528416` 提交），所以：

```
git --git-dir="D:\AI工作文件夹\self web\.githome" --work-tree="D:\AI工作文件夹\self web" checkout -- public/assets/scrolly/intro.mp4 src/components/FilmStage.jsx
```

⚠️ 这条**只对这两个文件成立**。仓库里还压着第十/十一/十三/十四轮的大量未提交改动，一律不能碰；
`FilmStage.jsx` 本轮之前是干净的（第十四轮只备份了它、没改它），所以这条 checkout 不会顺手抹掉别人的活。

### 十、中间产物（scratch，全在 `%TEMP%\hero2-20261012\`）

保留（复现口径 + 证据，实测 8.69 MB / 44 个文件 —— 我先前写「约 3 MB」是没量的估值，判读联表都是全分辨率，实际就这个数）：
`probe/` 下改好的 7 个探针（`gaze.js`/`gaze2.js`/`settle.js`/`turn.js`/`functional.js`/`contrast.js`/`facecheck.js`，
PORT 走环境变量、ARC/FRONT/FACE 已换成新表）+ 四份日志 `*-hero2.log` + `probe/g2/pose-*.jpg` 九姿态 + `probe/shot-*.jpg`，
`probe/shot.js`（本轮新写：URL/视口/指针方向 → 一张合成视口），`dense/pivot*.jpg`（脸心用的 20px 网格叠图）、
`dense/fine_{a,b,c}.jpg` 与 `dense/sheet{0,1,2}.jpg`（整帧号判读用的联表）、`mk.py`/`mk2.py`/`grid.py`
（mk.py 是通用的「带帧号标签的联表」导出器，`<src>` 走参数 —— 本轮的时间基错误来自**传进去的是源片**，
不是脚本本身，所以它本身可复用，留）。
已删：`edge-profile/`（62 MB，一次性无头实例）、`dense/d-*.jpg` 242 张散帧、`new-gop6.mp4`（与仓库那份同字节）、
`arc/` `big/` `eyes/` `face/` `ov/` `cmp/` `corners/` `keys/` `keys2/` 各中间图、`grid-*.jpg`、`showinfo.txt`、`facebox.py`（皮肤色包围盒那条死路）、`edge.log`、
`dense/fine_{c1,c2}.jpg`（`fine_c.jpg` 的上下两半，1656=828+828，留着只是重复占位）。
仓库侧的 `dist-verify/`（本轮 `vite build --outDir` 的验证产物，24 MB）也已删；`gitw status` 现 22 个 M、无 `??`，除 `intro.mp4`+`FilmStage.jsx`+本文件外都是历轮未提交改动，未回滚未提交。

## scrolly 独立页从「居中压画面」改成「左信息道」（2026-10-12 第十六次，未提交）

> 后记（2026-10-13）：**本轮已撤销**，`public/scrolly/` 三个文件回到 HEAD 那份（居中压画面 + `.caption::before` 径向暗底），见文末「第十八次」。
> 想恢复本轮：`cp r18-backup/scrolly/{index.html,scrolly.css,scrolly.js} public/scrolly/`。
> ⚠️ 退回去就意味着他报过的那个现象重新出现：改前实测那道径向暗底最亮处只有 **4.26:1**，五段文案的主体墨迹盒与文字盒重叠 100%。

### 用户这一轮要什么

原话：**「在"http://localhost:5199/scrolly/index.html" 里的所有画面都出现了字体画面挡住背后画面的现象，请你根据底板视频的画面位置将文字安排到适合的位置，让整体画面更协调」**（附首屏截图：标题整段压在低头的脸上）。

我给的两条路里选了 **「挪画面腾左栏」**：文案一律收进左侧实色信息道，影片层按段整体右移让出这一栏，
宽景不动 —— 也就是把主站第十四轮那套「不透明信息场 + 硬刀口」的语言原样搬到这一页。

### 一、根因不是遮罩不够黑

改前五段文案全部 `place-items:center` 居中，主体的墨迹盒与文字盒重叠 **100%**（五段都是），
首屏标题整段落在低头的脸上。当时底下那道径向暗底实测最亮处只有 **4.26:1**。

### 二、为什么不能"把径向暗底调淡一点"就完事

主站量过同一件事（`global.css` 同段注释）：grade 之后墙面 relLum 0.117–0.264，
纯白压上去数学上限 **3.83:1** —— 半透明遮罩加多少层都救不回来。所以这里也走实色底 + 硬刀口，
缝不做羽化。旧的 `.caption::before` 那道径向暗底整条删除。

### 三、改动清单（只动 `public/scrolly/` 三个文件）

- `scrolly.css`
  - `.layer` 盒宽从 100% 改成 `left:-6%; width:112%`，位移写 `translateX(calc(var(--dodge)/1.12))`
    —— 除 1.12 是因为 translateX 的百分比基准是盒子自身，除掉才是视口宽的比例，与主站 `DODGE` 同口径。
  - `.film` 加 `scale(1.12)`（与主站 `.film-layer--main` 同值，同一份裁切）；`.film--parallax` 1.08→1.16，
    多出的 0.04 是给 ±13px 鼠标视差留的余量，`scrolly.js` 里那串 inline `scale` 必须同值（已同步）。
  - 新增 `.field`：`inset:0 auto 0 0; width:var(--seam); background:var(--void-7)`，`index.html` 里挂在两层 scrim 之后。
  - 五段道宽表（`html[data-cap]` 喂 `.field`/`.layer`，`#cap-*` 各带一份自己的，交叉淡出时字不被移动的缝推着走；
    裸 `html` 那条是 JS 没跑的兜底）。
  - `.caption` 宽度 = `seam − pad − 24`，左对齐；`.captions` 改 `place-items:center start`。
  - 字号：`#cap-intro .headline` = `min(52px, (seam−pad−24)/max-chars)`，`.headline--act` 同式取 64px 上限。
    每段各带一个 `--max-chars`（= 该段最长行的字数），否则会出现首屏 48px 比内页 64px 还小的倒挂。
  - `.metrics` 改 2×2、`.sub`/`.meta` 撑满栏宽、`.btn-row` 去掉居中。
  - `@media (max-width:900px)`：`--dodge:0` + `.field` 全幅半透明（`rgba(2,2,2,.8)`）+ 文案回到居中，
    窄屏没有左右可分，只能整屏压暗。
- `scrolly.js`：`applyCaption()` 里加 `document.documentElement.dataset.cap = key`；inline 视差那串 scale 改 1.16。
- `index.html`：加 `<div class="field" aria-hidden="true">`。

### 四、道宽表怎么来的（口径）

`scrolly-map.js` v2：把 `video`/`img` 画进 canvas 取原生像素，×4 降采样、box-blur R=14 求局部背景，
`|gr−bg|>13` 且连续 ≥3 格算命中，**只扫视口内的列**，按 50px 行带存**区间列表**（v1 存的是"最左到最右"一条 span，
一个屏外边缘就能把整行读成满宽，那条已作废）。缝 = 位移后主体左缘 − 气口。

| 段 | `--dodge` | `--seam` | 1440 下缝 | 主体最左（并集） |
|---|---|---|---|---|
| intro | 0.122 | 33vw | 475 | 603（全片 21 档，见第七节） |
| cap-1 | 0.122 | 37vw | 533 | 408 |
| cap-2 | 0.122 | 42.5vw | 612 | 483（泼咖啡那一镜 118，见下） |
| cap-3 | 0.1 | 44vw | 634 | 533 |
| outro | 0.1 | 44vw | 634 | 533 |

**cap-2 是例外**：00:09.9–00:11.3 泼咖啡那一镜物件飞满左半屏，没有干净的一侧可收，
道宽改按版心定 —— 与主站 `.media` 同一镜、同一条处理。实拍确认（`sc/v4-1440-0.75.jpg`）：
飞出去的东西全在缝右侧，字在实色上，只是物件被刀口切掉一小条，读起来像"从板子后面掠过"。

### 五、实测

- **文字越缝**（DOM 盒右缘 − 缝，这条与像素映射无关，是硬判据）：1440 / 1280 / 1024 三档 × 五段 × 4 个滚动位，
  全部 **−23 ~ −25px**，一条都没越界。
- **AA**（`contrast.js MODE=caption`，截图像素反算相对亮度）：1440 信息场上白字 **14.56–20.75:1**
  （0.88 档 14.56–16.17，纯白标题 20.75），HUD 时间码压在影片上是 8.68–8.87:1；
  860 窄屏兜底 min **8.73:1**、390 min **12.53:1**，`<4.5:1` 计数全 0。
  ⚠️ 我在 CSS 注释里先写了「0.88 档实测 17:1 以上」，量出来是 14.56–16.17 —— 注释已按实测改过。
- **露黑边**：无（1440/1280/1024/860/390 五档截图肉眼确认；探针报的 `媒体 x 49~…` 是 `fit` 把 scale 重复计了一次，
  不是真的媒体左缘，那条判据作废）。
- `npm run lint` 干净，`npm run build` 通过（65 modules，937ms），`dist/scrolly/` 三件齐全。

### 六、探针的 x 映射整体偏左（方法账，下一轮别当准数用）

`MEASURE` 里 `r.width` 已经含元素自身 transform，又乘了一次 `sx` → scale 被计两遍，
算出的 `OX` 偏小，报回来的列位置比真实位置**偏左约 60–95px**（视口越宽偏得越多）。
后果分两头说：道宽表因此**只会偏保守**（缝留得比必要的窄），但 `切缝深度` 这条判据是拿同一套偏左的坐标算的，
所以它报的"主体跨过刀口多少像素"**不能当实测读** —— 本轮改成看截图判（1024 首屏探针报 −29px，
实拍真实左缘 ~370、缝 338，其实没越）。要留这条判据就得先修 `OX`。

### 七、intro 那一档必须单独量（而且和第十五轮共用同一个文件）

其余四段的画面位置绑 `main.mp4` 的时间轴，滚动位就是时间位，取 4 个滚动位的并集够用。
**intro 层是自由循环播放**（这一页只给它鼠标视差，没绑眼神），滚动位框不住它会出现哪些帧 ——
视线弧里「正左 1.42–3.00s」那档头是往左偏的，只看一帧会骗人。
所以按 `intro.mp4` 全片 0→10s 每 0.5s 直写一次 `currentTime` 逐档量（21 档，`TSWEEP=1 node scrolly-map.js`），
文字纵向范围内主体最左缘最坏 **603**，缝 475 → 气口 128px。
另外：第十五轮把 `public/assets/scrolly/intro.mp4` 换成了 GOP6 那份（3,130,069 B，10:37 落盘），
**这一页和首页共用它**。我 10:13 那份基线是在旧文件上量的，上面的 603 是在**新文件**上重量的，
所以这一档现在是跟着第十五轮的素材走的；他们再换首片，这张表要重跑。

### 八、留给用户看的两件事

1. **本轮没提交。** 工作区里 `public/assets/scrolly/intro.mp4` 是第十五轮改的、不是我改的，
   要不要连同这页一起入库请指定；我只准备提交 `public/scrolly/` 那三个文本文件。
2. **首屏标题比内页小**（48.9px vs 64px）。原因是物理的：首屏人头在画面正中，
   左栏只有 475px，8 字一行最多撑到 48.9px；要它不小于内页，只有三条路 ——
   把标题拆成更短的行（改文案）、首屏也走 `cap-2` 那种"道宽按版心定"（字会压到画面上）、
   或把内页字号压到 52px 对齐首屏。我按"不动文案、不压内页"做的，所以维持现状。

### 九、回退路径

本轮三个文件动手前都是**已入库**状态（`gitw ls-tree HEAD public/scrolly/` 三份齐全），回退只碰这三个：

```
git --git-dir="D:\AI工作文件夹\self web\.githome" --work-tree="D:\AI工作文件夹\self web" checkout -- public/scrolly/index.html public/scrolly/scrolly.css public/scrolly/scrolly.js
```

这条 checkout 不会碰到第十五轮的 `intro.mp4`/`FilmStage.jsx`，也不会碰到历轮那 19 个未提交文件。

### 十、中间产物（scratch，全在 `C:\Users\lzh\Documents\Qoder\2026-10-11\86bb0198\`，与第十五轮的 `%TEMP%\hero2-*` 不同目录）

新增：`scrolly-map.js`（v2，含 `TSWEEP` 模式）、`seamcheck.js`、`lane.js`、`scrolly-shot.js`、`intro-arc.js`（`TS=0,10` 直写首片时间拍带字视口）、
`who9333.ps1`/`probe-kill.ps1`；日志 `sc-baseline-v2.log`/`sc-after-1440.log`/`sc-map-1280.log`/`sc-seam-1280.log`/`sc-map-1024.log`；
图 `sc/`（20 张裸帧 + 23 张带字视口，含 `v4-1440-0.75.jpg` 泼咖啡那镜与 `arc-1024-t0/t10.jpg` 首片最坏两帧）。
已删：`edge-profile/`（一次性无头实例，**467 MB**，本轮最大的一块 —— 收尾按 `--user-data-dir` 认身份杀掉 10 个 msedge 后删掉，
删后 scratch 485 MB → 17 MB）、改字号前的 `sc/view-1440-*` 五张、指针扫拍 `sc/arc-1440-*` 五张（intro 这页不吃指针，那组无效）、
`sc-montage*.jpg`/`sc-lane*.jpg`/`sc-after.jpg` 五张联表。仓库侧无新增文件（`dist/` 已 gitignore）。

---

## 第十八次：整条时间线退回「方案 A 之前」（2026-10-12～13，未提交）

> 本节替代先前写的"退到第十四次那版"那一步 —— 那一步确实做过也测过，但随后他澄清了范围，
> 最终工作区停在**方案 A 动手之前**。三步的产物都在（见第五节备份表），任何一步都能还原。

### 一、他要的是什么，我是怎么两步走偏又走回来的

1. 15:18Z 他说「A，先按你推荐的来改」→ 第十四次（板块底板改不透明信息场）。
2. 之后他先说「我想回退到做的新方案之前」，我给出三个地点，他选「回到第十四次那版」→ 我把 11 个 CSS 退到第十四次并复测（见本节末「中间那一步」）。
3. 他紧接着澄清：**「我的意思是回退到"方案 A（推荐）"之前」** —— 不是退到 A 的结果，是退到 A 还没发生的时候。
   这一字之差把范围从"底板"扩到"A 之后的整条时间线"，也就是第十四、十五、十六、十七次全部作废。

⚠️ 教训（第三次了）：他说"回退到 X 之前"，X 是**他记得的那个名词**（"方案 A"），不是我的轮次编号。
下次先把他话里的名词映射到具体 commit/备份点，再复述一遍影响面让他确认，然后才动手。

### 二、最终回退清单（10 个文件，三个来源）

| 文件 | 回到哪 | 来源与依据 |
|---|---|---|
| `src/styles/global.css`、`src/styles/responsive.css`、`src/components/Footer.css` | 第十四次动手前 | `r14-backup/`（15:19Z A 批准后第一件事就是这份快照） |
| `src/components/FilmStage.css` | HEAD | 它与 HEAD 只差**一条注释**（第十四次改的），HEAD 那份就是 A 之前 |
| `src/components/FilmStage.jsx`、`public/assets/scrolly/intro.mp4` | HEAD | 归属查过：这两件**只有第十五次动过**（新视频那次，在另一个并行会话里），A 之后没有别人碰 |
| `public/scrolly/index.html`、`scrolly.css`、`scrolly.js` | HEAD | 第十六次「只动 public/scrolly 三个文件」；HEAD 那份实测 0 处 `.field`/`data-cap`、`.captions` 仍是 `place-items:center` + `.caption::before` 径向暗底 —— 与第十六次正文描述的"改前"逐条对得上 |

`src/components/Footer.jsx` 不用动：它本来就 == HEAD == `r14-backup` 那份。
**第十三次那 10 张 `public/assets/douyin/douyin-0*.jpg` 保留** —— 它们在 A 之前，是"退到 A 之前"这句话里不该被退掉的部分。
6 个组件 CSS（Projects/SpiralGallery/VideoRail/Media/WorkModal/AccountOperations）+ `About.css` 也不用动：
第十四次没碰它们，第十七次的改动已在中间那一步反解干净，所以现在就是 A 之前的样子。

⚠️ **`git checkout HEAD` 这次能用，上次不能用，区别要记清**：上次那 6 个组件 CSS 里存着第十/十一轮未提交的螺旋墙几何
（HEAD 的 `SpiralGallery.css` 还是"v3 暗场水波"旧几何 —— `.spiral-card` 写死 178×380 + 负 margin、没有 `.spiral-field`、
`.spiral-edge-mask` 是那条 mask-composite 死规则，而工作区的 `.jsx` 已是 InfiniteSpiral 版；`Projects.css` 与 HEAD 差 133 行、
`VideoRail.css` 差 19 行），照 HEAD 退会让照片墙直接散架；这次的 6 件（FilmStage.*、intro.mp4、scrolly/*）在 HEAD 之后只被第十五/十六次碰过，
HEAD 就是正确目标。**能不能用 HEAD 取决于"HEAD 之后还有没有别的轮次动过它"，必须先查归属再 checkout。**

### 三、归属是怎么定的（方法，下次直接复用）

`timeline.py` 扫两份会话 transcript（`~/.qoder-cn/projects/<proj>/*.jsonl`），按行号+时间戳把
**Edit/Write 的目标文件**和**Bash 命令里出现的关键词**（`FilmStage`/`scrolly`/`intro.mp4`/…）拉成一条时间线，
再叠上用户消息定位每一轮的起点。四条只有这条路能发现的点：

- 第十五次（新视频 + 视线弧重标）**不在主会话里**，在并行会话 `0a98bec4`（15:15–16:07Z）—— 只看主会话会以为 `FilmStage.jsx` 没人动过。
- `intro.mp4` 是被 Bash 里的 `cp` 换掉的，不是 Edit —— 只筛 Edit/Write 会整个漏掉这个文件。
- 第十六次对 `public/scrolly/` 三个文件的写入**两份 transcript 里都没有**（时间点落在采集空隙）。
  所以它的归属不是从 transcript 证的，是从 **HEAD 内容反证**的（见第二节那条 0 命中 + 改前特征逐条对上）。
- 机器时钟是 **UTC−5**（`diff` 头里的 `-0500`），transcript 时间戳是 Z：对文件 mtime 时要 −5h，别把轮次排错顺序。

### 四、回退后实测

- 构建 `npm run build` rc=0、147ms、`index-COdKP5pz.css` **51.09 kB**（第十四次 50.53 / 第十七次 51.71）。
- token 覆盖：组件 CSS 只引用 `--lane-w` 与 `--void-5/6/7`，A 之前的 `global.css` 里 38/48/48/46/46/43/47% 与 `--void-1…7` 全在，无悬空 `var()`。
- 1440×900 逐字复测：**对比度失败 0 条**，最差 8.56（`section-kicker` 12px）。
  仪器里 `--seam`/`--lane` 读成空、`::before` 是 `plateW=1425px z=0 absolute` —— 正确，A 之前没有"缝"这个概念，
  `::before` 是那条横贯整幅的纵向暗带；所以这一版的"墨迹越板 214 条"是仪器口径失效，不是缺陷。
- 首屏素材：dev server 回 `intro.mp4 http=200 bytes=3368867`，与 `git cat-file -s HEAD:…` 同值 → 旧素材已生效。
- 截图复核（`r15v/strength@0-bg.png`）：整幅均匀压暗、无硬边界、能力网格回到两列 —— 黑色磨砂板那一版。

**这次回退的代价，明说**：
1. **他给的新视频不再使用** —— 首屏回到旧 `intro.mp4` + 旧视线弧表（第十五次那张按新素材重标的 ARC/FRONT/FACE 表作废）。
2. **`/scrolly/index.html` 回到"五段文案居中压画面"** —— 他报过的那个现象会重新出现；
   第十六次改前实测那道径向暗底最亮处只有 **4.26:1**，标题整段落在低头的脸上（主体墨迹盒与文字盒重叠 100%，五段都是）。
3. 主站底板回到他当初点名不要的**黑色磨砂板**。
这三条都是"退到 A 之前"这句话的字面后果，不是回退出错。

### 五、中间那一步（退到第十四次，已被本节覆盖）与四份备份

中间那一步的做法值得留：5 个文件用 `r15-backup/` 快照，6 个没有快照的组件 CSS 从 transcript
**倒序把 new_string 换回 old_string** 反解出来（20/20 命中；两处坑 —— payload 带 `\r` 要按 LF 归一，
以及事后我把注释里的「第十五轮」全局改成「第十七轮」，反解时要允许这个别名）。

**四个状态全部可还原，都别删（`%TEMP%\audit-20261011\`）**：

| 目录 | 内容 |
|---|---|
| `r14-backup/` | **方案 A 之前**（= 当前工作区的主站底板三件） |
| `r15-backup/` | 第十四次结果（不透明信息场） |
| `r17-backup/` | 第十七次结果（透明白磨砂 + 统一 0.48） |
| `r18-backup/` | **第十八次动手前那一版**：第十四次底板 + 新视频（`FilmStage.jsx` + `intro.mp4` 3,130,069B）+ scrolly 信息场三件 |

要恢复"第十五次的新首屏"：`cp r18-backup/FilmStage.jsx src/components/ && cp r18-backup/scrolly/intro.mp4 public/assets/scrolly/`。
要恢复"第十六次的 scrolly 信息道"：`r18-backup/scrolly/{index.html,scrolly.css,scrolly.js}` → `public/scrolly/`。

### 六、留给用户看的

1. **本轮没提交**，`.githome` 仍停在 `39e958b`；`git status` 实测剩 **20 个 M、0 个 ??** =
   `HANDOVER.md` + 第十三次那 10 张 `douyin-0*.jpg` + 第十/十一轮的 6 个组件 CSS 与 `SpiralGallery.jsx` +
   退到 A 之后仍与 HEAD 不同的 `global.css`/`responsive.css`（这两件带着第十二轮以前的未提交改动）。
2. 历轮遗留、本轮没动：270W+ vs 280W+（`douyinWorks.js:179`、`abilityMaterials.js:8`、`experiences.js:29`）、
   VideoRail 05/09/10 共用 `c8st` 提取码、卡 11 借飞书 `mwcy`、`og-cover` 仍是暗色 1200×630、
   `index.html` 域名还是 `lizongheng.example.com`、`src/data/mediaLinks.js` 待删、fusion-pixel 字体包待删、
   `TiltCard` 待接线、1024 的 `height:80vh`、银色手机边框裁切。
3. 第十七次（白磨砂）与第十四次（信息场）两轮的可复用结论，见各自那两节正文 —— 代码已不在工作区，
   但配方、反解出的 α、帧率与级联坑都是量出来的，下次要重走直接抄。

---

### 七、A 之后那三轮留下的可复用结论（代码已退掉，数别重量）

**真磨砂的机制（第十七次）**：`--plate: rgba(236,230,222,.86)`（窄屏 α .74）必须挂在 `section::before` 这块真盒子上，
配 `backdrop-filter: blur(24px) saturate(1.08)` + 右缘 1px 白高光；内容抬到板上方靠**现成的**
`.section-rim ~ *, .footer-rim ~ * { z-index:1 }`，所以 `.section-rim` 必须是板块第一个子元素。
三条"不能做"：不能给 section 加 `isolation:isolate` 或 `z-index`（会变成 backdrop root，糊不到身后的影片）；
`background` 渐变只能染色、模糊必须挂在盒子上；"板铺满"与"内容留距"是两件事 —— 管铺满的是 `--seam`（窄屏写 `100%`），不是把 `--pad` 归零。
**帧率是白拿的**：真窗口 Edge（780M 合成 + 4050、165Hz、dpr 1.695、1440×900）blur 12/24/40px 的 p50 **全是 6.1ms**、吞吐 96–101%，与"没有板"同档。

**浅色底必须整套翻墨（第十七次）**：`--text-bright/base/dim`→`--ink-hi/--ink/--ink-dim`、`--line*`→ink 描边三档、
`--card-void*`→`--card-paper*`、`--glass-void`→`--glass-paper .92`；
必须给七个板块**自己声明 `color: var(--text-base)`**（`:root` 的 `color` 在根上就解析成白墨，继承链不再重读 token，漏一处实测 1.48:1）；
`--accent` 必须从 flare #ffc489 降到 wine **#6b1e04**（L 0.68 的暖色压在 L 0.66 的板上 = 1.02:1 等于隐形），hover #8f3a02；
两处 α 是**反解**的：`--glass-paper` .72→.92（.72 时暗卡经过其下 2.82:1）、`--ink-dim` .72→.80（窄屏板压最暗帧 4.12/4.30 不过 AA）。
**窄屏那个级联坑**：五个板块元素自己挂着 `.wrap`，`responsive.css` 在 ≤1024/≤800/≤600 重写 `.wrap` 宽，
且 `.section, .work { padding: 80px 0 }` 的短写连带清掉 `padding-inline` —— 同特异度靠打包顺序决胜，`width:100%` 整条静默失效
（实测 `boxL=14 boxW=347 pad=0px`）；唯一稳的修法是把选择器抬到 `.about.section`（0,2,0）。
`--pad` 在窄屏的 40/20/14 是抄 `responsive.css` 的留白阶梯 —— 改一处必须两处一起改，否则板和文字各走一套宽。

**「七个板块边界统一 0.48」的代价**（他当时选的就是这条，下次再统一前先看他接受不接受这个后果）：
螺旋墙那口井从 1305 收到 626，半径 ~535→~238、同屏 5 张→3 张；`.about` 最窄那块板的右侧留白少一半。

**"把板删掉"这条路是死的（第十四次的根）**：grade 之后墙面 relLum 0.117–0.264、脸部 0.386，
撤板实测 strength 说明文字 6.28–7.36 → **2.01–3.67**、media 132px 大标题 9.01 → **1.88**；
而纯白压在 L 0.224 的墙上数学上限就是 **3.83:1** → 提墨救不回来，只能改底。这是全站底板问题的硬地板，下次直接从这条起算。

**仪器四条口径（做底板必用）**：采集前先给 `.video-rail` dispatch `mouseover` 让它 `pause()`（否则两帧之间卡平移，假报 2.95:1）；
`.spiral-hint` 钉回 `opacity:.85`（否则采到淡出中间态）；越板判据要逐层求交祖先 `overflow-x != visible` 的可见右缘，
全宽容器（`.section-kicker`/`.tool-gallery-heading`）盒宽必然 = 内容列宽，只能看**墨级**；
一块板可能三屏高，按 `ceil(板高/视口高)` 切最多 4 窗，只采正中一屏报 0 失败不算数。
