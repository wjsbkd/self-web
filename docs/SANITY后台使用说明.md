# Sanity 内容管理后台 — 部署与配置说明

本文件对应需求第八、十节：后台使用说明 + 部署配置说明。

---

## 一、架构总览

```
前台（index.html）           后台（admin.html）
┌─────────────────┐          ┌─────────────────┐
│ React 19 SPA     │          │ Sanity Studio   │
│ 仅读 published   │          │ 用户登录后读写   │
│ 无 token         │          │ 用 session       │
└────────┬────────┘          └────────┬────────┘
         │ GET (CDN)                   │ 写：publish/draft
         ▼                             ▼
   ┌─────────────────────────────────────────┐
   │            Sanity 项目（云端）            │
   │  dataset: production                     │
   │  perspective: published（前台）           │
   │  perspective: previewDrafts（后台预览）   │
   └─────────────────────────────────────────┘
```

- **前台**：只通过 Sanity CDN 读已发布内容，**不持有 token**，即使源码泄漏也无法写入。
- **后台**：访问 `/admin`，浏览器跳 Sanity 登录，登录后按用户权限读写。
- **草稿**：只有 status=published 的作品出现在正式网站；草稿仅后台与预览可见。

---

## 二、首次配置 Sanity（一次性）

1. 注册并新建项目：<https://www.sanity.io/manage>
   - 拿到 `projectId`（8 位十六进制，如 `a1b2c3d4`）。
2. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```
   填入：
   ```
   VITE_SANITY_PROJECT_ID=a1b2c3d4
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-10-01
   ```
3. **配置 CORS**（关键，否则前台读不到数据）：
   - Sanity 后台 → API → CORS origins → Add
   - Origin 填你的站点域名（如 `https://wjsbkd.github.io`），勾选 **Allow credentials**（草稿预览用）。
   - 本地开发加 `http://localhost:5173`。
4. **不需要建 token**：Studio 用你的登录会话读写，前台只做公开读。整个项目里没有任何地方需要写 token（这也是安全红线的来源，见第六节）。
5. **部署 Studio**：见第三节。
6. **把现有内容迁进 Sanity（可选，一次性）**：作品已经在库里了；履历与全局设置可以用脚本灌进去，免去手填。建一个 **Editor** 权限的临时 token（manage → API → Tokens），然后：
   ```bash
   # 先看会写什么（不联网）：
   node scripts/seed-sanity.mjs --dry-run
   # 真实写入：
   SANITY_WRITE_TOKEN=xxx node scripts/seed-sanity.mjs
   ```
   脚本读 `src/data/experiences.js` 与 `src/data/nav.js`，与前台本地兜底同源，幂等可重跑。跑完把 token 删掉——平时用不到。

> 没配置 projectId 时，前台自动用本地数据（`src/data/*.js`）兜底，网站照常展示，不影响开发。

---

## 三、后台部署：两种方式有什么区别

后台是 `admin.html` 这个独立入口（Vite 多入口），与 `index.html` 互不影响。
两种方式用的是**同一份配置**（`src/cms/studio.tsx`），schema、中文目录、单例文档完全一样，
区别只在「这份 Studio 被打包到哪里、谁来做登录和 CDN」。

| | 方式 A：随站点部署（`/admin`） | 方式 B：Sanity 托管（`sanity deploy`） |
|---|---|---|
| 访问地址 | `https://wjsbkd.github.io/admin` | `https://<你的名字>.sanity.studio` |
| 谁在托管 | GitHub Pages / Cloudflare Pages | Sanity 自己的 CDN |
| 怎么发布 | `git push` → GitHub Actions（已经配好，无需额外操作） | 改完后台代码后手动跑一次 `npm run studio:deploy` |
| 登录 | Sanity 账号登录（Studio 内弹窗） | 同左，且**只允许该项目成员**进入 |
| 站点包体积 | 每次部署会多推 ≈8MB Studio 静态文件到 `wjsbkd.github.io` 仓库 | 站点仓库保持轻量；用 `npm run build:site` 打包也只有前台 |
| 域名/证书 | 跟主站同一个域名，天然有 HTTPS | Sanity 提供 HTTPS，第一次部署要起一个全局唯一的子域名 |
| CORS | 需要在 Sanity 后台把主站域名加进 CORS origins | 不需要（同源） |
| 更新后台界面代码 | 跟着站点一起部署 | 要重新 `studio:deploy` 才生效 |
| 国内访问 | 跟主站一样（GitHub Pages，实测比 Cloudflare 快） | 走 sanity.io 的 CDN，国内速度不稳定，**可能需要梯子** |
| 断网/被墙时 | 站点照常，后台打不开 | 同左（后台在另一个域名） |

**建议**：日常用 **方式 A**（已经随现有部署链路自动生效，访问 `/admin` 即可，不额外维护一个地址）。
只有当你想把后台完全从站点仓库里摘出去、或者要给非技术同事一个更干净的入口时，才切到方式 B —— 切过去以后
把 `deploy.yml` 里的 `npm run build` 换成 `npm run build:site`，站点仓库就再也不用背 Studio 的体积。

### 方式 A：随站点部署（默认，已生效）

`npm run build` 会同时产出两个入口：

- `dist/index.html` → 前台
- `dist/admin.html` + `dist/admin/index.html` → 后台

`dist/admin/index.html` 是构建时自动复制的一份（`vite.config.js` 的 `emitAdminIndex` 插件），
这样 `/admin`、`/admin/`、`/admin.html` 三种写法在两个托管平台上都能打开 ——
GitHub Pages 和 Cloudflare Pages 都只对「目录」提供默认首页，没有这一步 `/admin` 会 404。

