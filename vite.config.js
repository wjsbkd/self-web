import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'

// Vite 配置：路径别名 @ 指向 src，方便组件间引用
//
// 2026-10-26 起改为多入口：
//   index.html   → 前台站点（主 bundle，**不含任何 Sanity 代码**）
//   admin.html   → Sanity Studio 后台（独立 bundle，只在 /admin 加载）
//
// 为什么拆两个入口而不是一个 SPA 里挂 /admin：Sanity Studio 打包后约 2MB，
// 混在主 bundle 里会让前台首屏 JS 从 109KB(gzip) 涨到 700KB+。
// 拆开后两个入口各自按需加载，互不干扰；前台代码里也不出现 sanity 的 import。
//
// ⚠️ build.rollupOptions.output.manualChunks 故意不拆 sanity：
//   主入口根本没有 sanity，拆了也是空规则。

/**
 * 把构建出的 dist/admin.html 复制成 dist/admin/index.html。
 *
 * 为什么要这一步：GitHub Pages / Cloudflare Pages 都只对「目录」做默认首页，
 * 直接访问 /admin 时服务器找不到 admin.html 这个无扩展名路径。
 * 产出 dist/admin/index.html 后，/admin、/admin/、/admin.html 三种写法都能打开。
 *
 * 资源路径用的是 /assets/...（绝对路径），在 /admin/ 下同样正确，无需改 base。
 */
function emitAdminIndex(siteOnly) {
  return {
    name: 'emit-admin-index',
    apply: 'build',
    closeBundle() {
      if (siteOnly) return
      const dist = resolve(import.meta.dirname, 'dist')
      const from = resolve(dist, 'admin.html')
      if (!existsSync(from)) return
      mkdirSync(resolve(dist, 'admin'), { recursive: true })
      copyFileSync(from, resolve(dist, 'admin', 'index.html'))
    },
  }
}

// mode 说明：
//   vite build                  → 前台 + 后台（默认，GitHub Actions 用这个）
//   vite build --mode site-only → 只打包前台（后台改用 sanity deploy 托管时用）
export default defineConfig(({ mode }) => {
  const siteOnly = mode === 'site-only'

  const input = { main: resolve(import.meta.dirname, 'index.html') }
  if (!siteOnly) input.admin = resolve(import.meta.dirname, 'admin.html')

  return {
    plugins: [react(), emitAdminIndex(siteOnly)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: { input },
    },
  }
})
