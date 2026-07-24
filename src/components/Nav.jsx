import { useState, useEffect } from 'react'
import './Nav.css'
import Arrow from '@/components/Arrow.jsx'
import { navLinks, contactEmail } from '@/data/nav.js'

export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav wrap${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        LZH<span>&reg;</span>
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
        <a className="nav-contact" href={`mailto:${contactEmail}`} onClick={() => setOpen(false)}>
          联系我 <Arrow />
        </a>
      </div>
    </nav>
  )
}
