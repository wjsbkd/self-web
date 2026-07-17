import './Projects.css'
import { useState } from 'react'
import { projects } from '@/data'
import Arrow from '@/components/Arrow.jsx'

// 精选项目：卡片 + 点击单条展开详情
export default function Projects() {
  const [openIdx, setOpenIdx] = useState(-1)
  return (
    <section className="work section" id="work">
      <div className="wrap"><div className="section-kicker"><span>03</span> SELECTED WORK</div><div className="heading-row"><h2>把每一次投入，<br />变成<span>可见的回响。</span></h2><p>跨越内容、运营与线下体验<br />一些我参与并推进的项目。</p></div></div>
      <div className="project-list wrap">{projects.map((project, idx) => (
        <article className={`project-card${idx === openIdx ? ' active' : ''}`} key={project.index} onClick={() => setOpenIdx(idx === openIdx ? -1 : idx)}>
          <img src={project.image} alt="" />
          <div className="project-overlay" />
          <div className="project-head"><span>{project.index}</span><span>{project.subtitle}</span></div>
          <div className="project-foot"><div><h3>{project.title}</h3><p><b>{project.stat}</b> {project.label}</p></div><span className="project-toggle">{idx === openIdx ? '−' : '+'}</span></div>
        </article>
      ))}</div>
      {openIdx >= 0 && (
        <div className="project-stories wrap">
          <article className="project-story expanded-story" id={`project-${projects[openIdx].index}`}>
            <div className="story-title"><span>{projects[openIdx].index}</span><h3>{projects[openIdx].title}</h3><p>{projects[openIdx].subtitle}</p></div>
            <div className="story-content"><p><b>项目背景</b>{projects[openIdx].background}</p><p><b>我的职责</b>{projects[openIdx].responsibility}</p><p><b>项目成果</b>{projects[openIdx].result}</p></div>
          </article>
        </div>
      )}
    </section>
  )
}
