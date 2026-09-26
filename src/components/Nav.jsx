import { useState, useEffect } from 'react'
import './Nav.css'
import Arrow from '@/components/Arrow.jsx'
import Magnetic from '@/components/Magnetic.jsx'
import { navLinks, contactEmail } from '@/data/nav.js'
import { useScrollProgress, useScrollDirection } from '@/hooks/useScroll.js'

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
    <nav
      className={`nav wrap${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}${hidden ? ' nav-hidden' : ''}`}
    >
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        <svg className="brand-mark" viewBox="0 0 120 48" aria-label="LZH">
          <text x="0" y="38" fill="#1f1915" fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="800" fontStyle="italic" fontSize="42" letterSpacing="-2">L</text>
          <text x="40" y="38" fill="#cc785c" fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="800" fontStyle="italic" fontSize="42" letterSpacing="-2">Z</text>
          <text x="78" y="38" fill="#cc785c" fontFamily="'Inter','Helvetica Neue',Arial,sans-serif" fontWeight="800" fontStyle="italic" fontSize="42" letterSpacing="-2">H</text>
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

      {/* 顶部滚动进度条（Apple 风格极简指示器） */}
      <div className="nav-progress" aria-hidden="true">
        <div className="nav-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  )
}
