import './Media.css'
import { mediaWorks } from '@/data'
import { douyinStats, douyinProfile, videoLinks } from '@/data/mediaLinks.js'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'

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
          部分完整作品可通过下方链接查看。
        </p>
      </SectionHeading>

      <div className="media-grid">
        {mediaWorks.map((work) => (
          <article className={`media-card ${work.className}`} key={work.title}>
            <img src={work.cover} alt={work.title} loading="lazy" />
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

      {/* 运营账号 */}
      <div className="account-section">
        <h3 className="account-title">
          <span className="account-icon">📱</span>
          运营账号
        </h3>
        <div className="account-content">
          <div className="account-info">
            <p className="account-name">抖音名称：{douyinProfile.name}</p>
            <p className="account-link">主页链接：</p>
            <a
              className="account-url"
              href={douyinProfile.url}
              target="_blank"
              rel="noreferrer"
            >
              {douyinProfile.url}
            </a>
          </div>
          <div className="account-stats">
            {douyinStats.map((s) => (
              <div key={s.label} className="stat-item">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 视频链接 */}
      <div className="video-links-section">
        <h3 className="video-links-title">
          <span className="account-icon">📹</span>
          视频链接
        </h3>
        <div className="video-links-grid">
          {videoLinks.map((v) => (
            <div key={v.title} className="video-link-card">
              <h4>{v.title}</h4>
              <p className="video-link-desc">{v.desc}</p>
              <a href={v.href} target="_blank" rel="noreferrer" className="video-link-a">
                {v.href}
              </a>
              <p className="video-link-pwd">{v.pwd}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="resource-bar">
        <div>
          <span>DOUYIN</span>
          <b>{douyinProfile.name}</b>
        </div>
        <a href={douyinProfile.url} target="_blank" rel="noreferrer">
          访问抖音主页 <Arrow />
        </a>
      </div>
    </section>
  )
}
