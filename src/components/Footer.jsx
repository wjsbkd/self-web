import './Footer.css'
import Arrow from '@/components/Arrow.jsx'
import { contactEmail } from '@/data/nav.js'

// 页脚 / 联系方式
export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-glow" />
      <div className="wrap footer-inner">
        <p className="eyebrow">LET&apos;S CREATE SOMETHING MEANINGFUL</p>
        <h2>
          下一个故事，
          <br />
          <i>从一次对话开始。</i>
        </h2>
        <a className="email" href={`mailto:${contactEmail}`}>
          {contactEmail} <Arrow />
        </a>

        <div className="footer-social">
          <a
            className="social-btn"
            href={`mailto:${contactEmail}`}
            aria-label="发送邮件"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
          <a
            className="social-btn"
            href="https://v.douyin.com/k8afilJ0GOk/"
            target="_blank"
            rel="noreferrer"
            aria-label="抖音主页：我将势不可挡"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 18a3 3 0 1 1-3-3" />
              <path d="M9 18V6l10-2v8" />
              <circle cx="18" cy="14" r="3" />
            </svg>
          </a>
          <a
            className="social-btn"
            href="/assets/李纵横15087322631.pdf"
            target="_blank"
            rel="noreferrer"
            download
            aria-label="下载简历 PDF"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 3h8l4 4v14H6z" />
              <path d="M14 3v4h4" />
              <path d="M9 13h6M9 16h6" />
            </svg>
          </a>
          <span className="social-wechat" aria-label="微信（同手机号）">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 5h12a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-2l-3 2v-2H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" />
              <circle cx="8" cy="9.5" r="0.8" fill="currentColor" />
              <circle cx="13" cy="9.5" r="0.8" fill="currentColor" />
            </svg>
            <span>微信 15087322631</span>
          </span>
        </div>

        <div className="footer-bottom">
          <span>© 2026 LIZONGHENG</span>
          <span>长春 / 中国</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  )
}
