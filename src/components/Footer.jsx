import './Footer.css'
import Arrow from '@/components/Arrow.jsx'
import Magnetic from '@/components/Magnetic.jsx'
import Reveal from '@/components/Reveal.jsx'
import { useSiteSettings } from '@/data/hooks'
import { contactEmail as localEmail, contactWechat as localWechat, resumePdf as localResumePdf } from '@/data/nav.js'

// 页脚 / 联系方式 —— 暗场收尾（居中单轴，与 Hero 首尾呼应）
//
// 2026-10-26 Sanity 接入：联系方式从全局设置取（含本地兜底）。
// 视觉与交互完全保留，只把硬编码的邮箱/微信/简历替换为变量。
export default function Footer() {
  const { data: site } = useSiteSettings()
  const contact = site?.seo.contact ?? {}
  const email = contact.email ?? localEmail
  const wechat = contact.wechat ?? localWechat
  const resumeUrl = contactResumeFile(site) ?? localResumePdf
  // 页脚版权行来自全局设置；后台没填就沿用现有的硬编码文案，视觉不变。
  const footerText = site?.seo.footerText || '© 2026 LIZONGHENG'

  return (
    <footer className="footer" id="contact">
      <div className="footer-rim" aria-hidden="true" />
      <div className="wrap footer-inner">
        <Reveal>
          <p className="eyebrow">LET&apos;S CREATE SOMETHING MEANINGFUL</p>
          <h2>
            下一个故事，
            <br />
            <i>从一次对话开始。</i>
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="footer-email-wrap">
          <Magnetic strength={0.3} radius={140}>
            <a className="footer-cta" href={`mailto:${email}`}>
              发邮件聊聊 <Arrow />
            </a>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.25} className="footer-social">
          <Magnetic strength={0.5} radius={60}>
            <a
              className="social-btn"
              href={`mailto:${email}`}
              aria-label="发送邮件"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </a>
          </Magnetic>
          <Magnetic strength={0.5} radius={60}>
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
          </Magnetic>
          <Magnetic strength={0.5} radius={60}>
            <a
              className="social-btn"
              href={resumeUrl}
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
          </Magnetic>
          <span className="social-wechat" aria-label="微信（同手机号）">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 5h12a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-2l-3 2v-2H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" />
              <circle cx="8" cy="9.5" r="0.8" fill="currentColor" />
              <circle cx="13" cy="9.5" r="0.8" fill="currentColor" />
            </svg>
            <span>微信 {wechat}</span>
          </span>
        </Reveal>

        <div className="footer-bottom">
          <span className="footer-brand">
            <svg className="footer-mark wordmark wordmark--lit" viewBox="0 0 120 48" aria-label="LZH">
              <text className="bm-lzh" x="0" y="38">
                L
              </text>
              <text className="bm-lzh" x="40" y="38">
                Z
              </text>
              <text className="bm-h" x="78" y="38">
                H
              </text>
            </svg>
            <span>{footerText}</span>
          </span>
          <span>长春 / 中国</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  )
}

/** 从全局设置 social 里找「简历」链接，没有则返回 undefined */
function contactResumeFile(site) {
  const social = site?.seo.social ?? []
  const resumeEntry = social.find((s) => s.platform.includes('简历'))
  // Sanity 的简历文件在 contact 对象之外，这里只取 social 里的；
  // 真正的 resumeFile 由 About 的 profile.resumeFile 提供。
  return resumeEntry?.url
}
