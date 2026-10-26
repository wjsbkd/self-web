/**
 * Schema 总出口 —— Studio 的 schemaTypes 从这里引入。
 *
 * 类型清单：
 *   文档：project / resume / siteSettings / category
 *   对象：mediaCover / mediaModule
 *
 * 新增内容类型的步骤：
 *   1. 在本目录建 xxx.ts 并 defineType
 *   2. 在下面的 schemaTypes 里登记
 *   3. 在 queries/ 写对应 GROQ
 *   4. 在 adapters/ 写数据转换
 *   5. 在 data/sanityData.ts 暴露统一接口
 */
import type { SchemaTypeDefinition } from 'sanity'
import { project } from './project'
import { resume } from './resume'
import { siteSettings } from './siteSettings'
import { category } from './category'
import { mediaCover } from './objects/mediaCover'
import { mediaModule } from './objects/mediaModule'

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  resume,
  siteSettings,
  category,
  mediaCover,
  mediaModule,
]
