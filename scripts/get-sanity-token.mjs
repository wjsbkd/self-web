#!/usr/bin/env node
/**
 * 取得一个 Sanity 写 token，打印到 stdout（供 seed-sanity.mjs 消费）。
 *
 * 为什么需要这个脚本，而不是 `sanity login`：
 *   本机浏览器进程不走系统代理，到不了 api.sanity.io；
 *   sanity CLI 自己的 fetch 也不走代理，即便拿到 token 也会
 *   "Could not verify token: fetch failed"。
 *   所以这里用 Node 直连本机代理（默认 127.0.0.1:10811）走完 OAuth。
 *
 * 前置：需要一个 GitHub 会话 cookie 文件（默认 .claude/gh-cookies.json，
 * 用 ego 的 CDP Network.getCookies 从 github.com 取，含 httpOnly 的
 * user_session / __Host-user_session_same_site）。跑完请删掉这个文件。
 *
 * 用法：
 *   PROXY_HOST=127.0.0.1 node scripts/get-sanity-token.mjs > /tmp/tok
 *   GH_COOKIES=/path/cookies.json node scripts/get-sanity-token.mjs
 *
 * token 只走 stdout，不落盘。
 */
import { readFile } from 'node:fs/promises'
import { request, jarToHeader, pickSetCookie, findMetaRefresh } from './lib/proxy-fetch.mjs'

const COOKIE_FILE = process.env.GH_COOKIES || '.claude/gh-cookies.json'

const cookies = JSON.parse(await readFile(COOKIE_FILE, 'utf8'))
const ghCookie = jarToHeader(cookies)

// 第 1 跳：向 Sanity 要一个登录会话，拿到指向 GitHub 的 302 + tempSession cookie。
// 第 3 跳不跟随重定向，只读 Location 里的 sid，所以这个地址不需要真的能访问。
const h1 = await request(
  `https://api.sanity.io/v1/auth/login/github?type=token&label=seed-script&origin=${encodeURIComponent('http://localhost:3333')}`,
)
if (h1.status !== 302 || !h1.headers.location) {
  throw new Error(`登录起点期望 302，实际 ${h1.status}`)
}
const tempCookie = pickSetCookie(h1.headers)

// 第 2 跳：带着 GitHub 会话去授权
const h2 = await request(h1.headers.location, {
  headers: { Cookie: ghCookie, Referer: 'https://github.com/', Accept: 'text/html,*/*' },
})
// 第一次授权某应用时 GitHub 会出同意页。那一步是用户在授权，
// 脚本不替人点「同意」——宁可停下来让人去浏览器里点一次。
if (/name="authenticity_token"/.test(await h2.text())) {
  throw new Error('GitHub 要求确认授权，请在浏览器里完成一次后重跑')
}
const callback = findMetaRefresh(await h2.text())
if (!callback) throw new Error('GitHub 未返回 Sanity 回调地址')

// 第 3 跳：Sanity 用 code 换 sid
const h3 = await request(callback, { headers: { Cookie: tempCookie, Accept: 'text/html,*/*' } })
const sid = new URL(h3.headers.location || '').searchParams.get('sid')
if (!sid) throw new Error('回调里没有 sid')

// 第 4 跳：sid 换 token。sid 是一次性的，必须紧接着用掉。
const h4 = await request(`https://api.sanity.io/v1/auth/fetch?sid=${sid}`)
const token = (await h4.json()).token
if (!token) throw new Error('没拿到 token：' + (await h4.text()).slice(0, 200))

process.stdout.write(token)
