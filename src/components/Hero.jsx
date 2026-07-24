import './Hero.css'
import { useRef, useCallback } from 'react'
import Arrow from '@/components/Arrow.jsx'

export default function Hero() {
  const ringRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = ringRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = (e.clientX - rect.left) / rect.width
    const ry = (e.clientY - rect.top) / rect.height
    const dx = (rx - 0.5) * -30
    const dy = (ry - 0.5) * -30
    el.style.setProperty('--ring-x', `${dx.toFixed(1)}px`)
    el.style.setProperty('--ring-y', `${dy.toFixed(1)}px`)
  }, [])

  return (
    <section className="hero" id="top" onMouseMove={handleMouseMove}>
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=85"
      >
        <source
          src="https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-shade" />
      <div className="hero-frame" aria-hidden="true">
        <div className="hero-left-pane" />
        <div className="hero-right-pane" ref={ringRef}>
          <span>
            CONTENT
            <br />
            MEETS
            <br />
            IMPACT
          </span>
        </div>
      </div>
      <div className="hero-content wrap">
        <p className="hero-index">01 — PORTFOLIO / 2026</p>
        <h1>
          <span>LI</span>
          <span>ZONG</span>
          <span>HENG</span>
        </h1>
        <div className="hero-info-card">
          <p className="eyebrow">AI CONTENT · OPERATION · EXPERIENCE</p>
          <p>
            让想法被看见，让体验被记住。
            <br />
            在内容、运营与现场执行的交界处，
            <br />
            将创意转化为可见的影响力。
          </p>
          <a href="#work">
            探索精选项目 <Arrow />
          </a>
        </div>
        <a className="round-link" href="#work">
          SCROLL <span>↓</span>
        </a>
      </div>
      <p className="side-note">
        LIZONGHENG / CREATIVE OPERATOR <span /> 2026
      </p>
    </section>
  )
}