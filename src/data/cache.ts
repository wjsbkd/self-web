/**
 * 数据缓存 + 实时刷新信号（与 Sanity SDK 无关，可安全静态导入）
 *
 * 单独成文件的原因：hooks 和 sanityData 都要用它，而 Sanity SDK 必须在
 * 动态 chunk 里（见 sanityRemote.ts）。放这里就不会把 SDK 拉进主 bundle。
 */

/** 内存缓存有效期：30s 内重复查询不重新请求 */
export const CACHE_TTL = 30_000

const cache = new Map<string, { value: unknown; ts: number }>()

export function getCached<T>(key: string): T | undefined {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.value as T
  return undefined
}

export function setCached<T>(key: string, value: T): void {
  cache.set(key, { value, ts: Date.now() })
}

export function deleteCache(key: string): void {
  cache.delete(key)
}

/** 全局刷新信号名 */
export const DATA_REFRESH_EVENT = 'sanity-data-refresh'

/** 通知所有数据 Hook 重新查询 */
export function triggerDataRefresh(): void {
  window.dispatchEvent(new CustomEvent(DATA_REFRESH_EVENT))
}

/**
 * 注册「前台重新可见时自动刷新」。
 *
 * 本项目是 SPA + 静态托管，用不了 Sanity Live Content API（需服务端 SSE）。
 * 后台发布内容几乎总是发生在「切到后台 → 编辑 → 切回前台」这条时间线上，
 * 所以在 visibilitychange / focus 时静默重查即可覆盖主场景，且比轮询省请求。
 *
 * 在 App 顶层调用一次，返回清理函数。
 */
export function registerLiveRefresh(): () => void {
  const onChange = () => {
    if (document.visibilityState === 'visible') triggerDataRefresh()
  }
  const onFocus = () => triggerDataRefresh()
  document.addEventListener('visibilitychange', onChange)
  window.addEventListener('focus', onFocus)
  return () => {
    document.removeEventListener('visibilitychange', onChange)
    window.removeEventListener('focus', onFocus)
  }
}
