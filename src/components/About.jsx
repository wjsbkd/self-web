import './About.css'
import { tools } from '@/data'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import CountUpGroup from '@/components/CountUp.jsx'

export default function About() {
  return (
    <section className="about section wrap" id="about">
      <SectionHeading num="01" kicker="ABOUT ME" />
      <div className="about-links">
        <a href="mailto:lizongheng2025@163.com" aria-label="发送邮件到 lizongheng2025@163.com">
          lizongheng2025@163.com <Arrow />
        </a>
        <a href="tel:+8615087322631" aria-label="拨打 150 8732 2631">
          150 8732 2631 <Arrow />
        </a>
        <a
          href="/assets/李纵横15087322631.pdf"
          target="_blank"
          rel="noreferrer"
          download
          aria-label="下载李纵横简历 PDF"
        >
          下载简历 PDF <Arrow />
        </a>
        <span className="wechat-line">微信（同号）：15087322631</span>
      </div>
      <div className="about-copy">
        <p className="lead">
          我是李纵横，一名关注内容、人与体验的<span>AI 内容运营与视觉创作者</span>。
        </p>
        <p>
          从 AI 赛事到产品推广，从节目现场到城市晚会，我始终在创意与执行的交界处工作。
          擅长用内容建立连接，用结构化的方法推动事情发生。
        </p>
      </div>

      {/* 个人优势 */}
      <div className="advantages-section">
        <h3 className="advantages-heading">个人优势</h3>
        <div className="advantages-list">
          {tools.map((tool) => (
            <div key={tool.name} className="advantage-item">
              <span className="advantage-name">{tool.name}</span>
              <p className="advantage-desc">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="campus-block">
        <div className="campus-grid">
          <div>
            <p className="campus-number">
              20,000<span>+</span>
            </p>
            <p>校运会宣传线上、线下观看</p>
          </div>
          <div>
            <h3>校园宣传与跨部门协同</h3>
            <p>
              参与校运会宣传，通过公众号推送与校内传播扩大活动触达；开学期间参与校刊制作，
              以板报和推文配合发行，完成从内容制作到线下落地的闭环。
            </p>
          </div>
          <div className="campus-tags">
            <span>公众号运营</span>
            <span>校刊制作</span>
            <span>活动宣传</span>
            <span>跨部门沟通</span>
          </div>
        </div>
      </div>

      <div className="education-block">
        <div className="education-grid">
          <div className="education-period">
            <p>2022.09 — 2026.06</p>
          </div>
          <div className="education-detail">
            <h3>吉林建筑大学</h3>
            <p className="education-sub">
              记者团宣传部干事 · 2026年应届生
            </p>
            <p className="education-skills">
              技能特长：精通 Excel（数据透视表）、Word、ppt、Ps、CATIA、Revit、SketchUp和CAD
            </p>
          </div>
        </div>
      </div>

      <CountUpGroup className="metrics">
        <div>
          <CountUpGroup.Item target={3} suffix="+" />
          <span>互联网 / 内容实习</span>
        </div>
        <div>
          <CountUpGroup.Item target={270} suffix="W+" />
          <span>单条最高播放</span>
        </div>
        <div>
          <CountUpGroup.Item target={1000} suffix="W+" />
          <span>内容累计播放</span>
        </div>
        <div>
          <CountUpGroup.Item target={50} suffix="+" />
          <span>直播切片产出</span>
        </div>
      </CountUpGroup>
    </section>
  )
}
