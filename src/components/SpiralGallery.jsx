import { useRef, useEffect, useCallback, useMemo } from 'react'
import './SpiralGallery.css'

/**
 * SpiralGallery —— 3D 螺旋照片墙 v7（真·阶梯螺旋，贴近参考图）
 *
 * 几何：单圈圆柱（rotateY(i·θ) translateZ(r)）+ y 沿「距正前方的张数 d」线性盘升。
 *   正前方那张 d=0 → y=0 居中（唯一大图、完整露出）；每往旁一张 y 升/降一个阶梯量，
 *   整圈从 -climbY/2 爬到 +climbY/2 形成肉眼可辨的阶梯螺旋；背面接缝 z<0 看不见。
 *
 * 交互：滚轮扭转 step-snap 到下一张/上一张 strict 正前方（rAF lerp 平滑）；
 *       frontIdx 随 rot 平移 → 整条阶梯线整体上下挪，所有 N 张都能依次轮转到正前方完整展示。
 *       拖拽 / 触屏 / 点击 Lightbox；reduce-motion 退化为静态散落、保留整页滚动。
 * 视觉权重 front=cos(angle)：正前大而清晰，背面淡出；靠 opacity+saturate 营造散落淡雅。
 * 性能：命令式 DOM 更新（rAF 写 el.style，不经 React），静止自动停。
 */
