import './Projects.css'
import { projects } from '@/data'
import Arrow from '@/components/Arrow.jsx'

// 精选项目
export default function Projects() {
  return (
    <section className="work section" id="work">
      <div className="wrap"><div className="section-kicker"><span>03</span> SELECTED WORK</div><div className="heading-row"><h2>把每一次投入，<br />变成<span>可见的回响。</span></h2><p>跨越内容、运营与线下体验<br />一些我参与并推进的项目。</p></div></div>
      <div className="project-list wrap">{projects.map((project) => <article className="project-card" key={project.index}><img src={project.image} alt="" /><div className="project-overlay" /><div className="project-head"><span>{project.index}</span><span>{project.subtitle}</span></div><div className="project-foot"><div><h3>{project.title}</h3><p><b>{project.stat}</b> {project.label}</p></div><a href={`#project-${project.index}`} aria-label={`查看${project.title}详情`}><Arrow /></a></div></article>)}</div>
      <div className="project-stories wrap">{projects.map((project) => <article className="project-story" id={`project-${project.index}`} key={project.title}><div className="story-title"><span>{project.index}</span><h3>{project.title}</h3><p>{project.subtitle}</p></div><div className="story-content"><p><b>项目背景</b>{project.background}</p><p><b>我的职责</b>{project.responsibility}</p><p><b>项目成果</b>{project.result}</p></div></article>)}</div>
    </section>
  )
}
