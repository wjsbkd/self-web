/**
 * 图片 URL 生成 —— Sanity 图片管线
 *
 * 页面组件不直接拼 Sanity 图片 URL，全部走这里：
 *   buildImageUrl(img, { width: 800 })  →  'https://cdn.sanity.io/images/...?w=800&q=82&fm=webp'
 *
 * 收益（需求第三节「图片尽量通过 Sanity 图片管线进行压缩和响应式处理」）：
 * - 自动转 WebP（比 JPEG 小 25–35%）
 * - 按需指定宽度，配 srcset 实现响应式
 * - 保留 hotspot 裁切
 * - 未配置 Sanity 时返回 undefined，调用方走本地路径兜底
 */
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityClient } from '@sanity/client'
import type { SanityImage } from '../types'

let builder: ReturnType<typeof createImageUrlBuilder> | null = null

/** 用前台 client 初始化 builder（幂等，重复调用无副作用） */
export function initImageBuilder(client: SanityClient): void {
  builder = createImageUrlBuilder(client)
}

export interface ImageOptions {
  /** 目标宽度（px）。不传则用原图宽度 */
  width?: number
  /** 目标高度（px），与 width 同时用且 fit=crop 时生效 */
  height?: number
  /** 压缩质量 1–100，默认 82 */
  quality?: number
}

/**
 * GROQ 里 asset 被投影成扁平的 `id` 字符串，而 @sanity/image-url
 * 只认 `{ asset: { _ref } }` 这种引用结构 —— 直接传 img 会拿不到 asset，
 * `.url()` 生成空串。这里统一还原成 builder 认识的样子。
 */
function toImageSource(img: SanityImage) {
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: img.id },
    hotspot: img.hotspot ?? undefined,
  }
}

/**
 * 生成图片 URL。
 * @returns URL 字符串；未配置 Sanity 或图片无 asset 时返回 undefined（调用方走本地兜底）
 */
export function buildImageUrl(
  img: SanityImage | null | undefined,
  opts: ImageOptions = {},
): string | undefined {
  if (!img?.id || !builder) return undefined

  const { width, height, quality = 82 } = opts

  let b = builder.image(toImageSource(img)).quality(quality).format('webp').auto('format')
  // 裁切由 CSS object-fit: cover 处理更稳，这里只按需指定尺寸
  if (width) b = b.width(Math.round(width))
  if (height) b = b.height(Math.round(height))
  const url = b.url()
  return url || undefined
}

/**
 * 生成 srcset（响应式图片）
 * @param widths 断点宽度数组，如 [400, 800, 1200, 1600]
 */
export function buildSrcSet(
  img: SanityImage | null | undefined,
  widths: number[] = [400, 800, 1200, 1600],
): string {
  if (!img?.id || !builder) return ''
  // 只生成不超过原图宽度的档位，避免放大
  const max = img.width ?? Math.max(...widths)
  return widths
    .filter((w) => w <= max)
    .map((w) => `${buildImageUrl(img, { width: w })} ${w}w`)
    .join(', ')
}
