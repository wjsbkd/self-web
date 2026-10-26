import { useState } from 'react'
import './Projects.css'
import { useProjects } from '@/data/hooks'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'

/** 跳转到作品详情页（hash 路由，兼容静态托管） */
function navigateToProject(slug) {
  window.location.hash = `#/project/${slug}`
}

/**
 * Projects —— Master-Detail 悬停展示
 *
 * 交互模式：
 * - 上方：三张紧凑概览卡，永远不变
 * - 下方：详情面板，hover 哪张卡 → 显示该卡的完整图文（左图右文）
 * - 无 hover 时下方不显示任何内容
 *
 * 2026-10-26 Sanity 接入：
 * - 数据改为从统一接口 getProjects() 获取（含本地兜底），组件结构不变。
 * - 概览卡可点击进入详情页（hash 路由 #/project/:slug）。
 * - 封面支持图片/视频：video 类型时详情面板左图换成 video 首屏帧。
 */
export default function Projects() {
  const [activeId, setActiveId] = useState(null)
  const [lockedId, setLockedId] = useState(null)
  const { data } = useProjects()
  const projects = data?.projects ?? []

  const activeIdResolved = lockedId ?? activeId
  const active = projects.find((p) => p.id === activeIdResolved)

  const goDetail = (slug) => {
    navigateToProject(slug)
  }

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
        {projects.length === 0 ? (
          <p className="projects-empty">暂无已发布作品</p>
        ) : (
          projects.map((project) => (
            <article
              className={`project-index-card${activeIdResolved === project.id ? ' active' : ''}`}
              key={project.id}
              onMouseEnter={() => setActiveId(project.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(project.id)}
              onBlur={() => setActiveId(null)}
              onClick={() => setLockedId((id) => (id === project.id ? null : project.id))}
              onDoubleClick={() => goDetail(project.slug)}
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
          ))
        )}
      </Reveal>

      {/* ── 下方：详情面板（hover / 聚焦 / 锁定时显示）── */}
      {active && (
        <Reveal className="project-detail-panel wrap" once>
          <div className="detail-showcase" key={active.id}>
            {/* 左图 / 左视频 */}
            <div className="detail-visual">
              {active.coverType === 'video' && active.cover.videoUrl ? (
                <video src={active.cover.videoUrl} poster={active.poster} muted loop controls preload="metadata" />
              ) : (
                <img src={active.image} alt={active.alt} loading="lazy" />
              )}
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
                {active.responsibility && (
                  <div className="detail-block">
                    <b>我的职责</b>
                    <p>{active.responsibility}</p>
                  </div>
                )}
                {active.result && (
                  <div className="detail-block">
                    <b>项目成果</b>
                    <p>{active.result}</p>
                  </div>
                )}
              </div>

              {/* 原设计的数据标签位（stat + label），后台没填就不占位 */}
              {(active.stat || active.label) && (
                <div className="feature-stat">
                  <b>{active.stat}</b>
                  <span>{active.label}</span>
                </div>
              )}

              {/* 新增入口：进入详情页（原设计没有独立详情页，这枚链接是新能力） */}
              <button type="button" className="detail-more" onClick={() => goDetail(active.slug)}>
                查看完整详情 →
              </button>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
