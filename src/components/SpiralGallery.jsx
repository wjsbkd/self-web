import { useEffect, useMemo, useRef, useState } from 'react'
import './SpiralGallery.css'

/* SpiralGallery —— 抖音截图墙，接入 React Bits <InfiniteSpiral> 的无限螺旋几何
 *
 * 几何：卡片沿 helix 连续行进，offset 用 modulo 折回 (-N/2, N/2] 实现无限回绕；
 *   每 cardsPerTurn 张绕满一圈，所以「张数」不再决定环的疏密。
 *   上一版是单圈圆柱（theta = 2π/N），15 张时相邻只剩 24°、间隙约 13px 而互相挤压；
 *   换成 8 张/圈后间隙回到 ~26px，多出来的张数沿纵向堆叠成螺旋。
 *
 * 相对上游的四点接入改动（都是必需，不是风格偏好）：
 *   1. 卡尺寸 178×380 而非默认 100×100：素材是 800×1709 手机截图，
 *      正方卡 + object-fit:cover 会上下各切 26%，正好切掉文案与互动读数。
 *   2. 卡片渲染成 <button> 并接 onSelect → WorkModal（上游只支持 href 跳转）。
 *   3. animationMode 在触屏退成 'auto'，且拖拽档的 touch-action 用 'pan-y' 而非上游的
 *      'pan-x'：pan-x 等于禁掉从照片墙上起手的竖向翻页滚动，触屏笔记本（pointer:fine
 *      但有触摸屏）拿到 'all' 就会把整页困在这个板块里 —— 上一版专门做过「端点释放」就是为了它。
 *   4. reduce-motion 下连「页面滚动驱动」一并关掉，退成静态散落。
 *
 * 卡片外观（描边/阴影/圆角）走站内缘光族，见 SpiralGallery.css。
 * 性能：命令式 DOM 更新（rAF 写 el.style，不经 React）。
 */

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const modulo = (v, d) => ((v % d) + d) % d
const smoothstep = (min, max, v) => {
  const x = clamp((v - min) / (max - min || 1), 0, 1)
  return x * x * (3 - 2 * x)
}

