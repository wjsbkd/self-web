/**
 * Sanity CLI 项目级配置
 *
 * `sanity dev / build / deploy` 启动时要找这个文件（没有它 CLI 直接报
 * ENOENT）。作用很小：声明 projectId 与 dataset，具体 schema/界面
 * 配置在 sanity.config.ts → src/cms/studio.tsx，那边才是唯一配置源。
 */
import { defineCliConfig } from 'sanity/cli'

/**
 * 优先读环境变量；只有没配时才退回本项目的默认值。
 * projectId/dataset 不是密钥（数据集公开可读），但按需求「配置不写死」的原则，
 * 换项目时改 .env.local 就行，不用改代码。
 */
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

export default defineCliConfig({
  api: {
    projectId: env.SANITY_STUDIO_PROJECT_ID || env.VITE_SANITY_PROJECT_ID || 'ncixtjar',
    dataset: env.SANITY_STUDIO_DATASET || env.VITE_SANITY_DATASET || 'production',
  },
  /**
   * autoUpdates: false —— Studio 的运行时更新提示关掉：
   * 部署在 GitHub Pages 上，更新只发生在重新构建时，运行时提示没意义。
   */
  deployment: { autoUpdates: false },
})
