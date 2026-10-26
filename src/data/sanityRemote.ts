/**
 * Sanity 远程查询（**动态加载的独立 chunk**）
 *
 * 为什么单独成文件：这里静态 import 了 @sanity/client / @sanity/image-url /
 * adapters，合计约 250KB（gzip 约 80KB）。如果它被主 bundle 静态引用，
 * 首屏 JS 会从 319KB 涨到 ~520KB —— 这个项目的首屏性能是一路量化优化过来的
 * （见 HANDOVER 第九十三次），不能为了后台把前台拖慢。
 *
 * 所以：只有 `sanityEnv.configured` 为真时，sanityData.ts 才会
 * `await import('./sanityRemote')`；没配 Sanity 的访客根本不会下载这个 chunk。
 * 而且调用发生在 useEffect（首帧之后），不阻塞 FCP。
 */
import { publishedClient } from '../sanity/client'
import { initImageBuilder } from '../sanity/adapters/imageUrl'
import {
  projectsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
} from '../sanity/queries/projects'
import { resumeQuery } from '../sanity/queries/resume'
import { siteSettingsQuery } from '../sanity/queries/siteSettings'
import { adaptProject, adaptProjectDetail } from '../sanity/adapters/project'
import {
  adaptExperiences,
  adaptProfile,
  adaptEducation,
  adaptGeneric,
  adaptSkills,
  adaptClients,
} from '../sanity/adapters/resume'
import { adaptSiteSettings } from '../sanity/adapters/site'
import type {
  SanityProject,
  SanityProjectDetail,
  SanityResume,
  SanitySiteSettings,
} from '../sanity/types'
import type {
  ProjectsPayload,
  ResumePayload,
  SiteSettingsPayload,
  ProjectDetailPayload,
} from './types'

/** 单次请求超时：超过就当网络失败，回退本地 */
const FETCH_TIMEOUT = 3000

// 图片 URL builder 需要在任何 adapter 调用前初始化（模块加载即执行，幂等）
initImageBuilder(publishedClient)

/** 带超时的 GROQ 查询；失败抛错，由上层决定是否回退 */
async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  try {
    return (await publishedClient.fetch(groq, params, { signal: controller.signal })) as T
  } finally {
    clearTimeout(timer)
  }
}

/** 作品列表 */
export async function fetchProjects(): Promise<ProjectsPayload> {
  const raw = await query<SanityProject[]>(projectsQuery)
  // 传下标：概览卡左上角的 01/02/03 按展示顺序生成
  return { projects: raw.map((p, i) => adaptProject(p, i)), source: 'sanity' }
}

/** 单个作品详情；未发布 / 不存在返回 null */
export async function fetchProjectBySlug(slug: string): Promise<ProjectDetailPayload> {
  const raw = await query<SanityProjectDetail | null>(projectBySlugQuery, { slug })
  return raw ? adaptProjectDetail(raw) : null
}

/** 已发布 slug 列表 */
export async function fetchProjectSlugs(): Promise<string[]> {
  const raw = await query<{ slug: string }[]>(projectSlugsQuery)
  return raw.map((r) => r.slug)
}

/** 履历 */
export async function fetchResume(): Promise<ResumePayload> {
  const raw = await query<SanityResume | null>(resumeQuery)
  if (!raw) throw new Error('resume 单例不存在')

  /**
   * 兜底：文档存在、但一条已发布工作经历都没有 → 当作「后台还没填履历」，
   * 抛错走本地数据。否则一旦有人在后台点开「个人履历」随手发布一个空壳，
   * 前台经历区会整块消失（那里没有"暂无内容"的空状态）。
   */
  const experiences = adaptExperiences(raw.experience)
  if (experiences.length === 0) {
    throw new Error('resume 已发布的工作经历为空，回退本地数据')
  }

  return {
    experiences,
    profile: adaptProfile(raw),
    education: adaptEducation(raw.education),
    awards: adaptGeneric(raw.awards),
    exhibitions: adaptGeneric(raw.exhibitions),
    services: adaptGeneric(raw.services),
    skills: adaptSkills(raw.skills),
    clients: adaptClients(raw.clients),
    source: 'sanity',
  }
}

/** 全局设置 */
export async function fetchSiteSettings(): Promise<SiteSettingsPayload> {
  const raw = await query<SanitySiteSettings | null>(siteSettingsQuery)
  if (!raw) throw new Error('siteSettings 单例不存在')
  const adapted = adaptSiteSettings(raw)
  return {
    siteName: adapted.siteName,
    intro: adapted.intro,
    seo: adapted,
    source: 'sanity',
  }
}
