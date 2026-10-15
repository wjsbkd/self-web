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
