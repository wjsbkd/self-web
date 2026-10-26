/**
 * Sanity client 单例
 *
 * 全站只有这一个 client，而且它是**只读已发布**的：
 *   perspective 固定 'published' —— 即使有人在后台点了「发布」之前的草稿，
 *   前台也读不到；草稿永远只存在于 Studio 里。
 *
 * 这里**没有** token，也不允许加：CDN 的公开读不需要 token，
 * 只要 project 的 CORS 允许你的域名即可。前台一旦带上写 token，
 * 任何人打开开发者工具就能改你的内容 —— 这是本次接入的红线。
 *
 * 草稿预览怎么做：Studio 自带「草稿 / 已发布」切换，登录后即可看到未发布版本；
 * 前台不需要、也不应该为此持有写权限。
 */
import { createClient, type SanityClient } from '@sanity/client'
import { sanityEnv } from './env'

/** 前台读：只读已发布内容，无 token */
export const publishedClient: SanityClient = createClient({
  projectId: sanityEnv.projectId || 'placeholder',
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: true,
  perspective: 'published',
})
