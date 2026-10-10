import { useEffect, useRef } from 'react'

/**
 * HeroDigits —— 数字点阵纹理（暗场语言的"数据感"装饰层，A5：纹理即隐喻）
 *
 * 一次性 canvas 绘制（mount / resize 各一次，无动画）：
 * - 等宽数字字符按网格排列（行列对齐，非有机撒落）
 * - alpha 沿两个维度调制：纵向向上渐密、向下衰减到 0；
 *   横向叠加 sin/cos 波带形成"条带形明暗块面"（halftone / dithering 质感）
 * - 亮度高于底色、低于光斑中心；只做氛围，不承载信息（aria-hidden）
 */
export default function HeroDigits() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.parentElement // .hero-canvas，与 hero 同尺寸
    if (!host) return

    const draw = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.font = "10px 'DM Mono', 'JetBrains Mono', monospace"
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'

      const cell = 21
      const glyphs = '05289'
      for (let y = cell; y < h * 0.72; y += cell) {
        // 纵向密度：顶部最密，向下平滑衰减，约 72% 视口高处归零
        const vy = 1 - y / (h * 0.72)
        for (let x = cell * 0.5; x < w; x += cell) {
          // 条带波：几个低频 sin 叠加，形成平缓的明暗块面（行列仍对齐）
          const band =
            0.5 +
            0.5 *
              Math.sin(x * 0.0035 + y * 0.016) *
              Math.cos(y * 0.011 - 1.1)
          // 第二轮提亮：0.15 → 0.34 基准，在亮彩光雾上仍清晰可辨
          const alpha = Math.max(0, Math.pow(vy, 1.5) * 0.34 * band)
          if (alpha < 0.02) continue
          ctx.fillStyle = `rgba(247, 242, 239, ${alpha.toFixed(3)})`
          ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y)
        }
      }
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])

  return <canvas className="hero-digits" ref={canvasRef} aria-hidden="true" />
}
