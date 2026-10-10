import { useState, useEffect } from 'react'
import './Nav.css'
import Arrow from '@/components/Arrow.jsx'
import Magnetic from '@/components/Magnetic.jsx'
import { navLinks, contactEmail } from '@/data/nav.js'
import { useScrollProgress, useScrollDirection } from '@/hooks/useScroll.js'

// 全局固定导航 —— 暗场语言（2026-10）：悬浮白药丸（参考图 2.3 对位）
// 白药丸内：LZH 字标 + 导航项（active 下方 3px 小圆点）+ 状态文案；
// 右端独立深色药丸「联系我」形成明暗对置。滚动隐藏 / 进度条 / scrollspy 全部保留。
// 进度条渲染在 nav 元素之外：.nav 自带 transform（居中 + 隐藏位移），
// 会把 position:fixed 子元素变成相对自身定位，全宽进度线必须脱离该上下文。
export default function Nav({ active }) {
  const [open, setOpen] = useState(false)
  const progress = useScrollProgress()
  const { dir, scrolled } = useScrollDirection()

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

      <nav
        className={`nav${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}${hidden ? ' nav-hidden' : ''}`}
      >
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <svg className="brand-mark" viewBox="0 0 120 48" aria-label="LZH">
            <text x="0" y="38" fill="#141414" fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="800" fontStyle="italic" fontSize="42" letterSpacing="-2">L</text>
            <text x="40" y="38" fill="#141414" fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="800" fontStyle="italic" fontSize="42" letterSpacing="-2">Z</text>
            <text x="78" y="38" fill="#a8a29d" fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="800" fontStyle="italic" fontSize="42" letterSpacing="-2">H</text>
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
          <span className="nav-status">AVAILABLE FOR 2026</span>
          <Magnetic strength={0.25} radius={90}>
            <a className="nav-contact" href={`mailto:${contactEmail}`} onClick={() => setOpen(false)}>
              联系我 <Arrow />
            </a>
          </Magnetic>
        </div>
      </nav>
    </>
  )
}
