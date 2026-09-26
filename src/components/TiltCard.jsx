import { useRef, useCallback } from 'react'

/**
 * TiltCard —— 3D 透视倾斜卡片（Apple 产品卡风格）
 * 包裹的卡片在光标悬停时基于光标位置做 3D 透视倾斜，
 * 离开时平滑回正。子元素可声明 data-tilt-depth 做视差浮起。
 *
 * 用法：
 *   <TiltCard max={6}><article className="project-card">...</article></TiltCard>
 *
 * props:
 *   max     最大倾斜角度（度），默认 6
 *   scale   悬停时缩放，默认 1.02
 *   glare   是否启用光泽扫过效果，默认 true
 */
export default function TiltCard({ children, max = 6, scale = 1.02, glare = true, className = '', ...rest }) {
  const ref = useRef(null)

  const onMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width // 0~1
      const py = (e.clientY - rect.top) / rect.height // 0~1
      // 以中心为原点，映射到 -max ~ max
      const rotX = (0.5 - py) * max * 2
      const rotY = (px - 0.5) * max * 2
      el.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale})`
      // 光泽位置
      if (glare) {
        el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
        el.style.setProperty('--glare-opacity', '1')
      }
    },
    [max, scale, glare]
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)'
    if (glare) el.style.setProperty('--glare-opacity', '0')
  }, [glare])

  return (
    <div
      ref={ref}
      className={`tilt-card${glare ? ' tilt-glare' : ''}${className ? ` ${className}` : ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </div>
  )
}
