/**
 * 作品相关 GROQ 查询（集中管理，别处不允许写裸查询字符串）
 *
 * 三条铁律：
 * 1. 前台查询一律带 `status == "published"` —— 草稿不出现在正式网站。
 * 2. 查询返回的是**扁平化的原始结构**（Dereference 后的），
 *    转换在 adapters/ 里做，页面组件只吃转换后的结构。
 * 3. 图片字段只取 _id / url / hotspot / alt 等必要信息，
 *    不把整个 asset 对象带回来（省带宽，也让类型好写）。
 */
import { defineQuery } from 'groq'

// 注意：schema 里 image/file 字段的 asset 是**引用**（reference），
  // asset._id 在 GROQ 里恒为 null，必须用 asset._ref 才能拿到 asset 文档 id。
  // （用 asset._id 会让 @sanity/image-url 拿到空串，封面图静默失效。）

/** 封面图片字段集（图片与视频 poster 共用） */
const COVER_IMAGE_FIELDS = /* groq */ `
  "id": asset._ref,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  "blurDataURL": asset->metadata.lqip,
  alt
`

/** 媒体封面字段集（图片 / 视频二选一） */
const MEDIA_COVER_FIELDS = /* groq */ `
  mediaType,
  image { ${COVER_IMAGE_FIELDS} },
  videoFile { "url": asset->url, "size": asset->size },
  videoUrl,
  poster { ${COVER_IMAGE_FIELDS} },
  autoplay,
  loop,
  muted
`

/** 详情页媒体模块字段集 */
const MEDIA_MODULE_FIELDS = /* groq */ `
  moduleType,
  image { ${COVER_IMAGE_FIELDS} },
  alt,
  caption,
  gallery[] { ${COVER_IMAGE_FIELDS} },
  videoFile { "url": asset->url, "size": asset->size },
  videoUrl,
  poster { ${COVER_IMAGE_FIELDS} },
  autoplay,
  loop,
  muted,
  imageTextTitle,
  imageTextBody
`

/**
 * 作品列表（前台）
 * - 只取已发布
 * - 按 sortOrder 升序
 * - 不含 description / media 的完整内容（列表页用不到，省带宽）；
 *   详情在 getProjectBySlug 里单独取。
 */
export const projectsQuery = defineQuery(`
  *[_type == "project" && status == "published"] | order(sortOrder asc) {
    "id": _id,
    title,
    "slug": slug.current,
    year,
    summary,
    subtitle,
    stat,
    label,
    background,
    responsibility,
    result,
    featured,
    sortOrder,
    cover { ${MEDIA_COVER_FIELDS} },
    "category": category-> {
      "id": _id,
      title,
      "slug": slug.current
    }
  }
`)

/**
 * 单个作品详情（前台）
 * 含完整 description（富文本 block 数组）与 media 模块。
 */
export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug && status == "published"][0] {
    "id": _id,
    title,
    "slug": slug.current,
    year,
    summary,
    subtitle,
    stat,
    label,
    background,
    responsibility,
    result,
    description,
    featured,
    sortOrder,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt,
    cover { ${MEDIA_COVER_FIELDS} },
    media[] { ${MEDIA_MODULE_FIELDS} },
    "category": category-> {
      "id": _id,
      title,
      "slug": slug.current
    }
  }
`)

/** 所有分类（供后台筛选与前台分类导航） */
export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(sortOrder asc) {
    "id": _id,
    title,
    "slug": slug.current,
    description,
    sortOrder
  }
`)

/**
 * 已发布作品的全部 slug（用于详情页存在性预检 / 404 兜底）
 * 只取 slug 一个字段，极轻量。
 */
export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && status == "published"] { "slug": slug.current }
`)
