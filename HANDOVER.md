# self web · 项目交接说明（HANDOVER）

> 生成：2026-09-23 · 由 Codex 汇总本项目历史对话后生成
> 更新：2026-09-26 · Qoder 完成 git 治理（大文件排除 + 6 次分批提交），并修正本文档中过期的配色与站点结构描述
> 用途：本项目的历史对话已归档清理（详见 `D:\AI工作文件夹\全局工作台\Codex执行记录\工具维护-三项目对话归档清理-20260923.md`）。本文档保存关键结论，供后续接手的对话快速了解项目情况。

## 项目是什么

个人作品集网站（求职用），React 19 + Vite 8。用明亮但不冰冷的"羊皮纸"编辑式视觉呈现简历与项目经历，面向内容 / 运营岗求职（详见 AI工作文件夹 HANDOVER 中的求职诊断结论）。

- 项目路径：`D:\AI工作文件夹\self web`
- 站点结构（`src/App.jsx` 实际滚动顺序）：Hero（首屏，含自转地球）→ About（关于）→ Strengths（能力与优势）→ Experience（经历）→ Projects（精选项目）→ Media（作品 / 视频轨道）→ AccountOperations（账号运营，螺旋照片墙）→ Footer
- 版心约 1700px，PC 优先展示；移动端有抽屉导航与响应式降级。

## 技术栈与结构

| 项 | 内容 |
|---|---|
| 框架 | React 19 + Vite 8 |
| 规范 | ESLint 9 + Prettier（`npm run lint` / `npm run format`），当前 0 error |
| 组件 | `src/components/`：Nav、Hero、HeroGlobe、About、Experience、Projects、Strengths、Media、VideoRail、AccountOperations、SpiralGallery、WorkModal、Footer、SectionHeading、SectionDots、CountUp、CursorGlow、Magnetic、Reveal、TiltCard、Arrow、ErrorBoundary |
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

## 本轮修复清单（2026-10-09，动效排查）

对全站动效做了一次排查（读码 + dev server 实测），修掉 4 个真实缺陷 + 3 处性能/手感问题。`npx eslint src/` 0 error，`npm run build` 通过。