export default function SpiralGallery({ works, onSelect }) {
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const targetRot = useRef(0)
  const currentRot = useRef(0)
  const rafId = useRef(null)
  const running = useRef(false)
  const lastFrameTs = useRef(0) // 上一帧时间戳：插值换算为帧率无关的时间驱动

  // ── 螺旋几何参数 ──
  // 单圈圆柱（正前方唯一大图）+ y 沿"距正前方的张数"线性阶梯 → 真螺旋
  const total = works.length
  // 单圈圆柱（正前方唯一大图）+ y 沿"距正前的张数"做线性阶梯 → 真螺旋
  const turns = 1.0
  const theta = (Math.PI * 2 * turns) / total       // 相邻一张的角度增量（N=10 → 36°/张）
  const radius = 460                                 // 圆柱半径
  const climbPerTurn = 1.0                           // 整圈 y 跨度 = 卡高 × 此值（阶梯幅度）
  const climbDefault = 360

  // ── 核心：根据当前旋转角，直接写每张卡片的 DOM 栀式 ──
  // 用 ref 持有 render 供 rAF 递归调用，避免函数自引用触发 lint/重渲染问题
  const renderRef = useRef(null)
  const render = useCallback((now) => {
    // 帧率无关插值：原「每帧逼近 8.5%」以 60fps 为基准换算为指数衰减，
    // 避免 120/144Hz 高刷屏上吸附速度成倍变快、手感发冲
    const ts = typeof now === 'number' ? now : performance.now()
    const dt = lastFrameTs.current
      ? Math.min((ts - lastFrameTs.current) / 1000, 0.05) // 掉帧/切后台回来不跳变
      : 1 / 60
    lastFrameTs.current = ts
    const ease = 1 - Math.pow(1 - 0.085, dt * 60)
    const diff = targetRot.current - currentRot.current
    const rot = currentRot.current + diff * ease
    currentRot.current = rot

    // 卡片实际高度（响应式自适应），单圈螺旋升幅
    const cardH = cardRefs.current[0]?.offsetHeight || climbDefault
    const climbY = cardH * climbPerTurn

    for (let i = 0; i < total; i++) {
      const el = cardRefs.current[i]
      if (!el) continue

      const angle = i * theta + rot              // 当前角度（弧度）
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius
      // front：正面度，1=正对镜头，-1=完全背对
      const front = Math.cos(angle)
      // y —— 真·阶梯螺旋：以"距正前方的张数 d"线性盘升。
      //   frontIdx = 当前正前方那张的索引（round(-rot/theta)）；d = i - frontIdx，折叠到 (-N/2, N/2]。
      //   正前那张 d=0 → y=0 居中；每往旁边一张，y 升/降一张的阶梯量（climbY/N）。
      //   整圈从 -climbY/2 爬到 +climbY/2，背面 d=±N/2 处接缝（背面 z<0 看不见，跳变无感）。
      //   随 rot 滚动 frontIdx 变化 → 整条阶梯线整体上下平移，肉眼可见连续螺旋盘升。
      const frontIdx = Math.round(-rot / theta)
      let d = i - frontIdx
      if (d > total / 2) d -= total
      if (d <= -total / 2) d += total
      const y = (d / total) * climbY

      // ── 视觉权重：正前方唯一大图，两侧阶梯卡片淡而可见，构成完整螺旋线 ──
      // 前景大而清晰（front=1 → scale 1.2 / opacity 1）；随远离正前温和衰减，
      // 侧面阶梯半透明可见，背面淡到几乎消失。无 blur，靠 opacity+saturate 散落淡雅。
      const scale = 0.45 + Math.max(0, front) * 0.75        // 0.45 ~ 1.20
      const opacity = 0.1 + Math.max(0, front) * 0.9        // 0.1 ~ 1.0
      const saturate = 60 + Math.max(0, front) * 40         // 60% ~ 100%
      // 卡片自身朝向圆心（圆柱面贴附感）
      const tiltY = (angle * 180) / Math.PI

      el.style.transform =
        `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) ` +
        `rotateY(${tiltY.toFixed(2)}deg) scale(${scale.toFixed(3)})`
      el.style.opacity = opacity.toFixed(3)
      el.style.filter = `saturate(${saturate.toFixed(0)}%)`
      el.style.zIndex = Math.round((front + 1) * 50)
      // 动态 mask：正前方（front>0.9）无遮罩完整露出；侧面/远景上下轻微羽化
      const maskVal = front > 0.9
        ? 'none'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, #000 9%, #000 91%, rgba(0,0,0,0.6) 100%)'
      el.style.webkitMaskImage = maskVal
      el.style.maskImage = maskVal
    }

    if (Math.abs(targetRot.current - currentRot.current) > 0.0002) {
      rafId.current = requestAnimationFrame((t) => renderRef.current?.(t))
    } else {
      running.current = false
      lastFrameTs.current = 0 // 停下后重置时间基准，下次启动不吃掉首帧
    }
  }, [total, theta, radius, climbDefault, climbPerTurn])

  // 始终把最新的 render 暴露给 rAF 回调（在 effect 内更新 ref，避免在渲染期写 ref）
  useEffect(() => {
    renderRef.current = render
  }, [render])

  const startLoop = useCallback(() => {
    if (!running.current) {
      running.current = true
      rafId.current = requestAnimationFrame((t) => renderRef.current?.(t))
    }
  }, [])

  // 是否尊重「减少动态效果」：reduce-motion 时不扭转、不拦截滚动，
  // 退化为静态散落照片墙 —— 仍可点击 / Tab 聚焦后 Enter 进入作品。
  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )
  const wheelEnabled = !reduceMotion

  // ── 滚轮：step snap 到下一张/上一张的正前方 ──
  // "沿最近方向扭转 + 所有画面都能完整在正前方展示"的核心实现：
  // 每次滚轮触发一次吸附，停在该方向最近一张图的严格正前方
  // （用 rAF lerp 平滑插值，所以看起来是"扭转→停→扭转→停"）
  // reduce-motion 时不 preventDefault（保留整页滚动），也不启动扭转动画。
  //
  // 端点释放：扭转界定在首~末一张（0..total-1）。到达端点后不再拦截滚轮
  // → 页面继续正常滚动。原实现无限旋转且恒 preventDefault，而照片墙 92vh
  // 近满屏，光标悬于墙上时整页「被困死」在本板块，上下都滚不出去。
  const onWheel = useCallback((e) => {
    if (!wheelEnabled) return
    const dir = e.deltaY > 0 ? 1 : -1
    // 从"目标角度"算最近 idx（rAF 收敛时 targetRot≈currentRot）
    const currentIdx = Math.round(targetRot.current / theta)
    const nextIdx = currentIdx + dir
    // 端点外：放行滚轮事件，页面继续滚动
    if (nextIdx < 0 || nextIdx > total - 1) return
    e.preventDefault()
    targetRot.current = nextIdx * theta
    startLoop()
    containerRef.current?.classList.add('scrolled')
  }, [theta, startLoop, wheelEnabled, total])

  // ── 触屏/拖拽支持 ──
  const drag = useRef({ active: false, startX: 0, startRot: 0 })
  const onPointerDown = useCallback((e) => {
    drag.current = { active: true, startX: e.clientX, startRot: targetRot.current }
    containerRef.current?.setPointerCapture?.(e.pointerId)
  }, [])
  const onPointerMove = useCallback((e) => {
    if (!drag.current.active || !wheelEnabled) return
    const dx = e.clientX - drag.current.startX
    // 拖拽同样界定在首~末一张内，与滚轮端点释放保持一致
    const maxRot = (total - 1) * theta
    targetRot.current = Math.max(0, Math.min(maxRot, drag.current.startRot + dx * 0.006))
    startLoop()
  }, [startLoop, wheelEnabled, total, theta])
  const onPointerUp = useCallback((e) => {
    if (!drag.current.active) return
    drag.current.active = false
    containerRef.current?.releasePointerCapture?.(e.pointerId)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    // 首帧定位
    render()
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [onWheel, onPointerDown, onPointerMove, onPointerUp, render])

  return (
    <div className="spiral-gallery" ref={containerRef}>
      {/* 中心光晕：极淡的径向蓝白聚焦 */}
      <div className="spiral-glow" aria-hidden="true" />

      {/* 四边柔化遮罩 */}
      <div className="spiral-edge-mask" aria-hidden="true" />

      <div className="spiral-stage">
        {works.map((work, i) => (
          <article
            className="spiral-card"
            key={work.id}
            ref={(el) => (cardRefs.current[i] = el)}
            onClick={() => onSelect && onSelect(work)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect && onSelect(work)}
            aria-label={`查看作品：${work.title}`}
          >
            <img src={work.image} alt={work.title} loading="lazy" draggable="false" />
          </article>
        ))}
      </div>

      {/* 滚动提示 */}
      <div className="spiral-hint">
        <span>↑↓</span>
        <span>滚动鼠标探索 · 点击图片查看</span>
      </div>
    </div>
  )
}
