/**
 * Sanity CLI 的项目配置文件（**只给 `npm run studio:*` 用，不参与站点构建**）
 *
 * 作用：让 `sanity dev / build / deploy` 能在这个仓库根目录直接跑，
 * 把 src/cms/studio.tsx 里那套 schema + 中文目录结构原样拿去打包/部署，
 * 不需要另外维护一份配置。
 *
 * 环境变量：Sanity 自己的构建器只注入 `SANITY_STUDIO_` 前缀的变量
 * （见 @sanity/cli-build 的 envPrefix），与站点用的 `VITE_SANITY_*` 不是同一套。
 * 所以这里同时兼容两套命名，优先级 SANITY_STUDIO_ > VITE_：
 *
 *   # .env.local（两种部署方式都建议写上第一组）
 *   VITE_SANITY_PROJECT_ID=xxxxxxxx
 *   SANITY_STUDIO_PROJECT_ID=xxxxxxxx     # 只有用 sanity deploy 时才需要
 *
 * projectId / dataset 本身不是机密（会出现在前台请求的 CDN 域名里），
 * 真正的机密是写入 token，它只存在于你本机的环境变量，从不进入这份配置。
 */
import { createStudioConfig } from './src/cms/studio'

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {}

export default createStudioConfig({
  projectId: env.SANITY_STUDIO_PROJECT_ID || env.VITE_SANITY_PROJECT_ID,
  dataset: env.SANITY_STUDIO_DATASET || env.VITE_SANITY_DATASET,
})
