import { useState, useEffect } from 'react'
import './Nav.css'
import Arrow from '@/components/Arrow.jsx'
import Magnetic from '@/components/Magnetic.jsx'
import { navLinks, contactEmail as localEmail } from '@/data/nav.js'
import { useSiteSettings } from '@/data/hooks'
import { useScrollProgress, useScrollDirection } from '@/hooks/useScroll.js'

// 全局固定导航 —— 三段式浮件（2026-10 暗场语言）
// 轨道贴左右缘、本身无底色，三段靠留白分组：左＝字标方块（paper），中＝导航药丸（ink 底 + 亮字），
// 右＝深炭药丸（状态文案 + 联系我）。明度节拍 paper → ink → charcoal → paper，一亮一暗地折返，
// 层级全部由明度差承担；全站唯一彩色只出现在两处 ——
// active 项的点阵下划线，与字标尾字母 H。滚动隐藏 / Magnetic / 移动端抽屉 / scrollspy 全部保留。
// 进度条渲染在 nav 元素之外：.nav 自带 transform（居中 + 隐藏位移），
// 会把 position:fixed 子元素变成相对自身定位，全宽进度线必须脱离该上下文。
export default function Nav({ active }) {
  const [open, setOpen] = useState(false)
  const progress = useScrollProgress()
  const { dir, scrolled } = useScrollDirection()
  const { data: site } = useSiteSettings()
  const email = site?.seo.contact.email ?? localEmail

  // Esc 键关闭移动端菜单（键盘交互）
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // 向下滚动隐藏、向上滚动显现（iOS 26 标签栏行为）
  // 移动端菜单展开时强制保持可见
  const hidden = dir === 'down' && scrolled && !open

  return (
    <>
      {/* 顶部滚动进度条（全宽细线，视口顶端） */}
      <div className="nav-progress" aria-hidden="true">
        <div className="nav-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <nav className={`nav${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}${hidden ? ' nav-hidden' : ''}`}>
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          {/* 字标的字体与填色在 global.css 的 .wordmark 族里（Footer 用同一枚锁定）。
              fill 走 CSS 类而非属性：presentation attribute 里写 var() 不可靠，
              与 HeroGlobe 的 stop.rim-* 同一套做法（已实测生效） */}
          <svg className="brand-mark wordmark" viewBox="0 0 120 48" aria-label="LZH">
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
        </a>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="nav-links" id="nav-links">
          <div className="nav-items">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={active === link.id ? 'active' : ''}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="nav-tail">
            <span className="nav-status">AVAILABLE FOR 2026</span>
            <Magnetic strength={0.25} radius={90}>
              <a className="nav-contact" href={`mailto:${email}`} onClick={() => setOpen(false)}>
                联系我 <Arrow />
              </a>
            </Magnetic>
          </div>
        </div>
      </nav>
    </>
  )
}
