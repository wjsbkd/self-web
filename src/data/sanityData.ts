/**
 * 统一数据查询层（前台唯一的数据入口）
 *
 * 需求第七节的「统一接口」落地：
 *   getProjects() / getProjectBySlug() / getResume() / getSiteSettings()
 *
 * 三层结构（性能 + 兜底是同一个决定）：
 *
 *   本地兜底（localFallback.ts，同步、零网络）
 *        ↑ 首次渲染立刻用它，页面绝不空白
 *   远程 Sanity（sanityRemote.ts，**动态 import**）
 *        ↑ 配置了 projectId 才下载这个 chunk；失败/超时自动留在本地数据
 *
 * 约定：
 * - 每个 getXxx() 都返回带 `source: 'sanity' | 'local'` 的 payload，
 *   开发环境可以显示数据来源做诊断。
 * - 任何远程异常都被吞掉（不向页面抛错），只在 DEV 打一条 warn。
 * - 前台只读 published：publishedClient 的 perspective 固定是 'published'，
 *   草稿永远不会出现在正式网站。
 */
import { sanityEnv } from '../sanity/env'
import {
  localProjectsPayload,
  localProjectDetail,
  localProjectSlugs,
  localResumePayload,
  localSitePayload,
} from './localFallback'
import type {
  ProjectsPayload,
  ResumePayload,
  SiteSettingsPayload,
  ProjectDetailPayload,
} from './types'

/** 是否有可用远程源 */
export const hasRemoteSource = sanityEnv.configured

/**
 * 按需加载远程模块。
 * - 未配置 Sanity：返回 null，调用方直接用本地数据（不下载 chunk）
 * - 配置了：动态 import（首帧之后才发生，不阻塞 FCP）
 */
async function loadRemote() {
  if (!sanityEnv.configured) return null
  try {
    return await import('./sanityRemote')
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[sanity] 远程模块加载失败，使用本地数据：', err)
    }
    return null
  }
}

/** 远程模块的静态类型（去掉 null，方便在回调里直接用） */
type RemoteModule = NonNullable<Awaited<ReturnType<typeof loadRemote>>>

/** 统一的「远程优先，失败留本地」执行器 */
async function remoteFirst<T>(
  key: string,
  remote: (m: RemoteModule) => Promise<T>,
  local: () => T,
): Promise<T> {
  const m = await loadRemote()
  if (!m) return local()
  try {
    return await remote(m)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[sanity] ${key} 查询失败，使用本地数据：`, err)
    }
    return local()
  }
}

/* ───────────────────────── 作品 ───────────────────────── */

/** 作品列表（远程优先，失败回退本地） */
export function getProjects(): Promise<ProjectsPayload> {
  return remoteFirst('getProjects', (m) => m.fetchProjects(), localProjectsPayload)
}

/** 单作品详情；远程查不到时再看本地 slug（返回 null 表示确实不存在） */
export function getProjectBySlug(slug: string): Promise<ProjectDetailPayload> {
  return remoteFirst(
    'getProjectBySlug',
    async (m) => {
      const remote = await m.fetchProjectBySlug(slug)
      // 远程没找到：如果本地有同 slug（例如 local-01）就用本地，否则 null
      return remote ?? localProjectDetail(slug)
    },
    () => localProjectDetail(slug),
  )
}

/** 已发布 slug 列表（详情页存在性预检用） */
export function getPublishedSlugs(): Promise<string[]> {
  return remoteFirst('getPublishedSlugs', (m) => m.fetchProjectSlugs(), localProjectSlugs)
}

/* ───────────────────────── 履历 ───────────────────────── */

export function getResume(): Promise<ResumePayload> {
  return remoteFirst('getResume', (m) => m.fetchResume(), localResumePayload)
}

/* ───────────────────────── 全局设置 ───────────────────────── */

export function getSiteSettings(): Promise<SiteSettingsPayload> {
  return remoteFirst('getSiteSettings', (m) => m.fetchSiteSettings(), localSitePayload)
}

/* ───────────────────────── 首帧用的同步本地数据 ───────────────────────── */

export {
  localProjectsPayload,
  localProjectDetail,
  localProjectSlugs,
  localResumePayload,
  localSitePayload,
}

/* ───────────────────────── 未接 Sanity 的既有数据 ───────────────────────── */

export {
  getVideos,
  getDouyinWorks,
  getAccountIdentity,
  getAbilityMaterials,
  getStrengths,
  getTools,
} from './localFallback'

/* ───────────────────────── 缓存 / 实时刷新 ───────────────────────── */

export {
  CACHE_TTL,
  getCached,
  setCached,
  deleteCache,
  DATA_REFRESH_EVENT,
  triggerDataRefresh,
  registerLiveRefresh,
} from './cache'
