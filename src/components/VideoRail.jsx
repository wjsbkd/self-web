import { useRef, useEffect, useCallback, useMemo, useState } from 'react'
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
  const rootRef = useRef(null)
  const rafRef = useRef(null)
  // 悬停暂停 与 用户手动暂停 是两件事：前者是交互反馈，后者是用户明确关掉自动滚动。
  // 两个都存 ref：tick 每帧读 ref，避免悬停时触发 React 重渲染。
  const hoveredRef = useRef(false)
  const userPausedRef = useRef(false)
  const loopWidthRef = useRef(0)
  // 自动滚动速度（px / 帧 @60fps ≈ 45px/s）
  const speedRef = useRef(0.75)

  // 尊重「减少动态效果」系统偏好：reduce-motion 下默认不自动滚动，但保留显式开关。
  // 本机 Windows 的「动画效果」关闭（MinAnimate=0）会传导为 reduce-motion，
  // 原先只靠 if (!reduceMotion) 静默不启动，用户完全看不出功能存在。
  // 自动滚动属 WCAG 2.2.2「会动的内容」，必须可暂停 —— 开关始终可见。
  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )
  // 悬停暂停用 ref（每帧读、不触发渲染）；用户开关用 state（要驱动图标与 aria）
  const [userPaused, setUserPaused] = useState(reduceMotion)
  const autoplay = !userPaused
  // state → ref 同步：让 tick 的每帧判断与渲染层的 autoplay 永远一致
  useEffect(() => {
    userPausedRef.current = userPaused
  }, [userPaused])

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

    const tick = () => {
      // 两个都是 ref：每帧读不触发 React 重渲染（悬停时不会重渲 22 张卡）
      if (!hoveredRef.current && !userPausedRef.current) {
        let next = track.scrollLeft + speedRef.current
        if (loopWidthRef.current > 0 && next >= loopWidthRef.current) {
          next -= loopWidthRef.current // 无缝回环
        }
        track.scrollLeft = next
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    // tick 始终运行（内部判停），这样用户点「播放」能立刻恢复，无需重挂 effect；
    // 隐藏标签页时浏览器本就会节流 rAF。
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [measure])

  const pause = useCallback(() => {
    hoveredRef.current = true
  }, [])
  const resume = useCallback(() => {
    hoveredRef.current = false
  }, [])

  // 显式播放/暂停开关（reduce-motion 用户的唯一入口）
  const togglePlay = () => {
    const next = !userPaused
    setUserPaused(next)
    if (!next) {
      // 从暂停恢复时，若因窗口缩小导致 loopWidth 失真，重测一次避免回环跳变
      measure()
    }
  }

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

  // 入场交错只在轨道首次进入视口时播放一次。
  // 原先纯 CSS 动画在组件挂载时就播完，而轨道在首屏之下 6000px+，
  // 用户滚到时看到的永远是终态 —— 交错实际从未被看见。
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let revealObs = null
    const onScroll = () => {
      if (root.getBoundingClientRect().top < window.innerHeight) reveal()
    }
    const reveal = () => {
      if (root.classList.contains('is-in')) return
      root.classList.add('is-in')
      if (revealObs) {
        revealObs.disconnect()
        revealObs = null
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // 已在视口内（含刷新后浏览器恢复了滚动位置）直接放行，不等回调
    if (root.getBoundingClientRect().top < window.innerHeight) {
      reveal()
      return
    }
    // 兜底用 scroll/resize 而非只靠 IntersectionObserver：
    // 后者在标签页不可见时不会触发，用户切回来时可能一直停在隐藏态。
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    revealObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal()
      },
      { rootMargin: '0px 0px -12% 0px' }
    )
    revealObs.observe(root)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (revealObs) revealObs.disconnect()
    }
  }, [])

  // 双份数组：用于无缝循环（第一组滑出时第二组正好接上）
  const duplicated = [...items, ...items]

  return (
    <div
      className="video-rail"
      ref={rootRef}
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

      {/* 自动滚动开关：reduce-motion 环境下自动滚动不启动，
          这个按钮是用户唯一的显式入口（否则看起来像功能坏了） */}
      <button
        className="video-rail-play-toggle"
        onClick={togglePlay}
        aria-pressed={autoplay}
        aria-label={autoplay ? '暂停自动滚动' : '开始自动滚动'}
        title={autoplay ? '暂停自动滚动' : '开始自动滚动'}
      >
        {autoplay ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  )
}
