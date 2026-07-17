import './Experience.css'
import { experiences } from '@/data'

// 工作经历
export default function Experience() {
  return (
    <section className="experience section wrap" id="experience">
      <div className="section-kicker"><span>02</span> EXPERIENCE</div>
      <div className="heading-row"><h2>在真实的现场，<br /><span>积累解决问题的能力。</span></h2><p>四段内容与产品运营实习<br />覆盖内容、活动、产品与用户增长。</p></div>
      <div className="experience-list">{experiences.map((item) => <article className="experience-item" key={item.company}><div className="experience-period">{item.period}</div><div className="experience-title"><p>{item.company}</p><h3>{item.role}</h3></div><div className="experience-detail"><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p>{item.text}</p></div></article>)}</div>
    </section>
  )
}
