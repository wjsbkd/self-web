/**
 * Sanity 数据类型定义
 *
 * 这里定义的是 **GROQ 查询返回的原始结构**（经过 queries/ 的投影，不是原始 document）。
 * adapters/ 会把它转成页面组件使用的结构（见 types.ts 的 Frontend* 系列）。
 *
 * 为什么分两层：Sanity 的 asset 是 `{_id, _ref, _type}` 引用，
 * 查询里解引用后变成 `{id, url, width, height, hotspot, blurDataURL, alt}`。
 * 页面组件不该知道这些细节，只该看到统一的 MediaRef。
 */

/** 解引用后的图片资源（queries 里的 IMAGE_FIELDS 投影结果） */
export interface SanityImage {
  id?: string
  url?: string
  width?: number
  height?: number
  /** Sanity hotspot：{x, y, width, height}，用于裁切与焦点 */
  hotspot?: { x: number; y: number; width: number; height: number } | null
  /** Sanity 自动生成的极小占位图（base64 data URI） */
  blurDataURL?: string
  alt?: string
}

/** 解引用后的文件资源 */
export interface SanityFile {
  url?: string
  size?: number
  originalFilename?: string
}

/** 社交链接 */
export interface SanitySocial {
  _key?: string
  platform: string
  url: string
  note?: string
}

/** 媒体封面（原始） */
export interface SanityMediaCover {
  mediaType: 'image' | 'video'
  image?: SanityImage | null
  videoFile?: SanityFile | null
  videoUrl?: string | null
  poster?: SanityImage | null
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

/** 详情页媒体模块（原始） */
export interface SanityMediaModule {
  moduleType: 'image' | 'gallery' | 'video' | 'imageText'
  image?: SanityImage | null
  alt?: string
  caption?: string
  gallery?: SanityImage[] | null
  videoFile?: SanityFile | null
  videoUrl?: string | null
  poster?: SanityImage | null
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  imageTextTitle?: string
  imageTextBody?: string
}

/** 富文本 block（Portable Text）—— 这里用宽松类型，交给 @portabletext/react 渲染 */
export type SanityBlock = Record<string, unknown>

/** 作品分类（原始） */
export interface SanityCategory {
  id: string
  title: string
  slug: string
}

/** 作品列表项（原始，对应 projectsQuery） */
export interface SanityProject {
  id: string
  title: string
  slug: string
  year: string
  summary: string
  /** 概览卡右上角的小字（角色/类型），留空回落到分类名 */
  subtitle?: string
  /** 概览卡右下角的数据亮点（可选） */
  stat?: string
  /** 数据亮点的说明文字（可选） */
  label?: string
  /** 首页详情面板：项目背景 / 我的职责 / 项目成果（可选，缺省时回落到 summary / 不显示） */
  background?: string
  responsibility?: string
  result?: string
  featured: boolean
  sortOrder: number
  cover: SanityMediaCover
  category: SanityCategory | null
}

/** 作品详情（原始，对应 projectBySlugQuery） */
export interface SanityProjectDetail extends SanityProject {
  description?: SanityBlock[] | null
  media?: SanityMediaModule[] | null
  createdAt?: string
  updatedAt?: string
}

/* ── 履历原始结构 ── */

export interface SanityExperiencePoint {
  _key?: string
  label?: string
  text: string
}

export interface SanityExperienceItem {
  _key?: string
  company: string
  role: string
  startDate: string
  endDate?: string
  current?: boolean
  description?: string
  points?: SanityExperiencePoint[]
  tags?: string[]
  sortOrder: number
}

export interface SanityEducationItem {
  _key?: string
  school: string
  degree?: string
  major?: string
  startDate?: string
  endDate?: string
  description?: string
  sortOrder: number
}

export interface SanityAwardItem {
  _key?: string
  title: string
  issuer?: string
  date?: string
  description?: string
  sortOrder: number
}

export interface SanityExhibitionItem {
  _key?: string
  title: string
  role?: string
  location?: string
  date?: string
  description?: string
  sortOrder: number
}

export interface SanityServiceItem {
  _key?: string
  title: string
  description?: string
  sortOrder: number
}

export interface SanitySkillItem {
  _key?: string
  name: string
  level?: '了解' | '熟练' | '精通' | string
  sortOrder: number
}

export interface SanityClientItem {
  _key?: string
  name: string
  logo?: SanityImage | null
  url?: string
  note?: string
  sortOrder: number
}

/** 履历（原始，对应 resumeQuery） */
export interface SanityResume {
  name: string
  role: string
  avatar?: SanityImage | null
  bio?: string
  location?: string
  email?: string
  phone?: string
  phoneTel?: string
  wechat?: string
  social?: SanitySocial[]
  resumeFile?: SanityFile | null
  experience?: SanityExperienceItem[]
  education?: SanityEducationItem[]
  awards?: SanityAwardItem[]
  exhibitions?: SanityExhibitionItem[]
  services?: SanityServiceItem[]
  skills?: SanitySkillItem[]
  clients?: SanityClientItem[]
}

/* ── 全局设置原始结构 ── */

export interface SanityBackgroundMusic {
  enabled?: boolean
  name?: string
  audioFile?: SanityFile | null
  audioUrl?: string | null
  loop?: boolean
  volume?: number
}

/** 全局设置（原始，对应 siteSettingsQuery） */
export interface SanitySiteSettings {
  siteName?: string
  intro?: string
  seoTitle?: string
  seoDescription?: string
  shareCover?: SanityImage | null
  footerText?: string
  contact?: {
    email?: string
    phone?: string
    phoneTel?: string
    wechat?: string
  }
  social?: SanitySocial[]
  backgroundMusic?: SanityBackgroundMusic
}
