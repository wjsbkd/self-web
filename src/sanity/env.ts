/**
 * Sanity 环境变量读取（唯一入口）
 *
 * 所有 Sanity 配置都从这里取，别处不允许直接读 import.meta.env 或 process.env，
 * 避免「同一个变量在两个地方有不同兜底值」。
 *
 * 变量清单（见 .env.example，真实值写在本机 .env.local，**不进库**）：
 *   VITE_SANITY_PROJECT_ID   必填。Sanity 项目 ID（8 位小写十六进制）
 *   VITE_SANITY_DATASET      选填，默认 production
 *   VITE_SANITY_API_VERSION  选填，默认 2024-10-01（固定值，别用 today 之类动态值）
 *
 * 这里**没有 token**，也不该加：Vite 会把所有 VITE_ 开头的变量打进前台 JS，
 * 写 token 一旦以这个前缀命名就等于公开。本项目的分工是
 * 「前台公开读 + 后台靠 Studio 登录会话写」，不需要任何 token。
 */

/** 环境变量结构（编译期确定，运行时可缺省） */
export interface SanityEnv {
  projectId: string
  dataset: string
  apiVersion: string
  /** 前台是否已配置 Sanity：projectId 为空即视为「未配置」 */
  configured: boolean
}

function read(key: string): string {
  // import.meta.env 在 Vite 构建时静态替换，没有的 key 会是 undefined。
  // 用 try 兜住非 Vite 环境（例如被 Node 直接 import 做单元测试时）。
  try {
    const env = import.meta.env as Record<string, string | undefined> | undefined
    return env?.[key] ?? ''
  } catch {
    return ''
  }
}

const projectId = read('VITE_SANITY_PROJECT_ID').trim()
const dataset = read('VITE_SANITY_DATASET').trim() || 'production'
const apiVersion = read('VITE_SANITY_API_VERSION').trim() || '2024-10-01'

export const sanityEnv: SanityEnv = {
  projectId,
  dataset,
  apiVersion,
  configured: projectId.length > 0,
}

/** 开发环境下的诊断输出：数据来源不明确时，这里是第一现场 */
export function logSanityEnv(context: string): void {
  if (sanityEnv.configured) {
    console.info(
      `[sanity:${context}] projectId=${sanityEnv.projectId} dataset=${sanityEnv.dataset} apiVersion=${sanityEnv.apiVersion}`,
    )
  } else {
    console.info(
      `[sanity:${context}] 未配置 VITE_SANITY_PROJECT_ID，将使用本地兜底数据`,
    )
  }
}
