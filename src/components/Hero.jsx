import './Hero.css'
import Nav from '@/components/Nav.jsx'
import Arrow from '@/components/Arrow.jsx'

// 首屏：大标题 + 一句话介绍 + 行动入口
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
          <p className="eyebrow">AI 内容运营 · 视觉创作者 · 2026 应届</p>
          <p>我是李纵横，关注内容、人与体验的内容运营与视觉创作者。<br />从 AI 赛事到城市春晚，在创意与执行的交界处把想法变成可见的影响力。</p>
          <div className="hero-actions">
            <a href="#about">了解更多 <Arrow /></a>
            <a href="/assets/李纵横15087322631.pdf" target="_blank" className="hero-dl-btn">下载简历 PDF</a>
          </div>
        </div>
        <a className="round-link" href="#about">SCROLL <span>↓</span></a>
      </div>
      <p className="side-note">LIZONGHENG / CREATIVE OPERATOR <span /> 2026</p>
    </section>
  )
}
