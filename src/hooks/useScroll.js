import { useEffect, useState } from 'react'

/**
 * 滚动进度 hook：返回页面整体滚动百分比（0 ~ 1）
 * 用于顶部进度条（Apple 风格极简指示器）
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}

/**
 * 滚动方向 hook：返回 'up' | 'down' 以及当前 scrollY
 * 用于导航栏在向下滚动时隐藏、向上滚动时显现（iOS 26 标签栏行为）
 */
export function useScrollDirection() {
  const [dir, setDir] = useState('up')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const threshold = 8 // 忽略微小抖动

    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 60)
      if (Math.abs(y - lastY) > threshold) {
        setDir(y > lastY ? 'down' : 'up')
        lastY = y
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return { dir, scrolled }
}

/**
 * 视差 hook：根据元素相对视口位置返回进度（-1 ~ 1，0 为元素中心与视口中心对齐）
 * 用于 Hero 多层视差，元素以不同速度移动创造深度感（苹果官网标志性效果）
 */
export function useParallax(ref, speed = 0.3) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      // 元素中心相对视口中心的偏移比例
      const offset = (rect.top + rect.height / 2 - viewportH / 2) / viewportH
      const translate = offset * speed * 100
      el.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref, speed])
}
