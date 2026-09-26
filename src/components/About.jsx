import './About.css'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import CountUpGroup from '@/components/CountUp.jsx'
import Reveal from '@/components/Reveal.jsx'
import { contactEmail, contactPhone, contactPhoneTel, contactWechat, resumePdf } from '@/data/nav.js'

export default function About() {
  return (
    <section className="about section wrap" id="about">
      <SectionHeading num="01" kicker="ABOUT ME" />
      <div className="about-links">
        <a href={`mailto:${contactEmail}`} aria-label={`发送邮件到 ${contactEmail}`}>
          {contactEmail} <Arrow />
        </a>
        <a href={`tel:${contactPhoneTel}`} aria-label={`拨打 ${contactPhone}`}>
          {contactPhone} <Arrow />
        </a>
        <a
          href={resumePdf}
          target="_blank"
          rel="noreferrer"
          download
          aria-label="下载李纵横简历 PDF"
        >
          下载简历 PDF <Arrow />
        </a>
        <span className="wechat-line">微信（同号）：{contactWechat}</span>
      </div>
      <Reveal className="about-copy">
        <p className="lead">
          我是李纵横，一名关注内容、人与体验的<span>AI 内容运营与视觉创作者</span>。
        </p>
        <p>
          从 AI 赛事到产品推广，从节目现场到城市晚会，我始终在创意与执行的交界处工作。
          擅长用内容建立连接，用结构化的方法推动事情发生。
        </p>
      </Reveal>

      <Reveal className="education-block">
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
              技能特长：Excel（数据透视表）、Word、PPT、Figma、CATIA、Revit、SketchUp、CAD，熟练使用 Openclaw、Claude Code 等 AI 工具
            </p>
          </div>
        </div>
      </Reveal>

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
