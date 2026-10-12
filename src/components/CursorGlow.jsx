import { useEffect, useRef } from 'react'

/**
 * CursorGlow —— 光标氛围光晕（暗场"提灯"）
 * 一抹砖红族柔光跟随光标，环体缓动追赶营造拖尾。
 * 触屏设备自动禁用；尊重 prefers-reduced-motion。
 *
 * 只在暗场出手：指针进入 Hero 天光带（实测 lum 155-231）时收灯 ——
 * 暖白径向光压在天光上不可读，只会把干净的天空糊出一团跟手的脏斑，
 * 而暗体本身已有灯泡这个固定光源，不该再有一个跟着跑的第二个光源。
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
    let inside = false
    let shown = false
    let litBottom = 0

    // 手灯点亮的分界线。原先是 .hero-sky 天光带的下沿（亮部实测到板块高的 66%）；
    // 天光层随首屏重构删掉后，0.66 这个数正好落在首影片那一镜的人头下沿
    // （face.js 实测头占 y 0–607 / 900 = 0.67），语义没变：光标离开亮部、
    // 进入下方暗区才亮。所以只改注释，不动常数。
    const measure = () => {
      const hero = document.querySelector('.hero')
      if (!hero) return
      litBottom = hero.getBoundingClientRect().top + hero.offsetHeight * 0.66
    }
    measure()

    // 透明度只在状态翻转时写，避免每帧重复触发样式计算
    const show = (v) => {
      if (v === shown) return
      shown = v
      const o = v ? '1' : '0'
      dot.style.opacity = o
      ring.style.opacity = o
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      inside = true
      // 内层点瞬时贴合
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`
    }

    // 外层环缓动追赶（"沉思"拖尾）。天光判定也放在这一帧里：
    // 只挪滚轮不挪鼠标时，灯同样要能亮起来或收掉。
    const loop = () => {
      raf = requestAnimationFrame(loop)
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      show(inside && my >= litBottom)
    }
    loop()

    // 进入/离开窗口时淡入淡出
    const onEnter = () => {
      inside = true
    }
    const onLeave = () => {
      inside = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
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
