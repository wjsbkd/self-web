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
- **部署前必须替换 `index.html` 占位**：`canonical` 与 `og:url` 仍是 `https://lizongheng.example.com/`，`og:image` / `twitter:image` 指向一张 Unsplash 外链，需换成正式域名与自建 1200×630 封面图，否则微信 / 朋友圈分享卡片是错的。
- 若继续改视觉，先读 `src/styles/global.css` 的 Design Token，避免散落硬编码颜色。
- 可选优化：`public/assets/hero/earth-texture.png`（1.9MB）可转 WebP 或压缩，首屏体量主要压在这一张上。
