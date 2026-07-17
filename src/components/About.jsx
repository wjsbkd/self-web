import './About.css'
import { tools } from '@/data'
import Arrow from '@/components/Arrow.jsx'

// 关于我：整合校园实践 + 照片占位 + 突出联系 + 简历下载
export default function About() {
  return (
    <section className="about section wrap" id="about">
      <div className="section-kicker"><span>01</span> ABOUT ME</div>
      <div className="about-grid">
        <div className="about-left">
          {/* 照片占位区 */}
          <div className="portrait">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85" alt="" />
            <span>LIZONGHENG</span>
          </div>
          {/* 联系信息突出展示 */}
          <div className="about-contact-big">
            <a href="mailto:lizongheng2025@163.com">lizongheng2025@163.com <Arrow /></a>
            <a href="tel:15087322631">150 8732 2631 <Arrow /></a>
            <a className="dl-btn" href="/assets/李纵横15087322631.pdf" target="_blank">下载简历 PDF <Arrow /></a>
          </div>
        </div>
        <div className="about-copy">
          <p className="lead">我是李纵横，一名关注内容、人与体验的<span>AI 内容运营与视觉创作者</span>。</p>
          <p>从 AI 赛事到产品推广，从节目现场到城市晚会，我始终在创意与执行的交界处工作。擅长用内容建立连接，用结构化的方法推动事情发生。</p>
          <div className="tool-list">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
        </div>
      </div>
      {/* 校园实践整合 */}
      <div className="campus-block">
        <div className="campus-grid">
          <div><p className="campus-number">20,000<span>+</span></p><p>校运会宣传线上、线下观看</p></div>
          <div><h3>校园宣传与跨部门协同</h3><p>参与校运会宣传，通过公众号推送与校内传播扩大活动触达；开学期间参与校刊制作，以板报和推文配合发行，完成从内容制作到线下落地的闭环。</p></div>
          <div className="campus-tags"><span>公众号运营</span><span>校刊制作</span><span>活动宣传</span><span>跨部门沟通</span></div>
        </div>
      </div>
      <div className="metrics">
        <div><b>3+</b><span>互联网 / 内容实习</span></div><div><b>270W+</b><span>单条最高播放</span></div><div><b>1000W+</b><span>内容累计播放</span></div><div><b>50+</b><span>直播切片产出</span></div>
      </div>
    </section>
  )
}
