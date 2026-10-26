/**
 * 数据层对外的统一结构（Sanity 与本地兜底必须完全一致）
 *
 * 这里只用 `import type`，编译后不留任何运行时 import ——
 * 所以本文件不会把 Sanity SDK 拉进主 bundle。
 */
import type { FrontendProject, FrontendProjectDetail } from '../sanity/adapters/project'
import type {
  FrontendExperience,
  FrontendProfile,
  FrontendEducation,
  FrontendListItem,
  FrontendSkill,
  FrontendClient,
} from '../sanity/adapters/resume'
import type { FrontendSiteSettings } from '../sanity/adapters/site'

export type DataSource = 'sanity' | 'local'

export interface ProjectsPayload {
  projects: FrontendProject[]
  source: DataSource
}

export interface ResumePayload {
  experiences: FrontendExperience[]
  profile: FrontendProfile | null
  education: FrontendEducation[]
  awards: FrontendListItem[]
  exhibitions: FrontendListItem[]
  services: FrontendListItem[]
  skills: FrontendSkill[]
  clients: FrontendClient[]
  source: DataSource
}

export interface SiteSettingsPayload {
  siteName?: string
  intro?: string
  seo: FrontendSiteSettings
  source: DataSource
}

/** 详情页可能返回 null（slug 不存在 / 未发布） */
export type ProjectDetailPayload = FrontendProjectDetail | null
