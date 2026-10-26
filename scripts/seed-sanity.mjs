#!/usr/bin/env node
/**
 * 把本地履历 + 全局设置灌进 Sanity（一次性迁移，幂等可重跑）。
 *
 * 用法：
 *   SANITY_WRITE_TOKEN=xxx node --env-file=.env.local scripts/seed-sanity.mjs   # 真实写入
 *   node scripts/seed-sanity.mjs --dry-run                                      # 只打印 payload，不联网
 *
 * projectId / dataset 从环境变量读（SANITY_PROJECT_ID / SANITY_DATASET，兼容
 * VITE_SANITY_*），源码里不写死；加 --env-file=.env.local 就直接用项目已有配置。
 * token 在 Sanity Manage（https://www.sanity.io/manage）→ 你的项目 → API → Tokens
 * 建 **Editor** 权限的 token，跑完可以删。项目里平时不存 token。
 * 没有现成 token 时，可以先用 scripts/get-sanity-token.mjs 换一个。
 *
 * 网络：Node 的 fetch 不读系统代理。若本机直连不到 api.sanity.io，
 * 设 PROXY_HOST（及 PROXY_PORT）让所有请求走代理隧道：
 *   PROXY_HOST=127.0.0.1 PROXY_PORT=10811 SANITY_WRITE_TOKEN=xxx node scripts/seed-sanity.mjs
 * 不设则按原样直连，行为不变。
 *
 * 读的是 src/data/experiences.js 与 src/data/nav.js —— 与前台本地兜底同源，
 * 所以灌进去的内容和现在线上看到的完全一致。重跑会覆盖（createOrReplace）。
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, basename } from 'node:path'
import { request } from './lib/proxy-fetch.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// 与 sanity.config.ts / sanity.cli.ts 同一套读取顺序（Studio 前缀优先，VITE_ 兜底）；
// 都不写死，换项目改 .env.local 即可。
const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const API_VERSION = process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-10-01'
const ORIGIN = 'https://wjsbkd.github.io'

const token = process.env.SANITY_WRITE_TOKEN
const dryRun = process.argv.includes('--dry-run')

if (!PROJECT_ID) {
  console.error('✗ 缺 projectId。加 --env-file=.env.local 复用项目配置，或显式设 SANITY_PROJECT_ID。')
  console.error('  例：node --env-file=.env.local scripts/seed-sanity.mjs')
  process.exit(1)
}

const { experiences } = await import(pathToFileURL(resolve(ROOT, 'src/data/experiences.js')).href)
const nav = await import(pathToFileURL(resolve(ROOT, 'src/data/nav.js')).href)

/** "2026.01 — 2026.03" / "2024.06 — 至今" → { startDate, endDate, current } */
function parsePeriod(p) {
  const [s, e] = String(p).split('—').map((x) => x.trim())
  if (!e || e === '至今') return { startDate: s, endDate: '', current: true }
  return { startDate: s, endDate: e, current: false }
}

const key = () => crypto.randomUUID().slice(0, 8)

// 社交：抖音 + 简历（绝对 URL，满足 social.url 的 http/https 校验）。
// 邮箱不进 social —— Footer 直接用 contact.email 拼 mailto，不读 social。
const resumePdfAbs = ORIGIN + nav.resumePdf
const social = [
  { _key: key(), platform: '抖音', url: 'https://v.douyin.com/k8afilJ0GOk/', note: '势不可挡' },
  { _key: key(), platform: '简历', url: resumePdfAbs, note: 'PDF 下载' },
]

