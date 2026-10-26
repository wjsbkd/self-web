import { useState, useEffect } from 'react'
import './ProjectDetail.css'
import { useProjectDetail } from '@/data/hooks'
import { PortableText } from '@portabletext/react'
import WorkModal from '@/components/WorkModal.jsx'

/**
 * ProjectDetail —— 作品详情页（hash 路由 #/project/:slug）
 *
 * 需求里「作品详情页支持多个媒体模块」是现有站没有的页面，这里新建。
 * 设计原则（不破坏现有视觉 / 动画 / 移动端布局）：
 * - 复用 global.css 的 Design Token（--rim-* / --void-* / --paper 等），
 *   不在本文件重新定义一套颜色。
 * - 沿用 Master-Detail 的「左图右文」双栏语言，桌面端左媒体右文案，移动端上下堆叠。
 * - 富文本(description)用 @portabletext/react 渲染，块级样式走 ProjectDetail.css。
 * - 封面 video 自动播放受浏览器限制：静音 + 不强制 autoplay，由控件控制。
 * - 404 兜底：slug 不在已发布列表里 → 显示「作品不存在」+ 返回首页。
 *
 * ⚠️ 本页是整屏覆盖式（fixed），用 portal 到 body，避免被 .section-rim 的 z-index 压住。
 */
export default function ProjectDetail({ slug, onClose }) {
  const { data: project, loading, reload } = useProjectDetail(slug)
  const [modal, setModal] = useState(null)

  // Esc 关闭
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // data 初值来自本地兜底；只有「加载完成仍为 null」才是真的不存在
  if (!project) {
    return (
      <div className="project-detail" role="dialog" aria-modal="true">
        <div className="detail-inner wrap">
          {loading ? (
            <p className="detail-loading">加载中…</p>
          ) : (
            <NotFound onClose={onClose} onRetry={reload} />
          )}
        </div>
      </div>
    )
  }
  const isVideoCover = project.coverType === 'video'

  return (
    <div className="project-detail" role="dialog" aria-modal="true">
      <div className="detail-inner wrap">
        <button className="detail-close" onClick={onClose} aria-label="返回首页">
          <span />
          <span />
        </button>

        <header className="detail-header">
          <span className="detail-kicker">
            {project.year}
            {project.category?.title ? ` · ${project.category.title}` : ''}
          </span>
          <h1 className="detail-title">{project.title}</h1>
          {project.summary && <p className="detail-summary">{project.summary}</p>}
          {project.featured && <span className="detail-featured">★ 精选作品</span>}
        </header>

        {/* 封面：图片或视频 */}
        <div className="detail-cover">
          {isVideoCover && project.cover.videoUrl ? (
            <video
              src={project.cover.videoUrl}
              poster={project.poster}
              controls
              muted={project.cover.muted}
              loop={project.cover.loop}
              autoPlay={project.cover.muted && project.cover.autoplay}
              playsInline
              preload="metadata"
            />
          ) : (
            <img src={project.image} alt={project.alt} />
          )}
        </div>

        {/* 详情文案：Portable Text 优先；没有富文本时按现有三段式（背景/职责/成果）铺开 */}
        <div className="detail-body-text">
          {project.description && project.description.length > 0 ? (
            <PortableText value={project.description} components={portableComponents} />
          ) : (
            <>
              {/* 背景与摘要同文时不重复铺两遍（本地数据就是这样） */}
              {project.background && project.background !== project.summary && (
                <div className="detail-block">
                  <b>项目背景</b>
                  <p>{project.background}</p>
                </div>
              )}
              {project.responsibility && (
                <div className="detail-block">
                  <b>我的职责</b>
                  <p>{project.responsibility}</p>
                </div>
              )}
              {project.result && (
                <div className="detail-block">
                  <b>项目成果</b>
                  <p>{project.result}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 媒体模块（可排序） */}
        {project.media && project.media.length > 0 && (
          <div className="detail-modules">
            {project.media.map((mod, i) => (
              <MediaModuleView key={i} mod={mod} onOpen={setModal} />
            ))}
          </div>
        )}
      </div>

      <WorkModal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        type={modal?.type ?? 'image'}
        item={modal?.item ?? null}
      />
    </div>
  )
}

/** 单个媒体模块渲染 */
function MediaModuleView({ mod, onOpen }) {
  switch (mod.moduleType) {
    case 'image':
      return (
        <figure className="module module--image">
          <img src={mod.image} alt={mod.alt ?? ''} loading="lazy" />
          {mod.caption && <figcaption>{mod.caption}</figcaption>}
        </figure>
      )
    case 'gallery':
      return (
        <div className="module module--gallery">
          {mod.gallery?.map((g, i) => (
            <img key={i} src={g} alt={`画廊 ${i + 1}`} loading="lazy" onClick={() => onOpen({ type: 'image', item: { title: mod.caption ?? '', image: g, description: '' } })} />
          ))}
        </div>
      )
    case 'video':
      return (
        <figure className="module module--video">
          {mod.videoUrl ? (
            <video src={mod.videoUrl} poster={mod.poster} controls muted={mod.muted} loop={mod.loop} playsInline preload="metadata" />
          ) : (
            <img src={mod.poster} alt="" />
          )}
        </figure>
      )
    case 'imageText':
      return (
        <div className="module module--image-text">
          <img src={mod.image} alt="" loading="lazy" />
          <div>
            {mod.imageTextTitle && <h3>{mod.imageTextTitle}</h3>}
            {mod.imageTextBody && <p>{mod.imageTextBody}</p>}
          </div>
        </div>
      )
    default:
      return null
  }
}

/** 404 状态（附「重试」：网络失败时不必手动刷新整页） */
function NotFound({ onClose, onRetry }) {
  return (
    <div className="detail-notfound">
      <h2>作品不存在</h2>
      <p>这件作品可能尚未发布，或链接已失效。</p>
      <button className="pill" onClick={onRetry}>
        重新加载
      </button>
      <button className="pill pill--ghost" onClick={onClose}>
        返回首页
      </button>
    </div>
  )
}

/** Portable Text 渲染配置（与全局文字色阶保持一致） */
const portableComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h3>{children}</h3>,
    h3: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    ),
  },
}
