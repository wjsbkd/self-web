import { useRef, useEffect, useCallback } from 'react'
import './VideoRail.css'

/**
 * VideoRail —— Apple 风格横向滚动视频轨道
 * 参考 Apple Store / Newsroom 的视频展示方式：
 * - 卡片横向排列，默认自动向左循环滚动（无缝）
 * - 鼠标悬停时暂停自动滚动，可用左右箭头手动浏览
 * - 两侧渐变提示可滚动
 * - 悬停时卡片微抬升、海报放大
 * - 点击卡片触发 onSelect，由父级打开播放弹窗
 *
 * props:
 *   items    视频数据数组 { title, note, cover, videoSrc? }
 *   onSelect 点击卡片回调
 */
export default function VideoRail({ items, onSelect }) {
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const pausedRef = useRef(false)
  const loopWidthRef = useRef(0)
  // 自动滚动速度（px / 帧 @60fps ≈ 45px/s）
  const speedRef = useRef(0.75)

  // 测量「一组原始卡片」的宽度 = 首张克隆卡相对首卡的偏移
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const kids = track.children
    if (kids.length > items.length) {
      loopWidthRef.current =
        kids[items.length].offsetLeft - kids[0].offsetLeft
    }
  }, [items.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    measure()

    // 延迟再测一次，确保图片加载后布局稳定
    const timer = setTimeout(measure, 800)

    const onResize = () => measure()
    window.addEventListener('resize', onResize)

    // 尊重「减少动态效果」系统偏好：不启动自动循环滚动，
    // 仍可手动通过左右箭头 / 拖拽浏览（卡片入场动画另由 CSS 控制）
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 自动滚动始终运行（卡片入场动画仍受 CSS 的 prefers-reduced-motion 控制）
    const tick = () => {
      if (!pausedRef.current) {
        let next = track.scrollLeft + speedRef.current
        if (loopWidthRef.current > 0 && next >= loopWidthRef.current) {
          next -= loopWidthRef.current // 无缝回环
        }
        track.scrollLeft = next
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    if (!reduceMotion) {
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [measure])

  const pause = useCallback(() => {
    pausedRef.current = true
  }, [])
  const resume = useCallback(() => {
    pausedRef.current = false
  }, [])

  const scrollBy = (direction) => {
    const track = trackRef.current
    if (!track) return
    const cardWidth =
      track.querySelector('.video-rail-card')?.offsetWidth || 340
    track.scrollBy({
      left: direction * (cardWidth + 18),
      behavior: 'smooth',
    })
  }

  // 双份数组：用于无缝循环（第一组滑出时第二组正好接上）
  const duplicated = [...items, ...items]

  return (
    <div
      className="video-rail"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <button
        className="video-rail-btn prev"
        onClick={() => scrollBy(-1)}
        aria-label="向左滚动"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <div className="video-rail-frame">
        <div className="video-rail-track" ref={trackRef}>
          {duplicated.map((item, i) => (
            <article
              className="video-rail-card"
              key={`${item.title}-${i}`}
              onClick={() => onSelect && onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && onSelect && onSelect(item)
              }
              aria-label={`预览 ${item.title}`}
              style={{ '--rail-delay': `${i * 0.06}s` }}
            >
              <div className="video-rail-poster">
                <img src={item.cover} alt={item.title} loading="lazy" />
                <div className="video-rail-play">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="video-rail-info">
                <span>
                  {item.type || `VIDEO / ${String((i % items.length) + 1).padStart(2, '0')}`}
                </span>
                <h4>{item.title}</h4>
                <p>{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        className="video-rail-btn next"
        onClick={() => scrollBy(1)}
        aria-label="向右滚动"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  )
}
