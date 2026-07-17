import './Media.css'
import { mediaWorks } from '@/data'
import Arrow from '@/components/Arrow.jsx'

// 媒体作品
export default function Media() {
  return (
    <section className="media section wrap" id="media">
      <div className="section-kicker"><span>04</span> MEDIA ARCHIVE</div>
      <div className="heading-row"><h2>留给作品，<br /><span>更大的展示空间。</span></h2><p>视频可点击播放，图片可承载项目现场、<br />海报、空间设计与过程记录。</p></div>
      <div className="media-grid">{mediaWorks.map((work) => <article className={`media-card ${work.className}`} key={work.title}><img src={work.cover} alt={work.title} /><div className="media-tint" /><div className="media-copy"><span>{work.type}</span><h3>{work.title}</h3><p>{work.note}</p>{work.link && <a href={work.link} target="_blank" rel="noreferrer">查看完整作品 <Arrow /></a>}</div>{work.link && <span className="play-mark">↗</span>}</article>)}</div>
      <div className="resource-bar"><div><span>DOUYIN</span><b>我将势不可挡</b></div><a href="https://v.douyin.com/k8afilJ0GOk/" target="_blank" rel="noreferrer">访问抖音主页 <Arrow /></a></div>
      <p className="media-help">视频作品通过百度网盘外链提供完整观看；后续可将 MP4 文件加入 <code>public/works/</code>，替换为站内播放器。</p>
    </section>
  )
}