/** 媒体查询订阅：几何档位要随视口跨断点切换，不能只在首帧读一次 */
function useMedia(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    onChange(mql)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function InfiniteSpiral({
  items = [],
  onSelect,
  onTravel,
  speed = 0.55,
  direction = 'up',
  animationMode = 'auto',
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  radiusWidthRatio = 0.36,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = 'cover',
  grayscale = 0,
}) {
  const rootRef = useRef(null)
  const cardRefs = useRef([])
  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const autoSpeedRef = useRef(0)
  const hoveredRef = useRef(false)
  const visibleRef = useRef(true)
  const draggingRef = useRef(false)
  const pressingRef = useRef(null)
  const lastPointerYRef = useRef(0)
  const dragMovedRef = useRef(false)
  const travelledRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root || items.length === 0) return

    let frameId
    let previousTime = performance.now()
    let bounds = root.getBoundingClientRect()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scrollEnabled = (animationMode === 'scroll' || animationMode === 'all') && !reducedMotion.matches
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55
    let lastScrollY = window.scrollY

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect()
    })
    resizeObserver.observe(root)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.02 }
    )
    intersectionObserver.observe(root)

    const handleScroll = () => {
      const nextScrollY = window.scrollY
      const scrollDelta = nextScrollY - lastScrollY
      lastScrollY = nextScrollY
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5
      )
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time

      // 滚出视口即停写 DOM（保留速度衰减，滚回来时平滑续上）：
      // 上游的 rAF 是常驻的，而这张墙在整页里只占一屏，全站 60fps 空转不划算。
      if (!visibleRef.current && !draggingRef.current) {
        autoSpeedRef.current += (0 - autoSpeedRef.current) * (1 - Math.exp(-delta * 7))
        frameId = requestAnimationFrame(render)
        return
      }

      const autoEnabled = animationMode === 'auto' || animationMode === 'all'
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current)
      const directionMultiplier = direction === 'down' ? -1 : 1
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0
      const speedBlend = 1 - Math.exp(-delta * 7)
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend
      targetProgressRef.current += autoSpeedRef.current * delta

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11))
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend

      const count = items.length
      const half = count / 2
      const width = Math.max(bounds.width, 1)
      const height = Math.max(bounds.height, 1)
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35))
      const responsiveRadius = Math.min(radius, Math.max(72, width * radiusWidthRatio)) * fit
      const fadeStart = clamp(1 - edgeFade, 0, 0.98)
      const turnSize = Math.max(cardsPerTurn, 1)

      if (!travelledRef.current && Math.abs(progressRef.current) > 0.4) {
        travelledRef.current = true
        onTravel?.()
      }

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        let offset = index - progressRef.current
        offset = modulo(offset + half, count) - half

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1)
        const opacity = 1 - smoothstep(fadeStart, 1, edge)
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1)
        const scale = (1 + (centerScale - 1) * focus) * fit
        const angle = offset * (360 / turnSize) + rotation
        const angleRadians = (angle * Math.PI) / 180
        const x = Math.sin(angleRadians) * responsiveRadius
        const z = Math.cos(angleRadians) * responsiveRadius
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45)
        const visualScale = scale * depthScale
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2
        const blur = edgeBlur * smoothstep(0.35, 1, edge)
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`
        card.style.opacity = opacity.toFixed(3)
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none'
        card.style.zIndex = String(Math.round(depth * 100000) + index)
        card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none'
      })

      frameId = requestAnimationFrame(render)
    }

    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    items,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    radiusWidthRatio,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
    onTravel,
  ])

  const dragEnabled = animationMode === 'drag' || animationMode === 'all'

  const rootStyle = {
    perspective: `${perspective}px`,
    cursor: dragEnabled ? 'grab' : 'default',
    touchAction: dragEnabled ? 'pan-y' : 'auto',
    userSelect: dragEnabled ? 'none' : 'auto',
  }

  const stopDragging = (event) => {
    pressingRef.current = null
    if (!draggingRef.current) return
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default'
  }

  return (
    <div
      ref={rootRef}
      className="spiral-field"
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true
      }}
      onMouseLeave={() => {
        hoveredRef.current = false
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return
        pressingRef.current = { id: event.pointerId, y: event.clientY }
        dragMovedRef.current = false
        targetProgressRef.current = progressRef.current
      }}
      onPointerMove={(event) => {
        const press = pressingRef.current
        if (!press || press.id !== event.pointerId) return
        // 越过阈值才接管指针，不在 pointerdown 里 setPointerCapture：
        // 一按下就捕获会把 pointerup 改派到根节点，click 的目标随之变成
        // 「mousedown 与 mouseup 目标的最近共同祖先」= 根节点，卡片的 onClick 永远不触发。
        // 实测：捕获版真鼠标点不开弹窗，Space 键能开 —— 主交互路径被拖拽逻辑吃掉。
        if (!draggingRef.current) {
          if (Math.abs(event.clientY - press.y) < 4) return
          draggingRef.current = true
          dragMovedRef.current = true
          lastPointerYRef.current = event.clientY
          event.currentTarget.setPointerCapture(press.id)
          event.currentTarget.style.cursor = 'grabbing'
        }
        const pointerDelta = event.clientY - lastPointerYRef.current
        lastPointerYRef.current = event.clientY
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1)
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={(event) => {
        // 只吞鼠标拖拽收尾时那一次 click。键盘激活（Enter / Space）产生的 click 是
        // detail=0 的合成事件，跟拖拽无关，一律放行 —— 否则拖过一次之后会莫名吃掉一次回车。
        if (!dragMovedRef.current || event.detail === 0) return
        event.preventDefault()
        event.stopPropagation()
        dragMovedRef.current = false
      }}
    >
      <div className="spiral-stage" role="list" aria-label="抖音作品螺旋画廊">
        {items.map((item, index) => (
          <button
            key={item.id ?? `${item.src}-${index}`}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            type="button"
            className="spiral-card"
            style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
            aria-label={`查看作品：${item.alt}`}
            onClick={() => onSelect && onSelect(item.work)}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading={index < 6 ? 'eager' : 'lazy'}
              draggable={false}
              style={{
                width: cardWidth,
                height: cardHeight,
                maxWidth: 'none',
                maxHeight: 'none',
                objectFit: imageFit,
                filter: `grayscale(${clamp(grayscale, 0, 1)})`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SpiralGallery({ works, onSelect }) {
  const galleryRef = useRef(null)
  const finePointer = useMedia('(hover: hover) and (pointer: fine)')
  const narrow = useMedia('(max-width: 700px)')

  const items = useMemo(
    () => works.map((work) => ({ src: work.image, alt: work.title, id: work.id, work })),
    [works]
  )

  // 组件把环半径收进 min(radius, 容器宽×radiusWidthRatio)：卡宽若不小于该半径，
  // 一圈就会叠成一叠；每圈张数决定相邻弦长，所以窄屏要整套一起降档。
  // verticalSpacing 的量纲是"声明卡高"，而 fit 会把整条螺旋再乘一次，
  // 所以它的真正约束是：最外一张仍可读的卡，其纵向中心 + 半卡高 ≤ 容器半高。
  // 桌面 1305×828 实测 fit=0.927、正面卡渲染 260×555 → 58 让第 5 张才刚越界，
  // 且那时 edgeFade 已把它压到 0.56 以下；第 6 张（越界 ~58px）只剩 0.25 不透明度。
  // 110 时第 4 张越界 45px 仍接近不透明、72 时最外一张带 0.65 不透明度被切掉 84px，
  // 两种实拍都能看到顶/底边的硬切线，所以这里以「越界时不透明度 ≤0.3」为准绳反推。
  //
  // 桌面的横向：最宽的一张永远在 90° 侧位（z=0 → depthScale=1，x=半径），
  // 它的外沿 = fit×(半径 + 卡宽×(1+0.2×focus)/2)，focus = 1 − 1/(turnSize×0.65)，桌面 turnSize 8 → 0.808。
  //   桌面 1700 容器：fit=0.985，取半径 697 → 外沿 782 = 半宽 850 的 92%，
  //   所以 radiusWidthRatio 给到 0.41（0.41×1700=697），radius 700 只在更宽的容器上兜底。
  //   上一版 ratio 固定 0.36、radius 420，外沿只有 511（60%），左右各空出 339px —— 用户看到的留白。
  //   perspective 必须跟着半径一起放大：depthScale 上限 1.45，
  //   若 1600 配 697 则正面 1600/(1600-697)=1.77 被夹平，中心一排卡全变成同一尺寸；
  //   按上一版 p/R=3.81 的比例放大到 2600，正面回到 1.36、背面 0.79，纵深观感不变。
  //
  // ── 窄屏档（375×812 实测，容器 375×747＝92vh，fit=1）──
  // 半径取 134 不是随手收的，它同时卡在两个下限上：
  //   ① 一圈 4 张 → 相邻两张差 90°，一张在正面 x=0（scale 1.2×1.115 → 半宽 69.6）、
  //      一张在侧位 x=半径（focus 0.615 → scale 1.123 → 半宽 58.4），半宽和 128 ≤ 134 → 横向净空 6px。
  //      纵向只差一个 verticalSpacing，卡高 222 远大于它 → 横向净空是唯一防线。
  //      上一版卡宽 132 ≥ 半径 124，正好踩破 ① —— 这就是「所有东西重叠在一起」的算术成因。
  //   ② 0.41×327=134，所以 327px 宽的容器以下都由 radius 抢先，ratio 在窄屏不参与。
  // 代价：正面卡转到侧位那一刻，外沿 = 134 + 104×1.2/2 = 196.4 > 半宽 187.5，越界 8.9px
  //   （上一版是 124+79.2−187.5=16px），实测全相位卡盒 x −5.2..380.2、最宽一张 140.4，
  //   越界那点交给容器 overflow 与四边遮罩羽化（见 css）。
  // verticalSpacing=66：同列相邻是索引差 4（同角度同深度），纵向间距 4×66=264 > 卡高 222 → 同列不叠。
  //   试过 58：同列缝只剩 10px，全相位实测中位净可见 41.7%、被盖≥30% 的张数 8（66 是 52.8% 与 5）→ 回到 66。
  //   侧位那一格必然有一前一后两张同 x（|offset| 0.5 与 1.5 的 sin 相同），这是螺旋本相，不是缺陷。
  //   15 张总高 14×66+222=1146 > 747 → 上下各有一两张必然越出容器，这些张 |offset|≥5，
  //   edgeFade 0.62（fadeStart 0.38）已把它们压到 ≤0.72 并加 blur 6 → 读作景深，不是硬切线。
  // 窄屏不跟桌面的 p/R 比例（1200/134≈9.0，纵深被刻意压平）：小屏上 1.36 倍的大小跳变会读作闪烁。
  //
  // ── 复量口径（三版翻车记录，别再照抄旧数）──
  // ① 净可见 = 卡片面积里落在「容器∩视口」内的比例 × (1 − 这些点里被别的元素盖住的比例)。
  //    被容器切掉和被卡盖住必须分开算，混成一个数会把视口裁剪误报成重叠。
  // ② 墙是自动转的：speed 0.55 单位/秒、一圈 4 单位 → 相位周期 7.3s。
  //    早先按 3 个时刻、间隔 900ms 取样只覆盖相位的 25%，同一份构建被读出 12% / 34.3% / 66.7% 三个中位数。
  //    现在按 600ms 连采 16 次（9.6s > 一个整周期），逐卡先对相位取中位、再对卡取中位。
  // ③ 但 16 次只等于 1.31 圈，各相位被采到的次数不均 → 净可见/遮挡的中位数仍有 ±8pp 的 run-to-run 散布
  //    （375 改后两遍 52.8 / 54.6，改前两遍 12 / 20.4；1470 两遍 66.7 / 59.3）。报数取区间，别抄单个小数。
  //    能复现到 0.1px 的只有几何格：容器、卡盒横向范围、最宽卡、整页溢出。
  // 全相位实测（cf/sc46_spiral_phase.cjs，old=改前构建、new=本档，两遍）：
  //   375 中位净可见 12–20% → 53–55%，中位遮挡 62–66% → 3–9%，整页溢出 14px → 0。
  //   桌面是空操作，证据为几何格逐遍相同（容器 1350×828、卡盒 x 128.6..1341.4、最宽卡 246.6/246.7）
  //   加上源码只动了 narrow 那一行 —— 不是「净可见 66.7%」那个数，它在同几何下两遍差了 7.4pp。
  const geometry = narrow
    ? { cardWidth: 104, cardHeight: 222, radius: 134, radiusWidthRatio: 0.41, cardsPerTurn: 4, verticalSpacing: 66, perspective: 1200 }
    : { cardWidth: 178, cardHeight: 380, radius: 700, radiusWidthRatio: 0.41, cardsPerTurn: 8, verticalSpacing: 58, perspective: 2600 }

  const hideHint = () => galleryRef.current?.classList.add('scrolled')

  return (
    <div className="spiral-gallery" ref={galleryRef}>
      {/* 中心光晕：极淡的径向砖红聚焦 */}
      <div className="spiral-glow" aria-hidden="true" />

      <InfiniteSpiral
        items={items}
        onSelect={onSelect}
        onTravel={hideHint}
        animationMode={finePointer ? 'all' : 'auto'}
        speed={0.55}
        cardRadius={14}
        centerScale={1.2}
        edgeFade={0.62}
        edgeBlur={6}
        pauseOnHover
        grayscale={0}
        {...geometry}
      />

      {/* 四边柔化遮罩 */}
      <div className="spiral-edge-mask" aria-hidden="true" />

      {/* 交互提示（首次行进后淡出） */}
      <div className="spiral-hint">
        <span>↑↓</span>
        <span>{finePointer ? '拖拽或滚动页面探索 · 点击图片查看' : '点击图片查看'}</span>
      </div>
    </div>
  )
}