推送到 `master` 后 GitHub Actions 自动部署，不需要任何额外命令。

### 方式 B：Sanity 托管

```bash
# 一次性：把 SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET 也写进 .env.local
#        （Sanity 自己的构建器只认这个前缀，值跟 VITE_ 那两个一样）
npm run studio:deploy
```

第一次会交互式问一个 studio 子域名（如 `lizongheng`），之后每次 `npm run studio:deploy` 覆盖更新。
配置来自仓库根目录的 `sanity.config.ts`（它把 `src/cms/studio.tsx` 原样交给 Sanity CLI，配置只有一份）。

### 方式 C：本地运行后台（开发/改 schema 时用）

```bash
npm run studio    # http://localhost:3333，热更新，改 schema 立刻看到效果
npm run dev       # 同时开前台 http://localhost:5173
```

> 三种方式可以同时存在，互不冲突：它们读的是同一个 Sanity 数据集，
> 后台改完内容，前台（A/B/C 任一）刷新即可看到。

---

## 四、后台操作速查（中文界面）

登录 `/admin` 后：

| 模块 | 用途 | 常用操作 |
|---|---|---|
| **网站全局设置** | 站点名称 / SEO / 分享封面 / 页脚 / 联系方式 / 社交链接 / 背景音乐 | 单例，直接编辑保存 |
| **个人履历** | 个人资料 + 7 类列表（工作/教育/获奖/展览/服务/技能/客户） | 列表内增删改、拖拽排序、`status` 切换草稿/发布 |
| **作品** | 核心内容管理 | 新增/编辑/复制/删除；封面支持**图片或视频**二选一；详情页媒体模块可拖拽排序 |
| **分类** | 作品分类 | 新增分类，作品里选引用 |

### 关键字段说明

- **唯一地址（slug）**：详情页网址一部分。留空按标题自动生成，**全站唯一**（重名会被拦下）。
- **发布状态**：只有「已发布」进正式网站；「草稿」仅后台和预览可见。
- **展示顺序（sortOrder）**：数字越小越靠前。列表视图按此排序，改数字即可调序（也支持拖拽）。
- **是否精选**：前台详情页/列表给予突出位置。
- **封面媒体**：选「图片」→ 传图 + alt；选「视频」→ 传文件或填外链 + poster + 自动播放/循环/静音开关。

### 草稿预览

Studio 自带「草稿 / 已发布」视角切换：登录后在文档里看到的就是最新草稿（含未发布的修改），
点右上角 **Publish** 才会进入正式网站。前台永远只查 `status == "published"`，
所以**草稿不可能出现在正式网站上**——这是查询层保证的，不依赖谁记不记得点按钮。

---

## 五、前台实时更新策略（需求第七节）

本项目是 SPA + 静态托管，**无法用 Sanity Live Content API**（需服务端 SSE 长连接）。采用兼容方案：

- 后台 publish 后，前台在**标签页重新获得焦点 / 可见**时静默重新查询（`registerLiveRefresh`）。
- 内存缓存 30s，避免频繁请求。
- 已发布内容立即出现在前台，无需改代码或重新构建。

> 若未来迁到有服务端渲染的框架（Next.js 等），可平滑切换到 Live Content API。

---

## 六、安全红线（需求第九节）

1. **项目里根本没有写 token**：前台只做公开读（无 token），后台靠 Studio 的登录会话读写。
   需要预览未发布内容时才在 Studio 内看，token 从不进入任何 bundle。
2. 后台必须登录，未登录看不到内容编辑功能。
3. 上传限制：Sanity 免费档资产额度 5GB / 250 个，大视频优先用外链（百度网盘）而非上传。
4. 背景音乐**不自动播放**：浏览器禁止未授权有声播放；用户点开才响，偏好存 localStorage。
5. 外部链接 / 富文本链接强制 `target="_blank" rel="noreferrer noopener"`。

---

## 七、破坏面排查（确认未动的东西）

本次接入**没有改动**：
- 任何现有 CSS（`global.css` 及组件 CSS 的原生动效语言、配色、响应式断点）。
- 现有动画组件：`FilmStage` / `SpiralGallery` / `VideoRail` / `AbilityFolder` / `CursorGlow` / `Magnetic` / `Reveal`。
- 本地数据兜底文件 `src/data/*.js` 全部保留，作为 Sanity 未配置/失败时的回退。

本次接入**新建**：`src/sanity/**`（schema / GROQ / 类型 / 适配器）、`src/cms/**`（Studio 配置）、
`src/data/` 下的 `sanityData.ts`（统一入口）、`sanityRemote.ts`（动态加载的远程查询）、
`localFallback.ts`（本地兜底）、`cache.ts`、`types.ts`、`hooks.ts`、
`src/components/ProjectDetail.*`、`src/components/BackgroundMusic.*`、
`admin.html`、`sanity.config.ts`、`.env.example`。

**关于体积**（实测 `dist/`）：
- 首屏 JS 343.6KB / gzip 117KB，接入前 319.6KB / gzip 110KB —— 多出的 ~24KB 是 Portable Text 渲染与数据层，
  **Sanity SDK 不在首屏路径上**（`@sanity/client` 只在 `sanityRemote` 这个动态 chunk 里，配置了 projectId 才会下载）。
- Studio 的 8MB 只存在于后台入口，前台 HTML 不引用它。
- 用 `npm run build:site` 打包时产物里完全没有后台文件。

本地兜底状态下，网站与接入前的视觉、动画、移动端布局完全一致。
