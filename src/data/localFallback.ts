/**
 * 本地兜底数据（同步、零网络）
 *
 * 两个作用：
 * 1. 没配置 Sanity / 请求失败时，网站完全按现有本地数据展示（需求第七节第 5 条）。
 * 2. **首次渲染就用它**，Sanity 数据回来后再替换 —— 这样首屏不会是空白，
 *    也不会出现「先空后满」的布局跳动（需求第七节第 7 条）。
 *
 * ⚠️ 本文件只 import 现有的 src/data/*.js，不碰 Sanity SDK，
 *    因此它和它的数据会留在主 bundle 里（很小），首屏立刻可用。
 */
import { projects as localProjects } from './projects'
import { experiences as localExperiences } from './experiences'
import { strengths as localStrengths } from './strengths'
import { tools as localTools } from './tools'
import { videos as localVideos } from './videos'
import { douyinWorks, accountIdentity as localAccountIdentity } from './douyinWorks'
import { abilityMaterials as localAbilityMaterials } from './abilityMaterials'
import {
  contactEmail as localEmail,
  contactPhone as localPhone,
  contactPhoneTel as localPhoneTel,
  contactWechat as localWechat,
  resumePdf as localResumePdf,
} from './nav'
import type {
  ProjectsPayload,
  ResumePayload,
  SiteSettingsPayload,
  ProjectDetailPayload,
} from './types'

/**
 * 本地作品 → Sanity slug 的对应表。
 *
 * 为什么需要（2026-10-26 线上实测）：
 *   详情页的 URL 是 slug 决定的（#/project/:slug），而后台里的 slug 是英文的
 *   （hupu-csgo-shanghai-major 等）。本地兜底原来只有 `local-01` 这种
 *   临时 slug，于是 **远程查询一失败，详情页连本地内容都取不到** ——
 *   访客刷新详情页看到「作品不存在」，直接违反
 *   「详情页刷新不得 404 或丢失数据」这条验收点。
 *
 *   这张表让「同一个作品」在两条数据源下用同一个 slug：
 *   远程可达 → 显示后台内容；远程超时 → 显示本地内容，URL 不用变。
 *
 * ⚠️ 这张表必须与 Sanity 里 project-01/02/03 的 slug 保持一致。
 *    换 slug 时两边一起改（后台改完，这里同步）。
 */
export const LOCAL_SLUGS: Record<string, string> = {
  '01': 'hupu-csgo-shanghai-major',
  '02': 'waytoagi-edu-spring-gala',
  '03': 'mile-spring-festival-gala',
}

/** 本地 index → slug（取不到就退回原来的 local-XX，保证不为空） */
function localSlug(index: string): string {
  return LOCAL_SLUGS[index] ?? `local-${index}`
}

/** 本地作品 → 统一结构（与 Sanity 适配后字段一致） */
export function localProjectsPayload(): ProjectsPayload {
  return {
    source: 'local',
    projects: localProjects.map((p, i) => ({
      id: p.index,
      slug: localSlug(p.index),
      title: p.title,
      year: '2026',
      index: p.index,
      subtitle: p.subtitle,
      summary: p.background ?? '',
      stat: p.stat ?? '',
      label: p.label ?? '',
      background: p.background ?? '',
      responsibility: p.responsibility ?? '',
      result: p.result ?? '',
      featured: i === 0,
      sortOrder: i,
      // 列表卡与详情页首屏用同一张图；本地数据没有视频封面
      coverType: 'image' as const,
      image: p.image,
      alt: p.title,
      poster: p.image,
      cover: { mediaType: 'image' as const, image: p.image, alt: p.title },
      category: null,
    })),
  }
}

/**
 * 本地单个作品详情。
 *
 * 同时接受两种 slug：后台用的英文 slug（hupu-csgo-shanghai-major）
 * 和历史遗留的 local-XX —— 老的收藏链接不该因此失效。
 */
export function localProjectDetail(slug: string): ProjectDetailPayload {
  const local = localProjects.find((p) => {
    const canonical = localSlug(p.index)
    return slug === canonical || slug === `local-${p.index}`
  })
  if (!local) return null
  return {
    id: local.index,
    slug: localSlug(local.index),
    title: local.title,
    year: '2026',
    index: local.index,
    subtitle: local.subtitle,
    summary: local.background ?? '',
    stat: local.stat ?? '',
    label: local.label ?? '',
    background: local.background ?? '',
    responsibility: local.responsibility ?? '',
    result: local.result ?? '',
    featured: false,
    sortOrder: Number(local.index),
    coverType: 'image',
    image: local.image,
    alt: local.title,
    poster: local.image,
    cover: { mediaType: 'image', image: local.image, alt: local.title },
    // 本地数据没有富文本与媒体模块：详情页会用 summary 铺文案
    description: null,
    media: [],
    category: null,
    createdAt: undefined,
    updatedAt: undefined,
  }
}

/** 本地作品 slug 列表（与后台一致，详情页存在性预检用） */
export function localProjectSlugs(): string[] {
  return localProjects.map((p) => localSlug(p.index))
}

/** 本地履历 */
export function localResumePayload(): ResumePayload {
  return {
    source: 'local',
    experiences: localExperiences.map((e) => ({
      period: e.period,
      company: e.company,
      role: e.role,
      tags: e.tags,
      points: e.points.map((p) => ({ label: p.label, text: p.text })),
    })),
    profile: {
      name: '李纵横',
      role: 'AI 内容运营与视觉创作者',
      email: localEmail,
      phone: localPhone,
      phoneTel: localPhoneTel,
      wechat: localWechat,
      social: [
        { platform: '邮箱', url: `mailto:${localEmail}` },
        { platform: '抖音', url: 'https://v.douyin.com/k8afilJ0GOk/' },
        { platform: '简历', url: localResumePdf },
      ],
      resumeFile: localResumePdf,
    },
    // 本地没有这四类结构化数据，返回空数组（组件不渲染空列表即可）
    education: [],
    awards: [],
    exhibitions: [],
    services: [],
    skills: [],
    clients: [],
  }
}

/** 本地全局设置 */
export function localSitePayload(): SiteSettingsPayload {
  return {
    source: 'local',
    siteName: '李纵横 · 个人作品集',
    seo: {
      // 与 Footer.jsx 改版前的硬编码一致：没接 Sanity 时页面文案不变。
      footerText: '© 2026 LIZONGHENG',
      contact: {
        email: localEmail,
        phone: localPhone,
        phoneTel: localPhoneTel,
        wechat: localWechat,
      },
      social: [
        { platform: '邮箱', url: `mailto:${localEmail}` },
        { platform: '抖音', url: 'https://v.douyin.com/k8afilJ0GOk/' },
        { platform: '简历', url: localResumePdf },
      ],
    },
  }
}

/* ── 未接 Sanity 的既有数据：保持本地，统一从这里导出 ── */

export const getVideos = () => localVideos
export const getDouyinWorks = () => douyinWorks
export const getAccountIdentity = () => localAccountIdentity
export const getAbilityMaterials = () => localAbilityMaterials
export const getStrengths = () => localStrengths
export const getTools = () => localTools
