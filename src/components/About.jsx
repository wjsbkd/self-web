import './About.css'
import { tools } from '@/data'
import Arrow from '@/components/Arrow.jsx'

// 关于我
export default function About() {
  return (
    <section className="about section wrap" id="about">
      <div className="section-kicker"><span>01</span> ABOUT ME</div>
      <div className="about-grid">
        <div className="profile-panel"><span className="profile-mark">LZH</span><div><p>2026 GRADUATE</p><b>吉林建筑大学</b><span>2022.09 — 2026.06</span></div><span className="profile-location">BASED IN<br />CHINA</span></div>
        <div className="about-copy">
          <p className="lead">我是李纵横，一名关注内容、人与体验的<span>AI 内容运营与视觉创作者</span>。</p>
          <p>从 AI 赛事到产品推广，从节目现场到城市晚会，我始终在创意与执行的交界处工作。擅长用内容建立连接，用结构化的方法推动事情发生。</p>
          <div className="contact-row"><a href="mailto:lizongheng2025@163.com">lizongheng2025@163.com <Arrow /></a><a href="tel:15087322631">150 8732 2631 <Arrow /></a></div>
          <div className="tool-list">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
        </div>
      </div>
      <div className="metrics">
        <div><b>3+</b><span>互联网 / 内容实习</span></div><div><b>270W+</b><span>单条最高播放</span></div><div><b>1000W+</b><span>内容累计播放</span></div><div><b>50+</b><span>直播切片产出</span></div>
      </div>
    </section>
  )
}
