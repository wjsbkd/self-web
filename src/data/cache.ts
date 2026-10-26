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

/**
 * **进行中**的请求表：同一 key 的并发调用共享同一个 Promise。
 *
 * 为什么需要（2026-10-26 线上实测）：
 *   `useSiteSettings()` 被 5 个组件调用、`useResume()` 被 3 个调用，
 *   每个 hook 实例都独立发一次查询 —— 首屏因此打出 9 个**完全重复**的请求。
 *   冷启动时 9 个并发把 DNS/TLS/连接池一起压上，实测全部撞在 3s 超时线上，
 *   整页静默回退到本地兜底数据（访客看到的还是旧内容）；
 *   第二波刷新（连接已热）935ms 就成功。
 *   合并成 3 个请求后，这个抖动消失。
 *
 * 只合并「正在进行中」的请求；已完成的仍走上面的 TTL 缓存。
 */
const inflight = new Map<string, Promise<unknown>>()

/**
 * 取一个正在进行中的同 key 请求；没有就返回 undefined。
 * 调用方应把真实请求的 Promise 交给 {@link trackInflight} 登记。
 */
export function getInflight<T>(key: string): Promise<T> | undefined {
  return inflight.get(key) as Promise<T> | undefined
}

/** 登记一个进行中的请求；结束时自动摘除（成功、失败都一样） */
export function trackInflight<T>(key: string, promise: Promise<T>): Promise<T> {
  inflight.set(key, promise)
  const done = () => {
    if (inflight.get(key) === promise) inflight.delete(key)
  }
  promise.then(done, done)
  return promise
}

/**
 * 远程查询失败记录：按 key 记下「这一次远程没拿到结果」。
 *
 * 为什么需要（2026-10-26 线上实测）：
 *   `remoteFirst()` 的设计是「远程失败就静默回退本地」，这个策略本身是对的，
 *   但它把失败信息一起吞了 —— 于是 hook 的 `error` 标志永远为 false，
 *   详情页无法区分「这件作品真的不存在」和「网络抖了一下没查到」。
 *   结果是超时被当成 404：访客刷新详情页看到「作品不存在」，
 *   直接违反「详情页刷新不得 404 或丢失数据」这条验收点。
 *
 * 用法：远程失败时 markFailure(key)；成功时 clearFailure(key)；
 *      消费方用 hasFailure(key) 读状态（读不清除，多个 hook 要一起看到）。
 */
const failures = new Map<string, unknown>()

export function markFailure(key: string, err: unknown): void {
  failures.set(key, err)
}

export function clearFailure(key: string): void {
  failures.delete(key)
}

export function hasFailure(key: string): boolean {
  return failures.has(key)
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
