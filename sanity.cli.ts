/**
 * Sanity CLI 项目级配置
 *
 * `sanity dev / build / deploy` 启动时要找这个文件（没有它 CLI 直接报
 * ENOENT）。作用很小：声明 projectId 与 dataset，具体 schema/界面
 * 配置在 sanity.config.ts → src/cms/studio.tsx，那边才是唯一配置源。
 */
import { defineCliConfig } from 'sanity/cli'

/**
 * 全部从环境变量读，源码里不写死 projectId（需求：「不要把 projectId、dataset、
 * token 等敏感配置硬编码在源码中」）。与 sanity.config.ts 保持同一套读取顺序。
 * Sanity CLI 会自动加载项目根的 .env.local，所以本机 `npm run studio` 照常能起来；
 * 换项目只改 .env.local，不用改代码。没配时 CLI 会提示选择项目，不会静默写到别的项目。
 */
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

export default defineCliConfig({
  api: {
    projectId: env.SANITY_STUDIO_PROJECT_ID || env.VITE_SANITY_PROJECT_ID,
    dataset: env.SANITY_STUDIO_DATASET || env.VITE_SANITY_DATASET || 'production',
  },
  /**
   * autoUpdates: false —— Studio 的运行时更新提示关掉：
   * 部署在 GitHub Pages 上，更新只发生在重新构建时，运行时提示没意义。
   */
  deployment: { autoUpdates: false },
})
