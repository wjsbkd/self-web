/**
 * 作品 adapter —— Sanity 原始 → Projects.jsx / ProjectDetail.jsx 现有结构
 *
 * 设计原则（需求第十节第 5 条）：
 *   把 Sanity 原始数据转换成页面当前使用的数据结构，减少页面组件改动。
 *
 * Projects.jsx 现在吃的是 {index, title, subtitle, image, stat, label, ...}，
 * 这些字段是**前端展示字段**而非 CMS 字段。所以 adapter 要做两件事：
 *   1. 把 cover（媒体封面对象）摊平成 Projects.jsx 能直接用的 image/alt
 *   2. 保留 Sanity 的 slug/year/summary 等供详情页与新列表用
 *
 * ⚠️ 这里不改 Projects.jsx 的现有字段，而是**扩展**它的数据：
 *   既有字段（index/subtitle/image/stat/label）继续保留用于列表，
 *   新增 slug/coverType/media 等供详情页与封面切换用。
 */
import type { SanityProject, SanityProjectDetail, SanityMediaCover, SanityMediaModule } from '../types'
import { buildImageUrl } from './imageUrl'

/** 作品列表项（适配后，供 Projects.jsx / 新列表组件用） */
export interface FrontendProject {
  id: string
  slug: string
  title: string
  year: string
  /** Projects.jsx 现有字段：概览卡左上角的序号（01 / 02 / 03），按展示顺序生成 */
  index: string
  /** Projects.jsx 现有字段：列表概览卡的小标签 */
  subtitle: string
  summary: string
  /** 概览卡右下角的大数字与说明（现有设计的 stat / label） */
  stat: string
  label: string
  /** 首页详情面板的三段文案（现有设计的 background / responsibility / result） */
  background: string
  responsibility: string
  result: string
  featured: boolean
  sortOrder: number
  category?: { id: string; title: string; slug: string } | null

  // ── 封面（摊平）──
  /** 封面类型：决定详情页首屏是图片还是视频 */
  coverType: 'image' | 'video'
  /** 图片 URL（coverType=image 时）或 poster URL（coverType=video 时） */
  image: string
  /** 图片替代文本 */
  alt: string
  /** 视频地址（coverType=video 时）：优先文件，其次 URL */
  videoUrl?: string
  poster: string
  cover: FrontendMediaCover
}

/** 封面媒体（适配后，供 WorkModal / 详情页首屏用） */
export interface FrontendMediaCover {
  mediaType: 'image' | 'video'
  /** 图片 URL（image 类型） */
  image?: string
  alt?: string
  /** 视频地址（video 类型）：优先 Sanity 文件，其次外链 */
  videoUrl?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

/** 详情页媒体模块（适配后） */
export interface FrontendMediaModule {
  moduleType: 'image' | 'gallery' | 'video' | 'imageText'
  image?: string
  alt?: string
  caption?: string
  gallery?: string[]
  videoUrl?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  imageTextTitle?: string
  imageTextBody?: string
}

/** 作品详情（适配后，供 ProjectDetail.jsx 用） */
export interface FrontendProjectDetail extends FrontendProject {
  /** Portable Text 富文本 block 数组；为空时详情页显示 summary */
  description?: unknown[] | null
  media?: FrontendMediaModule[]
  createdAt?: string
  updatedAt?: string
}

/** 摊平封面对象 → { image, alt, videoUrl, poster } */
function flattenCover(cover: SanityMediaCover | null | undefined): {
  coverType: 'image' | 'video'
  image: string
  alt: string
  videoUrl?: string
  poster: string
  cover: FrontendMediaCover
} {
  if (!cover) {
    // 兜底：没有封面信息时给空值，调用方用本地占位图
    return {
      coverType: 'image',
      image: '',
      alt: '',
      poster: '',
      cover: { mediaType: 'image' },
    }
  }

  if (cover.mediaType === 'video') {
    const posterUrl = buildImageUrl(cover.poster) ?? ''
    const videoUrl = cover.videoFile?.url ?? cover.videoUrl ?? undefined
    return {
      coverType: 'video',
      image: posterUrl, // 列表卡用 poster 当封面图
      alt: cover.poster?.alt ?? '',
      videoUrl,
      poster: posterUrl,
      cover: {
        mediaType: 'video',
        videoUrl,
        poster: posterUrl,
        autoplay: cover.autoplay,
        loop: cover.loop,
        muted: cover.muted,
      },
    }
  }

  // 图片类型
  const imageUrl = buildImageUrl(cover.image) ?? ''
  return {
    coverType: 'image',
    image: imageUrl,
    alt: cover.image?.alt ?? '',
    poster: imageUrl,
    cover: {
      mediaType: 'image',
      image: imageUrl,
      alt: cover.image?.alt ?? '',
    },
  }
}

/**
 * 适配作品列表项
 *
 * @param position 在已排序列表里的下标（从 0 开始），用来生成概览卡左上角的 01/02/03
 */
export function adaptProject(p: SanityProject, position = 0): FrontendProject {
  const flat = flattenCover(p.cover)
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    year: p.year,
    index: String(position + 1).padStart(2, '0'),
    // 卡片右上角：优先用后台填的副标题，没填才回落到分类名
    subtitle: p.subtitle || p.category?.title || p.summary.slice(0, 12),
    summary: p.summary,
    // 这三个是现有前台设计里的文案位；后台没填就留空，不破版
    stat: p.stat ?? '',
    label: p.label ?? '',
    background: p.background || p.summary,
    responsibility: p.responsibility ?? '',
    result: p.result ?? '',
    featured: p.featured,
    sortOrder: p.sortOrder,
    category: p.category,
    ...flat,
  }
}

/** 适配详情页媒体模块 */
function adaptMediaModule(m: SanityMediaModule): FrontendMediaModule {
  const base: FrontendMediaModule = {
    moduleType: m.moduleType,
  }
  switch (m.moduleType) {
    case 'image':
      base.image = buildImageUrl(m.image) ?? ''
      base.alt = m.alt ?? ''
      base.caption = m.caption
      break
    case 'gallery':
      base.gallery = (m.gallery ?? []).map((g) => buildImageUrl(g) ?? '').filter(Boolean)
      base.caption = m.caption
      break
    case 'video':
      base.videoUrl = m.videoFile?.url ?? m.videoUrl ?? undefined
      base.poster = buildImageUrl(m.poster) ?? ''
      base.autoplay = m.autoplay
      base.loop = m.loop
      base.muted = m.muted
      break
    case 'imageText':
      base.image = buildImageUrl(m.image) ?? ''
      base.imageTextTitle = m.imageTextTitle
      base.imageTextBody = m.imageTextBody
      break
  }
  return base
}

/** 适配作品详情 */
export function adaptProjectDetail(p: SanityProjectDetail): FrontendProjectDetail {
  const flat = flattenCover(p.cover)
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    year: p.year,
    // 详情页不显示序号；列表项的序号由 adaptProject 的 position 决定
    index: String(p.sortOrder + 1).padStart(2, '0'),
    subtitle: p.subtitle || p.category?.title || p.summary.slice(0, 12),
    summary: p.summary,
    stat: p.stat ?? '',
    label: p.label ?? '',
    background: p.background || p.summary,
    responsibility: p.responsibility ?? '',
    result: p.result ?? '',
    featured: p.featured,
    sortOrder: p.sortOrder,
    category: p.category,
    ...flat,
    description: p.description ?? null,
    media: (p.media ?? []).map(adaptMediaModule),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}
