import './Media.css'
import { mediaWorks } from '@/data'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'

// 媒体作品：视频/视觉网格 + 作品集 PDF 入口
export default function Media() {
  return (
    <section className="media section wrap" id="media">
      <SectionHeading num="04" kicker="MEDIA ARCHIVE">
        <h2>
          留给作品，
          <br />
          <span>更大的展示空间。</span>
        </h2>
        <p>
          视频与视觉案例的一手呈现
          <br />
          部分完整作品可在作品集 PDF 中查看。
        </p>
      </SectionHeading>
      <div className="media-grid">
        {mediaWorks.map((work) => (
          <article className={`media-card ${work.className}`} key={work.title}>
            <img src={work.cover} alt={work.title} />
            <div className="media-tint" />
            <div className="media-copy">
              <span>{work.type}</span>
              <h3>{work.title}</h3>
              <p>{work.note}</p>
              {work.link && (
                <a href={work.link} target="_blank" rel="noreferrer">
                  查看完整作品 <Arrow />
                </a>
              )}
            </div>
            {work.link && <span className="play-mark">↗</span>}
          </article>
        ))}
        {/* 完整作品集 PDF 入口 */}
        <article className="media-card media-portfolio">
          <div className="media-portfolio-inner">
            <span className="portfolio-icon">PDF</span>
            <div className="media-copy">
              <span>PORTFOLIO / FULL</span>
              <h3>完整作品集</h3>
              <p>策划 · 视频 · 视觉 · 全集</p>
              <a href="/assets/作品集.pdf" target="_blank" rel="noreferrer">
                在线查看 PDF <Arrow />
              </a>
            </div>
          </div>
        </article>
      </div>
      <div className="resource-bar">
        <div>
          <span>DOUYIN</span>
          <b>我将势不可挡</b>
        </div>
        <a href="https://v.douyin.com/k8afilJ0GOk/" target="_blank" rel="noreferrer">
          访问抖音主页 <Arrow />
        </a>
      </div>
    </section>
  )
}
