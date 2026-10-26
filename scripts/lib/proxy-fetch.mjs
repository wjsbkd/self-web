/**
 * 走本机 HTTP 代理的 HTTPS 请求（Node 内置模块实现，无第三方依赖）。
 *
 * 为什么需要：Node 的 fetch 与 sanity CLI 都不读系统代理设置。
 * 在「直连不到 api.sanity.io、只有本机代理能出去」的机器上，
 * 任何写操作都会 fetch failed。设置 PROXY_HOST 即走这里；
 * 不设则 request() 退化成普通 fetch，行为不变。
 *
 * 用法：
 *   import { request } from './lib/proxy-fetch.mjs'
 *   const r = await request(url, { method: 'POST', headers, body })
 *   r.status / r.headers / r.text() / r.json()
 *
 *   PROXY_HOST=127.0.0.1 PROXY_PORT=10811 node scripts/seed-sanity.mjs
 */
import net from 'node:net'
import tls from 'node:tls'
import http from 'node:http'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'

/** 建 CONNECT 隧道，在上面发一个 HTTPS 请求。不跟随重定向。 */
export function viaProxy(urlStr, headers = {}, method = 'GET', body = null) {
  const host = process.env.PROXY_HOST || '127.0.0.1'
  const port = Number(process.env.PROXY_PORT || 10811)
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr)
    const sock = net.connect(port, host)
    const fail = (e) => reject(new Error(`走代理 ${host}:${port} 失败: ${e.message}`))
    sock.setTimeout(30000, () => fail(new Error('连接超时')))
    sock.on('error', fail)
    sock.once('connect', () => {
      sock.write(`CONNECT ${u.hostname}:443 HTTP/1.1\r\nHost: ${u.hostname}:443\r\n\r\n`)
      let buf = ''
      const onData = (d) => {
        buf += d.toString()
        if (!buf.includes('\r\n\r\n')) return
        const line = buf.split('\r\n')[0]
        if (!/ 200 /.test(line)) {
          sock.destroy()
          return reject(new Error(`CONNECT 被拒: ${line}`))
        }
        sock.removeListener('data', onData)
        const req = http.request(
          {
            createConnection: () => tls.connect({ socket: sock, servername: u.hostname }),
            hostname: u.hostname,
            path: u.pathname + u.search,
            method,
            headers: { Host: u.hostname, 'User-Agent': UA, ...headers },
          },
          (res) => {
            const chunks = []
            res.on('data', (c) => chunks.push(c))
            res.on('end', () =>
              resolve({
                status: res.statusCode,
                headers: res.headers,
                text: () => Promise.resolve(Buffer.concat(chunks).toString('utf8')),
                json: () => Promise.resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))),
              }),
            )
          },
        )
        req.on('error', fail)
        if (body) req.write(body)
        req.end()
      }
      sock.on('data', onData)
    })
  })
}

/**
 * 发请求：设了 PROXY_HOST 走代理隧道，否则用原生 fetch。
 * 返回值统一成 { status, headers, text(), json() }。
 */
export async function request(url, { method = 'GET', headers = {}, body = null } = {}) {
  if (process.env.PROXY_HOST) return viaProxy(url, headers, method, body)
  const res = await fetch(url, { method, headers, body })
  return {
    status: res.status,
    headers: Object.fromEntries(res.headers),
    text: () => res.text(),
    json: () => res.json(),
  }
}

export const jarToHeader = (cookies) => cookies.map((c) => `${c.name}=${c.value}`).join('; ')
export const pickSetCookie = (h) => (h['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ')

/** GitHub「已授权」中间页用 meta refresh 跳回回调地址，不是 302 */
export const findMetaRefresh = (html) => {
  const m = html.match(/http-equiv="refresh"\s+content="0;url=([^"]+)"/i)
  return m ? m[1].replace(/&amp;/g, '&') : null
}
