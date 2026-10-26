/**
 * Studio 挂载点（React 侧）
 *
 * 用 sanity 的 Studio 组件挂载 defineConfig。
 * 整个 Studio 只在 admin.html 入口被加载，主站 bundle 不含。
 *
 * 未配置 projectId 时**不挂载 Studio**：Studio 会拿占位 id 去请求
 * placeholder.api.sanity.io，浏览器里刷一屏 CORS 报错，用户完全看不懂。
 * 这里直接给一张中文配置指引卡，比一堆红字有用。
 */
import type { CSSProperties } from 'react'
import { Studio } from 'sanity'
import config from './studio'
import { sanityEnv } from '../sanity/env'

export default function StudioApp() {
  if (!sanityEnv.configured) return <SetupNotice />
  return <Studio config={config} />
}

/** 未配置 Sanity 时的指引卡 */
function SetupNotice() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.kicker}>SANITY STUDIO</p>
        <h1 style={styles.title}>后台还没连接到 Sanity</h1>
        <p style={styles.text}>
          这一步只需要做一次。完成后刷新本页即可进入中文后台。
        </p>
        <ol style={styles.list}>
          <li style={styles.item}>
            在 <code style={styles.code}>sanity.io/manage</code> 新建项目，记下 8 位 projectId。
          </li>
          <li style={styles.item}>
            把 <code style={styles.code}>.env.example</code> 复制成{' '}
            <code style={styles.code}>.env.local</code>，填入{' '}
            <code style={styles.code}>VITE_SANITY_PROJECT_ID</code>。
          </li>
          <li style={styles.item}>
            在 Sanity 项目后台的 API → CORS origins 里加上本站域名（本地开发再加{' '}
            <code style={styles.code}>http://localhost:5173</code>）。
          </li>
          <li style={styles.item}>重新构建 / 重启开发服务器，再刷新本页。</li>
        </ol>
        <p style={styles.hint}>
          完整步骤见仓库里的 <code style={styles.code}>docs/SANITY后台使用说明.md</code>。
        </p>
      </div>
    </div>
  )
}

/** 内联样式：后台入口只有这一屏，不值得为它单独引一份 CSS */
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: '#0d0a0c',
    color: '#f5f3ff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif",
  },
  card: {
    maxWidth: '620px',
    width: '100%',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  kicker: {
    margin: 0,
    fontSize: '11px',
    letterSpacing: '0.18em',
    color: '#ffc489',
  },
  title: {
    margin: '10px 0 14px',
    fontSize: '24px',
    fontWeight: 700,
  },
  text: {
    margin: '0 0 18px',
    fontSize: '14px',
    lineHeight: 1.8,
    color: '#b8b3b6',
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    lineHeight: 2,
    color: '#d8d4d6',
  },
  item: { marginBottom: '6px' },
  code: {
    padding: '1px 6px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.08)',
    fontSize: '13px',
  },
  hint: {
    margin: '18px 0 0',
    fontSize: '13px',
    color: '#8f8b8e',
  },
}
