import { useState } from 'react'
import './Projects.css'
import { projects } from '@/data'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'

/**
 * Projects —— Master-Detail 悬停展示
 *
 * 交互模式：
 * - 上方：三张紧凑概览卡，永远不变
 * - 下方：详情面板，hover 哪张卡 → 显示该卡的完整图文（左图右文）
 * - 无 hover 时下方不显示任何内容
 */
export default function Projects() {
  const [activeId, setActiveId] = useState(null)
  // 锁定的项目：在触屏 / 键盘场景下点击卡片可"锁定"详情，
  // 使面板在鼠标移出或失焦后仍保持显示，再次点击解锁。
  const [lockedId, setLockedId] = useState(null)

  // 显示优先级：锁定 > 悬停 / 聚焦
  const activeIdResolved = lockedId ?? activeId
  const active = projects.find((p) => p.index === activeIdResolved)

  return (
    <section className="work section" id="work">
      <div className="section-rim" aria-hidden="true" />
      <div className="wrap">
        <SectionHeading num="04" kicker="SELECTED WORK">
          <h2>
            把每一次投入，
            <br />
            变成<span>可见的回响。</span>
          </h2>
          <p>
            跨越内容、运营与线下体验
            <br />
            一些我参与并推进的项目。
          </p>
        </SectionHeading>
      </div>

      {/* ── 上方：三张概览卡（hover / 聚焦 / 点击 均可触发下方详情）── */}
      <Reveal className="project-grid wrap" stagger={0.08} once>
        {projects.map((project) => (
          <article
            className={`project-index-card${activeIdResolved === project.index ? ' active' : ''}`}
            key={project.index}
            onMouseEnter={() => setActiveId(project.index)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(project.index)}
            onBlur={() => setActiveId(null)}
            onClick={() =>
              setLockedId((id) => (id === project.index ? null : project.index))
            }
            role="button"
            tabIndex={0}
            aria-label={`查看 ${project.title} 详情`}
          >
            <div className="card-compact-top">
              <span className="project-index-num">{project.index}</span>
              <span className="project-index-tag">{project.subtitle}</span>
            </div>
            <h3 className="project-index-title">{project.title}</h3>
            <div className="project-index-stat">
              <span className="project-index-value">{project.stat}</span>
              <span className="project-index-label">{project.label}</span>
            </div>
          </article>
        ))}
      </Reveal>

      {/* ── 下方：详情面板（hover / 聚焦 / 锁定时显示）── */}
      {active && (
        <Reveal className="project-detail-panel wrap" once>
          <div className="detail-showcase" key={active.index}>
          {/* 左图 */}
          <div className="detail-visual">
            <img src={active.image} alt={active.title} loading="lazy" />
          </div>

          {/* 右文 */}
          <div className="detail-body">
            <span className="feature-kicker">{active.subtitle}</span>
            <h3 className="feature-title">{active.title}</h3>

            <div className="expand-details">
              <div className="detail-block">
                <b>项目背景</b>
                <p>{active.background}</p>
              </div>
              <div className="detail-block">
                <b>我的职责</b>
                <p>{active.responsibility}</p>
              </div>
              <div className="detail-block">
                <b>项目成果</b>
                <p>{active.result}</p>
              </div>
            </div>

            <div className="feature-stat">
              <b>{active.stat}</b>
              <span>{active.label}</span>
            </div>
          </div>
        </div>
      </Reveal>
      )}
    </section>
  )
}
