import { Component } from 'react'
import { contactEmail } from '@/data/nav.js'

// 全局错误边界：任一区块渲染崩溃时显示兜底提示，避免整页白屏
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // 生产环境可在此上报到监控服务
    // eslint-disable-next-line no-console
    console.error('页面渲染出错：', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '40px',
            textAlign: 'center',
            background: 'var(--bg-base, #0d0a0c)',
            color: '#f3efec',
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          <h1 style={{ fontSize: '28px', margin: 0 }}>页面出了点问题</h1>
          <p style={{ color: '#9a948f', maxWidth: '420px', lineHeight: 1.7 }}>
            部分内容加载失败，请刷新重试。若问题持续，请联系 {contactEmail}。
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              border: '1px solid #e9a57f',
              background: 'transparent',
              color: '#e9a57f',
              padding: '12px 22px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
