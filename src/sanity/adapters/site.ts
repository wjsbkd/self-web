/**
 * 全局设置 adapter —— Sanity 原始 → nav.js 现有结构 + 新增 bgm 字段
 *
 * 现有结构（nav.js）：
 *   contactEmail / contactPhone / contactPhoneTel / contactWechat / resumePdf
 *
 * adapter 把这些映射到 Sanity 的 contact 对象，
 * 并额外暴露 siteName / seoTitle / seoDescription / shareCover / footerText /
 * social / backgroundMusic。
 */
import type { SanitySiteSettings, SanitySocial } from '../types'
import { buildImageUrl } from './imageUrl'

/** 适配后的全局设置 */
export interface FrontendSiteSettings {
  siteName?: string
  intro?: string
  seoTitle?: string
  seoDescription?: string
  shareCover?: string
  footerText?: string
  contact: {
    email?: string
    phone?: string
    phoneTel?: string
    wechat?: string
  }
  social: SanitySocial[]
  backgroundMusic?: {
    enabled: boolean
    name?: string
    url?: string
    loop: boolean
    volume: number
  }
}

export function adaptSiteSettings(s: SanitySiteSettings | null | undefined): FrontendSiteSettings {
  if (!s) {
    return { contact: {}, social: [] }
  }
  const music = s.backgroundMusic
  const bgmUrl = music?.audioFile?.url ?? music?.audioUrl ?? undefined
  return {
    siteName: s.siteName,
    intro: s.intro,
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    shareCover: buildImageUrl(s.shareCover),
    footerText: s.footerText,
    contact: {
      email: s.contact?.email,
      phone: s.contact?.phone,
      phoneTel: s.contact?.phoneTel,
      wechat: s.contact?.wechat,
    },
    social: s.social ?? [],
    backgroundMusic: music
      ? {
          enabled: Boolean(music.enabled),
          name: music.name,
          url: bgmUrl,
          loop: Boolean(music.loop),
          volume: typeof music.volume === 'number' ? music.volume : 0.35,
        }
      : undefined,
  }
}
