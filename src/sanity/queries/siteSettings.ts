/**
 * 网站全局设置 GROQ 查询
 *
 * 同样固定 _id 'siteSettings'。返回结构尽量扁平，
 * 背景音乐对象保持嵌套（字段多，摊平会让顶层很乱）。
 */
import { defineQuery } from 'groq'

const IMAGE_FIELDS = /* groq */ `
  "id": asset._ref,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot,
  "blurDataURL": asset->metadata.lqip
`

const FILE_FIELDS = /* groq */ `
  "url": asset->url,
  "size": asset->size,
  "originalFilename": asset->originalFilename
`

const SOCIAL_FIELDS = /* groq */ `
  _key, platform, url, note
`

export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0] {
    siteName,
    intro,
    seoTitle,
    seoDescription,
    shareCover { ${IMAGE_FIELDS} },
    footerText,
    contact {
      email,
      phone,
      phoneTel,
      wechat
    },
    social[] { ${SOCIAL_FIELDS} },
    backgroundMusic {
      enabled,
      name,
      audioFile { ${FILE_FIELDS} },
      audioUrl,
      loop,
      volume
    }
  }
`)