const resume = {
  _id: 'resume',
  _type: 'resume',
  name: '李纵横',
  role: 'AI 内容运营与视觉创作者',
  email: nav.contactEmail,
  phone: nav.contactPhone,
  phoneTel: nav.contactPhoneTel,
  wechat: nav.contactWechat,
  bio: '专注内容、运营与现场执行的交界处，让创意转化为可见的影响力。',
  location: '上海',
  social,
  experience: experiences.map((x, i) => {
    const { startDate, endDate, current } = parsePeriod(x.period)
    return {
      _key: key(),
      company: x.company,
      role: x.role,
      startDate,
      endDate,
      current,
      points: (x.points || []).map((p) => ({ _key: key(), label: p.label || '', text: p.text })),
      tags: x.tags || [],
      sortOrder: i,
      status: 'published',
    }
  }),
  education: [],
  awards: [],
  exhibitions: [],
  services: [],
  skills: [],
  clients: [],
}

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: '李纵横 · 个人作品集',
  intro: '专注内容、运营与现场执行的交界处，让创意转化为可见的影响力。',
  seoTitle: '李纵横 · 个人作品集 | AI 内容运营与视觉创作者',
  seoDescription:
    '李纵横的个人作品集：专注内容、运营与现场执行的交界处，让创意转化为可见的影响力。涵盖虎扑 CSGO 上海 Major、WaytoAGI 少儿 AI 春晚、弥勒春晚、芒果TV《大侦探》等项目。',
  footerText: '© 李纵横 · 内容运营与视觉创作者',
  contact: {
    email: nav.contactEmail,
    phone: nav.contactPhone,
    phoneTel: nav.contactPhoneTel,
    wechat: nav.contactWechat,
  },
  social,
  backgroundMusic: { enabled: false, loop: true, volume: 0.35 },
}

if (dryRun) {
  console.log('=== resume ===')
  console.log(JSON.stringify(resume, null, 2))
  console.log('\n=== siteSettings ===')
  console.log(JSON.stringify(siteSettings, null, 2))
  console.log('\n（dry-run，未联网。去掉 --dry-run 并设 SANITY_WRITE_TOKEN 即真实写入。）')
  process.exit(0)
}

if (!token) {
  console.error('✗ 缺 SANITY_WRITE_TOKEN。在 manage → API → Tokens 建 Editor 权限 token。')
  console.error('  或加 --dry-run 只看 payload。')
  process.exit(1)
}

const apiBase = `https://${PROJECT_ID}.api.sanity.io`

// 1. 上传简历 PDF（让 About 的「下载简历」指向 Sanity 资源）
// nav.resumePdf 是站点路径（以 / 开头），要剥掉前导斜杠再拼到 public/ 下，
// 否则 resolve 会把它当成绝对路径，落到磁盘根目录去。
const pdfPath = resolve(ROOT, 'public', nav.resumePdf.replace(/^\/+/, ''))
const pdfBytes = await readFile(pdfPath)
// 上传端点：/v1/assets/files/{dataset}?filename= —— dataset 是路径第一段，
// 不是 projectId。写成 /assets/files/{projectId} 会被当成 dataset 名而报
// "Dataset not found"。
const uploadUrl = `${apiBase}/v1/assets/files/${DATASET}?filename=${encodeURIComponent(basename(pdfPath))}`
const upRes = await request(uploadUrl, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/pdf' },
  body: pdfBytes,
})
if (upRes.status < 200 || upRes.status >= 300) {
  console.error('✗ 简历 PDF 上传失败:', upRes.status, (await upRes.text()).slice(0, 200))
  process.exit(1)
}
const asset = await upRes.json()
// 上传接口返回 {document: {...}}，资产 id 在 document._id
const assetId = asset.document?._id || asset._id
if (!assetId) {
  console.error('✗ 上传响应里没有资产 id:', JSON.stringify(asset).slice(0, 200))
  process.exit(1)
}
resume.resumeFile = { _type: 'file', asset: { _type: 'reference', _ref: assetId } }
console.log(`✓ 简历 PDF 已上传: ${assetId} (${(pdfBytes.length / 1024).toFixed(0)}KB)`)

// 2. createOrReplace 两个单例（幂等）
// 请求格式与 @sanity/client 一致：
//   URL  是 /v{apiVersion}/data/mutate/{dataset}
//   body 是 {mutations:[{createOrReplace: doc}]}，不是 {createOrReplace: doc}
async function createOrReplace(doc) {
  const url = `${apiBase}/v${API_VERSION}/data/mutate/${DATASET}`
  const res = await request(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
  })
  const j = await res.json().catch(() => ({}))
  if (res.status < 200 || res.status >= 300) {
    console.error(`✗ ${doc._id} 写入失败:`, res.status, JSON.stringify(j).slice(0, 600))
    process.exit(1)
  }
  const rev = j.results?.[0]?.rev ?? '?'
  console.log(`✓ ${doc._id} 已写入 (rev ${rev})`)
}

await createOrReplace(siteSettings)
await createOrReplace(resume)
console.log('\n完成。前台刷新后会从 Sanity 读这两份数据；改完后台内容不用再跑这个脚本。')
