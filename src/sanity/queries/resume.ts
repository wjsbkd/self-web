/**
 * 履历相关 GROQ 查询
 *
 * 单例文档：resume 的 _id 固定为 'resume'，直接用 *[_id == "resume"][0] 取，
 * 不要用 *[_type == "resume"]（万一将来出现第二份会取错）。
 *
 * 所有列表型字段都在 GROQ 里过滤草稿并排序：
 *   items[status == "published"] | order(sortOrder asc)
 * 这样前台拿到的就是最终展示顺序，不需要在 JS 里再排一次。
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
  _key,
  platform,
  url,
  note
`

export const resumeQuery = defineQuery(`
  *[_id == "resume"][0] {
    name,
    role,
    avatar { ${IMAGE_FIELDS} },
    bio,
    location,
    email,
    phone,
    phoneTel,
    wechat,
    social[] { ${SOCIAL_FIELDS} },
    resumeFile { ${FILE_FIELDS} },

    "experience": experience[status == "published"] | order(sortOrder asc) {
      _key,
      company,
      role,
      startDate,
      endDate,
      current,
      description,
      points[]{ _key, label, text },
      tags,
      sortOrder
    },
    "education": education[status == "published"] | order(sortOrder asc) {
      _key, school, degree, major, startDate, endDate, description, sortOrder
    },
    "awards": awards[status == "published"] | order(sortOrder asc) {
      _key, title, issuer, date, description, sortOrder
    },
    "exhibitions": exhibitions[status == "published"] | order(sortOrder asc) {
      _key, title, role, location, date, description, sortOrder
    },
    "services": services[status == "published"] | order(sortOrder asc) {
      _key, title, description, sortOrder
    },
    "skills": skills[status == "published"] | order(sortOrder asc) {
      _key, name, level, sortOrder
    },
    "clients": clients[status == "published"] | order(sortOrder asc) {
      _key, name, logo { ${IMAGE_FIELDS} }, url, note, sortOrder
    }
  }
`)
