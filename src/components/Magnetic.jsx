import { useRef, useCallback } from 'react'

/**
 * Magnetic —— 磁性跟随光标组件（苹果式微交互）
 * 包裹的元素在光标靠近时轻微跟随移动，离开时平滑回弹。
 *
 * 用法：
 *   <Magnetic><a className="btn">...</a></Magnetic>
 *   <Magnetic strength={0.4}>...</Magnetic>
 *
 * props:
 *   strength  跟随强度 0~1，默认 0.3
 *   radius    影响半径(px)，超出则不跟随，默认 120
 */
export default function Magnetic({ children, strength = 0.3, radius = 120, className = '', ...rest }) {
  const ref = useRef(null)

  const onMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        el.style.transform = 'translate3d(0,0,0)'
        el.classList.remove('is-tracking')
        return
      }
      const moveX = dx * strength
      const moveY = dy * strength
      // 跟手期间关掉 CSS 过渡（见 Nav.css .magnetic.is-tracking）：
      // 否则每帧写入的位移与 0.5s 过渡是两套时钟，元素明显滞后于光标。
      el.classList.add('is-tracking')
      el.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`
    },
    [strength, radius]
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (el) {
      el.style.transform = 'translate3d(0,0,0)'
      // 移除 is-tracking，0.5s 过渡接管，完成回弹
      el.classList.remove('is-tracking')
    }
  }, [])

  return (
    <span
      ref={ref}
      className={`magnetic${className ? ` ${className}` : ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </span>
  )
}
