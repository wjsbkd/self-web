/**
 * 履历 adapter —— Sanity 原始 → Experience.jsx / About.jsx 现有结构
 *
 * 现有结构：
 *   experiences: [{ period, company, role, tags:[], points:[{label, text}] }]
 *   nav.js: contactEmail / contactPhone / contactWechat / resumePdf
 *
 * adapter 把 Sanity 的 startDate/endDate/current 拼成 period 字符串，
 * points 直接用（结构本就一致），并额外暴露 profile 给 About.jsx。
 */
import type {
  SanityResume,
  SanityExperienceItem,
  SanityEducationItem,
  SanitySocial,
} from '../types'
import { buildImageUrl } from './imageUrl'

/** Experience.jsx 现有结构 */
export interface FrontendExperience {
  period: string
  company: string
  role: string
  tags: string[]
  points: { label: string; text: string }[]
}

/** 个人资料（供 About.jsx / 全局 contact 用） */
export interface FrontendProfile {
  name: string
  role: string
  avatar?: string
  bio?: string
  location?: string
  email?: string
  phone?: string
  phoneTel?: string
  wechat?: string
  social: SanitySocial[]
  resumeFile?: string
}

/** 通用列表项（履历里 7 类列表都长这样） */
export interface FrontendListItem {
  _key?: string
  title: string
  subtitle?: string
  description?: string
  sortOrder: number
}

/** 教育项（带专业等额外字段） */
export interface FrontendEducation extends FrontendListItem {
  school: string
  degree?: string
  major?: string
}

/** 技能标签项 */
export interface FrontendSkill extends FrontendListItem {
  name: string
  level?: string
}

/** 合作品牌项 */
export interface FrontendClient extends FrontendListItem {
  name: string
  logo?: string
  url?: string
  note?: string
}

/** 适配工作经历 → Experience.jsx 结构 */
export function adaptExperiences(items: SanityExperienceItem[] | undefined): FrontendExperience[] {
  if (!items) return []
  return items.map((item) => ({
    period: item.current ? `${item.startDate} — 至今` : `${item.startDate} — ${item.endDate ?? ''}`,
    company: item.company,
    role: item.role,
    tags: item.tags ?? [],
    points: (item.points ?? []).map((p) => ({ label: p.label ?? '', text: p.text })),
  }))
}

/** 适配个人资料 */
export function adaptProfile(resume: SanityResume | null | undefined): FrontendProfile | null {
  if (!resume) return null
  return {
    name: resume.name,
    role: resume.role,
    avatar: buildImageUrl(resume.avatar),
    bio: resume.bio,
    location: resume.location,
    email: resume.email,
    phone: resume.phone,
    phoneTel: resume.phoneTel,
    wechat: resume.wechat ?? resume.social?.find((s) => s.platform.includes('微信'))?.note,
    social: resume.social ?? [],
    resumeFile: resume.resumeFile?.url,
  }
}

/** 适配教育经历 */
export function adaptEducation(items: SanityEducationItem[] | undefined): FrontendEducation[] {
  if (!items) return []
  return items.map((item) => ({
    _key: item._key,
    title: item.school,
    school: item.school,
    degree: item.degree,
    major: item.major,
    subtitle: [item.degree, item.major].filter(Boolean).join(' · '),
    description: item.description,
    sortOrder: item.sortOrder,
  }))
}

/** 适配获奖 / 展览 / 服务（结构统一，用 title+subtitle+desc） */
export function adaptGeneric(
  items: { _key?: string; title: string; issuer?: string; role?: string; location?: string; description?: string; sortOrder: number }[] | undefined,
): FrontendListItem[] {
  if (!items) return []
  return items.map((item) => ({
    _key: item._key,
    title: item.title,
    subtitle: item.issuer ?? item.role ?? item.location ?? '',
    description: item.description,
    sortOrder: item.sortOrder,
  }))
}

/** 适配技能标签 */
export function adaptSkills(
  items: { _key?: string; name: string; level?: string; sortOrder: number }[] | undefined,
): FrontendSkill[] {
  if (!items) return []
  return items.map((item) => ({
    _key: item._key,
    name: item.name,
    level: item.level,
    title: item.name,
    subtitle: item.level,
    sortOrder: item.sortOrder,
  }))
}

/** 适配合作品牌 */
export function adaptClients(
  items: { _key?: string; name: string; logo?: { url?: string } | null; url?: string; note?: string; sortOrder: number }[] | undefined,
): FrontendClient[] {
  if (!items) return []
  return items.map((item) => ({
    _key: item._key,
    name: item.name,
    logo: buildImageUrl(item.logo),
    url: item.url,
    note: item.note,
    title: item.name,
    subtitle: item.note,
    sortOrder: item.sortOrder,
  }))
}
