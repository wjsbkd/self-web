import { useEffect, useRef } from 'react'

/**
 * CursorGlow —— 光标氛围光晕（Claude 氛围感）
 * 一个跟随光标的暖色径向光晕，增强而非替换原生光标。
 * 触屏设备自动禁用；尊重 prefers-reduced-motion。
 *
 * 效果：光标移动时，一抹陶土橙柔光如"提灯"般跟随，
 * 在亮调羊皮纸背景上营造 Claude 式的温润氛围。
 */
export default function CursorGlow() {
  const dotRef = useRef(null) // 内层小点（瞬时跟随）
  const ringRef = useRef(null) // 外层光晕（缓动跟随，营造拖尾）

  useEffect(() => {
    // 触屏设备 / 减少动效：不渲染
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0
    let visible = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      // 内层点瞬时贴合
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    // 外层环缓动追赶（Claude 式"沉思"拖尾）
    const loop = () => {
      raf = requestAnimationFrame(loop)
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
    }
    loop()

    // 进入/离开窗口时淡入淡出
    const onEnter = () => {
      visible = true
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="cursor-glow" aria-hidden="true">
      <div className="cursor-glow-ring" ref={ringRef} />
      <div className="cursor-glow-dot" ref={dotRef} />
    </div>
  )
}
