/**
 * 前台数据 Hooks（组件只调这里，不直接碰接口函数或 Sanity SDK）
 *
 * 关键设计：**本地数据先上屏，Sanity 数据后替换**。
 *   data 的初值永远是同步的本地兜底数据 → 首帧就有内容，
 *   不会出现「配置了 Sanity 但请求没回来时页面空白」；
 *   Sanity 数据回来后 setState 替换，组件结构不变（需求第七节第 7 条）。
 *
 * 每个 Hook 都返回 { data, loading, error, source, reload }：
 *   loading 首次为 true（但 data 已有本地内容可渲染）
 *   source  'sanity' | 'local'，开发环境可显示数据来源
 *   reload  清缓存重查（404 页的「重试」用）
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getProjects,
  getProjectBySlug,
  getResume,
  getSiteSettings,
  localProjectsPayload,
  localProjectDetail,
  localResumePayload,
  localSitePayload,
} from './sanityData'
import { DATA_REFRESH_EVENT, deleteCache, getCached, setCached } from './cache'
import type {
  DataSource,
  ProjectsPayload,
  ResumePayload,
  SiteSettingsPayload,
  ProjectDetailPayload,
} from './types'
import type { FrontendProject } from '../sanity/adapters/project'

export interface UseDataResult<T> {
  data: T
  loading: boolean
  error: boolean
  source: DataSource
  reload: () => void
}

/**
 * 通用数据 Hook。
 *
 * @param queryFn     查询函数（稳定引用最理想；内部用 ref 持有，避免每次渲染重查）
 * @param key         缓存键
 * @param initialData 同步初值（本地兜底），保证首帧有内容
 */
export function useSanityData<T>(
  queryFn: () => Promise<T>,
  key: string,
  initialData: T,
): UseDataResult<T> {
  // 首次渲染优先用缓存，其次本地兜底
  const [data, setData] = useState<T>(() => getCached<T>(key) ?? initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // queryFn 放 ref：详情页传的是内联箭头函数（每次渲染新引用），
  // 若进依赖数组会让 effect 每帧重跑 → setState → 死循环。
  const fnRef = useRef(queryFn)
  fnRef.current = queryFn

  const run = useCallback(async () => {
    const cached = getCached<T>(key)
    if (cached !== undefined) {
      setData(cached)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const result = await fnRef.current()
      setData(result)
      setCached(key, result)
      setError(false)
    } catch (err) {
      // 生产环境不暴露错误详情；页面继续显示已有（本地）数据
      if (import.meta.env.DEV) console.warn(`[data:${key}] 查询异常：`, err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    run()
  }, [run])

  // 前台重新可见 / 获得焦点时静默重查（后台发布后自动更新）
  useEffect(() => {
    const onRefresh = () => {
      deleteCache(key)
      run()
    }
    window.addEventListener(DATA_REFRESH_EVENT, onRefresh)
    return () => window.removeEventListener(DATA_REFRESH_EVENT, onRefresh)
  }, [key, run])

  const reload = useCallback(() => {
    deleteCache(key)
    run()
  }, [key, run])

  // 详情 payload 是对象或 null（没有 source 字段），统一在这里取一次
  const source = (data as { source?: DataSource } | null)?.source ?? 'local'

  return { data, loading, error, source, reload }
}

/* ───────────────────────── 具体数据的 Hook ───────────────────────── */

/** 作品列表（含本地兜底，首帧即有数据） */
export function useProjects(): UseDataResult<ProjectsPayload> {
  return useSanityData(getProjects, 'projects', localProjectsPayload())
}

/** 单个作品详情 */
export function useProjectDetail(slug: string): UseDataResult<ProjectDetailPayload> {
  return useSanityData<ProjectDetailPayload>(
    () => getProjectBySlug(slug),
    `project-${slug}`,
    localProjectDetail(slug),
  )
}

/** 履历（工作经历 + 个人资料 + 各类列表） */
export function useResume(): UseDataResult<ResumePayload> {
  return useSanityData(getResume, 'resume', localResumePayload())
}

/** 全局设置（SEO / 联系方式 / 社交 / 背景音乐） */
export function useSiteSettings(): UseDataResult<SiteSettingsPayload> {
  return useSanityData(getSiteSettings, 'site-settings', localSitePayload())
}

/** 作品列表便捷选择器 */
export function useProjectList(): FrontendProject[] {
  return useProjects().data.projects
}
