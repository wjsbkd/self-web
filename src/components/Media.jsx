import './Media.css'
import { mediaWorks } from '@/data'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'

const douyinStats = [
  { label: '个播作品最高播放', value: '270W+' },
  { label: '单条最高点赞', value: '1000W+' },
  { label: '系列作品总播放', value: '多个千万+' },
]

const videoLinks = [
  {
    title: '虎扑视频',
    desc: '赛事内容宣发系列',
    href: 'https://pan.baidu.com/s/1NomoUr0vdeqmg_oDqpOPKA?pwd=fyq7',
    pwd: '提取码: fyq7',
  },
  {
    title: '阿里云栖大会宣传视频',
    desc: 'AI产品出海实战活动',
    href: 'https://pan.baidu.com/s/1eWKSfh2euADVhJZV-MOhTQ?pwd=vk6p',
    pwd: '提取码: vk6p',
  },
  {
    title: '飞书AI训练营宣传视频',
    desc: 'AI活动内容策划与制作',
    href: 'https://pan.baidu.com/s/1rnzd1Vm0GD_xrV9fuz-Uyw?pwd=mwcy',
    pwd: '提取码: mwcy',
  },
  {
    title: '阿里云栖大会总结视频',
    desc: '大会宣发与复盘表达',
    href: 'https://pan.baidu.com/s/1TmTO_seRjggh4u1xG55xNA?pwd=xxx4',
    pwd: '提取码: xxx4',
  },
  {
    title: '百度秒哒直播切片',
    desc: '平台直播内容分发',
    href: 'https://pan.baidu.com/s/1lP5zO8VlOLsSLGnOIia8Qg?pwd=c8st',
    pwd: '提取码: c8st',
  },
  {
    title: '阿里万相活动视频',
    desc: 'AI活动创意内容制作',
    href: 'https://pan.baidu.com/s/1KhAvAlJgoEWjBEiio9Fv7g?pwd=hn42',
    pwd: '提取码: hn42',
  },
  {
    title: '阿里万相直播切片',
    desc: 'AI直播精彩片段',
    href: 'https://pan.baidu.com/s/1hHiJn78qtUY4rNuKnw2Rsw?pwd=rniu',
    pwd: '提取码: rniu',
  },
  {
    title: '直播切片合集',
    desc: '多平台直播内容',
    href: 'https://pan.baidu.com/s/1Y2GuXraC54ibVII3gNGVlA?pwd=d3wg',
    pwd: '提取码: d3wg',
  },
  {
    title: '视频剪辑加调色',
    desc: 'DaVinci Resolve 后期制作',
    href: 'https://pan.baidu.com/s/1lP5zO8VlOLsSLGnOIia8Qg?pwd=c8st',
    pwd: '提取码: c8st',
  },
  {
    title: '动漫混剪',
    desc: '创意剪辑作品',
    href: 'https://pan.baidu.com/s/1lP5zO8VlOLsSLGnOIia8Qg?pwd=c8st',
    pwd: '提取码: c8st',
  },
  {
    title: 'AI工作流分享视频',
    desc: '海辛&阿文AI创作经验',
    href: 'https://pan.baidu.com/s/1rnzd1Vm0GD_xrV9fuz-Uyw?pwd=mwcy',
    pwd: '提取码: mwcy',
  },
]

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
            <p className="account-name">抖音名称：我将势不可挡</p>
            <p className="account-link">主页链接：</p>
            <a
              className="account-url"
              href="https://v.douyin.com/k8afilJ0GOk/"
              target="_blank"
              rel="noreferrer"
            >
              https://v.douyin.com/k8afilJ0GOk/
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
          <b>我将势不可挡</b>
        </div>
        <a href="https://v.douyin.com/k8afilJ0GOk/" target="_blank" rel="noreferrer">
          访问抖音主页 <Arrow />
        </a>
      </div>
    </section>
  )
}
