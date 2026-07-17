import './Hero.css'
import Nav from '@/components/Nav.jsx'
import Arrow from '@/components/Arrow.jsx'

// 首屏：编辑式分屏构图
export default function Hero() {
  return (
    <section className="hero" id="top">
      <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=85">
        <source src="https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade" />
      <Nav />
      <div className="hero-frame" aria-hidden="true"><div className="hero-left-pane" /><div className="hero-right-pane"><span>CONTENT<br />MEETS<br />IMPACT</span></div></div>
      <div className="hero-content wrap">
        <p className="hero-index">01 — PORTFOLIO / 2026</p>
        <h1><span>LI</span><span>ZONG</span><span>HENG</span></h1>
        <div className="hero-info-card">
          <p className="eyebrow">AI CONTENT · OPERATION · EXPERIENCE</p>
          <p>让想法被看见，让体验被记住。<br />在内容、运营与现场执行的交界处，<br />将创意转化为可见的影响力。</p>
          <a href="#work">探索精选项目 <Arrow /></a>
        </div>
        <a className="round-link" href="#work">SCROLL <span>↓</span></a>
      </div>
      <p className="side-note">LIZONGHENG / CREATIVE OPERATOR <span /> 2026</p>
    </section>
  )
}
