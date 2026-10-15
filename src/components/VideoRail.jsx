import { useRef, useEffect, useCallback, useState } from 'react'
import './VideoRail.css'

/**
 * VideoRail —— coverflow 式视频轨道（2026-10-13 重做，替换原来的无缝跑马灯）
 *
 * 一张卡在正中＝焦点，两侧的卡斜压着往后退、逐档变小，再往外的卡淡出到轨道边缘化开。
 * 轨道上方一条名称条（他 10-13 深夜发参考截图要的）：序号 + 视频名，选中项描药丸，点它就是聚焦。
 * 交互：拖拽 / 滚轮（滚轴落在卡片上就翻）/ ←→ / 两侧按钮换焦点，点侧卡＝聚焦，点中卡＝开弹窗。
 * 自动翻动默认开着（悬停、拖拽、弹窗打开、轨道不在视口内时暂停，手动翻过一张就让出完整一拍），
 * 右下角按钮可显式关掉。
 *
 * props:
 *   items    视频数据数组 { title, note, cover, type? }
 *   onSelect 点击焦点卡回调（父级打开播放弹窗）
 */

/* coverflow 几何。这组数不是我这轮挑的：他在样品页（%TEMP%\coverflow-mock\index.html）
   把旋钮拧到下面这几个值，截图发过来要求照抄 ——
   perspective 700 / 中卡 0.41×轨道 / 贴合间隙 60px / 每档转角 41° / 每档缩放 0.99 /
   每档深度 150px / 压暗 0 / 过渡 800ms，四个开关全开（贴合·环形·字幕进图·强制动效）。
   「压暗 0」＋「侧卡不要透明」＝后退的卡只靠转角和透视退，不靠淡出，所以这里既没有
   压暗层，边缘也没有淡出坡（见下面 --rail-edge 只有 0/1 两个值）。
   开了「贴合」之后样品页的 reveal / pitch 两个旋钮就不参与排位了：位置由 T[] 那条
   透视链算出来，只有 gap 这个像素值说话。 */
const CF = {
  w: 0.41, // 中卡宽 = 轨道宽 × 它
  minW: 260, // 窄屏下限：纯比例在 375 上会算出 ~116px 的卡，没法看
  maxW: 720,
  rot: 41, // 每档 rotateY（deg）
  scale: 0.99, // 每档缩放
  depth: 150, // 每档 translateZ（px），配合 perspective 才是「后退」而不是「缩小」
  gap: 60, // 相邻两卡「投影边缘」之间的缝（px）
  persp: 700, // perspective（px）：排位链要用它算投影，所以和 CSS 共用这一个常量
  visible: 2.5, // |offset| 超过就不显示
  ms: 800, // 换焦点的过渡时长
  pad: 24, // 轨道上下留的余量：overflow:hidden 会裁掉卡的投影，卡高之外要空出来
}
/* 自动翻动节奏。他 10-13 晚提的第一条是「自动翻转速度太慢」，从 4600 收到 2600。
   这 2600 里含 800ms 的过渡（CF.ms 是他自己在样品页拧的那档，不动），所以看上去是
   「停 1.8 秒 → 走 0.8 秒」。再往下收就要动 CF.ms，那一动就不是改一个数，是他挑过的
   整套参数跟着变形。要更慢只改这一个常量。 */
const AUTO_MS = 2600
/* 竖向滚轮在「一条手势」里最多替轨道翻几张，之后原样交还给页面。
   这条上限存在的理由见 onWheel 上面那段：轨道几乎铺满整幅，指针落在卡上是常态，
   长滚动页不能被它钉死。4 张的取法：一格约 100px、一次连续下滑通常 5~15 格，
   而人「翻着看」一般一次停 1~3 格 —— 4 格之内是浏览，第 5 格起当他在赶页面。
   嫌它抢得多就调小，嫌它不够翻就调大；调到 Infinity 就是彻底封顶失效。 */
const VERT_CAP = 4

export default function VideoRail({ items, onSelect }) {
  const rootRef = useRef(null)
  const frameRef = useRef(null)
  const tabsRef = useRef(null)
  const n = items.length
  // p = 焦点位置，浮点数、单位是「条目序号」。拖拽时连续，松手吸附到整数。
  const [p, setP] = useState(0)
  const [stageW, setStageW] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)
  // 暂停条件全存 ref：定时器每 AUTO_MS 读一次，不该为「鼠标进没进来」重渲染整条轨道
  const gate = useRef({ hovered: false, dragging: false, inView: false, paused: false })
  // 手动翻卡的时间戳：定时器读到「距上次手动不满一拍」就让路。
  // 悬停期间自动翻动本来就停（g.hovered），这条管的是他滚完卡、把鼠标移开去滚页面那一刻
  // —— 没有它，他刚停下的那张会在下一拍被自动翻走。
  const manualAt = useRef(0)

  /* ── 动效不受系统「减少动效」影响 ──
     本机 Windows 的「动画效果」是关的（MinAnimate=0），它会传导成 prefers-reduced-motion，
     于是原来那套 if (reduceMotion) 归零在这台电脑上一帧都不动 —— 他在样品页专门勾了
     「强制动效」并把它截进参数里，所以这里不再读那个媒体查询；CSS 侧另有一档把
     global.css 那条通配符 !important 顶回去（见 VideoRail.css 末尾）。
     代价：这条轨道成了全站唯一无视 reduce-motion 的地方。真正的关闭入口是右下角那个
     暂停按钮（WCAG 2.2.2 要的是「会动的内容可暂停」，这条还满足）。 */
  const [userPaused, setUserPaused] = useState(false)
  const autoplay = !userPaused
  useEffect(() => {
    gate.current.paused = userPaused
  }, [userPaused])

  /* ── 几何：全部在 render 里按 p 算出来，写成 inline style，过渡交给 CSS ── */
  // minW 的下限要让位给轨道宽：死守 260 会让卡比轨道还宽，两侧被 overflow:hidden 裁掉边。
  // 让位系数从 0.86 收到 0.62：贴合排位下侧卡的内缘在 cw/2+gap 之外，卡占到 86% 时
  // 轨道里连一条侧卡的边都放不下 —— 窄屏会退化成「只有一张卡」，看不出还能翻。
  const cw = stageW
    ? Math.min(Math.max(stageW * CF.w, Math.min(CF.minW, stageW * 0.62)), CF.maxW)
    : CF.minW
  // 间隙跟着卡宽缩：60px 是桌面那档，窄屏上它比「卡边到轨道边」的余量还大，侧卡会整个被裁掉。
  // 桌面中卡 469px、60/469≈0.128，于是按 0.128×cw 设上限：宽屏吃满 60，窄屏自动降到十几 px。
  const gapPx = Math.min(CF.gap, cw * 0.128)
  const last = Math.ceil(CF.visible) + 1
  const scAt = (a) => 1 - (1 - CF.scale) * Math.min(a, CF.visible)
  const thAt = (a) => (CF.rot * Math.min(a, CF.visible) * Math.PI) / 180
  // 整数档中心位表（贴合排位）：第 k 张的投影近缘 = 第 k−1 张的投影远缘 + gapPx。
  // 有 perspective 时 (x,z) → x·D/(D−z)，卡转过去以后近缘被放大、远缘被压小，
  // 所以不能按 cw·cosθ 排（样品页实测那样相邻会留 46px 缝，而他要的是 60）。
  const T = [0]
  let prevR = cw / 2
  for (let k = 1; k <= last; k++) {
    const W = cw * scAt(k)
    const z0 = -k * CF.depth
    const th = thAt(k)
    const Hc = (W / 2) * Math.cos(th) // 半宽在屏幕上的水平投影（近缘方向）
    const Hs = (W / 2) * Math.sin(th) // 转角带出来的纵深，它改变缩放分母
    const tx = ((prevR + gapPx) * (CF.persp - (z0 + Hs))) / CF.persp + Hc
    T[k] = tx
    prevR = ((tx + Hc) * CF.persp) / (CF.persp - (z0 - Hs))
  }
  const dragUnit = T[1] || cw // 拖多少像素算翻一张：取第 1 档的实际中心距
  const ramp = (a) => Math.min(a, CF.visible)
  // 有符号最短环距：11 条首尾相连，走到头下一张就是第 1 条
  const delta = (i) => {
    let d = i - p
    d = ((d % n) + n) % n
    if (d >= n / 2) d -= n
    return d
  }
  const focusIndex = ((Math.round(p) % n) + n) % n

  const step = useCallback((dir) => {
    manualAt.current = Date.now()
    setP((v) => v + dir)
  }, [])
  // 点侧卡聚焦：目标要平移到「离当前 p 最近的那个等价位置」，
  // 否则从 index 10 点 index 0 会 p:10→0，整条轨道倒着穿过 10 档。
  const focusOn = useCallback(
    (i) => {
      manualAt.current = Date.now()
      setP((v) => i + Math.round((v - i) / n) * n)
    },
    [n]
  )

  /* ── 轨道宽度：ResizeObserver 比 window.resize 准（按钮隐藏、板宽变化都算进来） ── */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const read = () => setStageW(frame.clientWidth)
    read()
    if (typeof ResizeObserver === 'undefined') {
      addEventListener('resize', read)
      return () => removeEventListener('resize', read)
    }
    const ro = new ResizeObserver(read)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  /* ── 自动翻动 ──
     定时器常驻、条件在回调里判：这样点「继续」下一拍就走，不会因为重建 interval
     把相位重置掉，也不会为每次悬停重渲染 11 张卡。 */
  useEffect(() => {
    const id = setInterval(() => {
      const g = gate.current
      if (g.paused || g.hovered || g.dragging || !g.inView) return
      // 弹窗打开时 WorkModal 把 body 锁成 overflow:hidden —— 轨道在背后继续翻没有意义
      if (document.body.style.overflow === 'hidden') return
      // 刚手动翻过：让出完整一拍，别和他抢
      if (Date.now() - manualAt.current < AUTO_MS) return
      setP((v) => v + 1)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [])

  // 轨道不在视口里就停：省掉看不见的翻动，用户滚回来时看到的还是他离开时那张
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (typeof IntersectionObserver === 'undefined') {
      gate.current.inView = true
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        gate.current.inView = entry.isIntersecting
      },
      { rootMargin: '120px 0px' }
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  /* ── 名称条：窄屏那一档它是横滑的，选中项要跟着滚进视野 ──
     只写容器自己的 scrollLeft，不用 scrollIntoView —— 后者会顺手把祖先（＝整页）也滚一下，
     自动翻动每 2.6s 就来一次，那种"页面自己往下溜"他一定会看见。
     宽屏折成两行时 scrollWidth === clientWidth，这段整个跳过。
     ⚠️ 换档要补一次：801→375 这种「从折行切成横滑」的瞬间 focusIndex 没变，只挂在
     focusIndex 上的依赖不会重跑，选中项会整条留在容器外（第十二轮在 375 上量到：
     04 停在左缘之外，截图里可见的是 05/06/07）。所以 resize 也走一遍 ——
     但只在它真的看不见时才滚，否则他自己拖着这条挑片子时窗口一动就被拽回去。 */
  useEffect(() => {
    const nav = tabsRef.current
    if (!nav) return
    const center = (smooth) => {
      if (nav.scrollWidth <= nav.clientWidth) return
      const el = nav.querySelector('.is-this')
      if (!el) return
      const nb = nav.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      if (r.left >= nb.left + 2 && r.right <= nb.right - 2) return
      // 用矩形算，不用 el.offsetLeft：窄屏这档 nav 自己是 static（底衬那条 position:relative
      // 只在 >900px 里），offsetParent 会跳到 .video-gallery，offsetLeft 里就混进了
      // 版心左padding 和这条 -40px 的负外边距 —— 第十四轮量到落点偏 39.5px（401 应为 441）。
      nav.scrollTo({
        left: nav.scrollLeft + (r.left - nb.left) - (nav.clientWidth - r.width) / 2,
        behavior: smooth ? 'smooth' : 'auto',
      })
    }
    center(true)
    let t = 0
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => center(false), 160)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [focusIndex])

  /* ── 入场交错只在轨道首次进入视口时播一次 ──
     纯 CSS 动画在挂载时就播完了，而轨道在首屏之下 6000px+，用户滚到时看到的
     永远是终态。兜底走 scroll/resize 而不是只靠 IntersectionObserver：
     后者在标签页不可见时不触发，切回来可能一直停在隐藏态。 */
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
    if (root.getBoundingClientRect().top < window.innerHeight) {
      reveal()
      return
    }
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

  /* ── 滚轮：滚轴落在卡片上＝翻卡，落不到卡片上＝留给页面 ──
     他提的第三条。原因在原来那句 `if (|deltaX| < |deltaY|) return`：普通鼠标滚轴只发
     deltaY，整条手势被判给了页面，所以在卡上滚轮一点反应都没有。
     一次 wheel 事件只能有一个去向（拦下竖向，这一屏就不滚了），所以按指针位置划线：
     海报图与字幕层都 closest 得到卡 → 卡矩形内吃掉并翻卡；卡外（轨道上下各 24px 余量、
     两侧按钮、板块左右留白）不拦。但这条线在 1440 下挡不住多少：5 张可见卡连着 60px 的缝
     几乎铺满整条轨道，指针「随便一放」就在卡上。真正的逃生口是下面那条手势上限 VERT_CAP。
     横向手势（触控板两指横扫）本来就不跟页面抢，整条轨道范围内都收，也不封顶。 */
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let acc = 0
    let axis = 0 // 1＝横向 / -1＝竖向：换了轴向重新攒，斜向手势里两轴不会互相抵消
    let flips = 0 // 本条手势已经翻了几张（只用于竖向那条上限）
    let timer = 0
    // 手势边界：700ms 静默重新计。取这个数是为了让「两种意图」分得开：
    // 想滚页面的人是连着滚的（一格 100~300ms），一整串落在同一条手势里 → 第 5 格起交还页面；
    // 想一张张看的人是慢慢滚的（一格半秒以上），每格都算新手势 → 每格都翻。
    // 160/260 都不够：那样连不上，页面在卡上就永远滚不动。
    const onWheel = (e) => {
      const horiz = Math.abs(e.deltaX) >= Math.abs(e.deltaY)
      if (!horiz && !e.target.closest?.('.video-rail-card')) return
      if (!horiz && flips >= VERT_CAP) return // 滚够了，这一格原样交还页面
      e.preventDefault()
      const cur = horiz ? 1 : -1
      if (cur !== axis) {
        axis = cur
        acc = 0
      }
      // deltaMode：0=像素（Chrome 鼠标滚轴约 100/格）、1=行（Firefox 给 3）、2=页。
      // 折成像素再攒，否则行模式下要攒满 15 行才翻一张。
      const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1
      // 攒的是「内容往哪边走」：滚轴向下、两指向左扫都等于「下一张」，
      // 与拖拽（往左拖＝下一张）和右侧按钮同向。
      acc += (horiz ? -e.deltaX : e.deltaY) * k
      if (Math.abs(acc) >= 45) {
        step(acc > 0 ? 1 : -1)
        acc = 0
        flips++
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        acc = 0
        axis = 0
        flips = 0
      }, 700)
    }
    // React 的 onWheel 在根上以 passive 挂载，preventDefault 会失效，所以走原生监听
    frame.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      frame.removeEventListener('wheel', onWheel)
      clearTimeout(timer)
    }
  }, [step])

  /* ── 拖拽 ──
     ⚠️ 卡面是 <img>：不拦 dragstart 的话浏览器起的是原生图片拖拽，pointer 直接被
     cancel —— 样品页实测两帧 pointermove 后只剩 pointercancel，松手吸附和点卡全丢。 */
  const onPointerDown = (e) => {
    manualAt.current = Date.now()
    dragRef.current = { x: e.clientX, p0: p, moved: 0, card: e.target.closest('.video-rail-card') }
    setDragging(true)
    gate.current.dragging = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    d.moved = Math.abs(e.clientX - d.x)
    setP(d.p0 - (e.clientX - d.x) / dragUnit)
  }
  const resetDrag = () => {
    dragRef.current = null
    setDragging(false)
    gate.current.dragging = false
  }
  const endDrag = () => {
    const d = dragRef.current
    if (!d) return
    resetDrag()
    if (d.moved > 12) {
      setP(Math.round(p)) // 吸附到整档
      return
    }
    // 没移动＝这是一次点击：侧卡聚焦，中卡开弹窗
    const card = d.card
    if (!card) return
    const i = Number(card.dataset.i)
    if (i === focusIndex) onSelect && onSelect(items[i])
    else focusOn(i)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      step(-1)
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      step(1)
      e.preventDefault()
    }
  }
  const onCardKeyDown = (e, item, i) => {
    if (e.key !== 'Enter') return
    if (i === focusIndex) onSelect && onSelect(item)
    else focusOn(i)
  }

  return (
    <div
      className="video-rail-block"
      onMouseEnter={() => {
        gate.current.hovered = true
      }}
      onMouseLeave={() => {
        gate.current.hovered = false
      }}
    >
      {/* 名称条：他发来的参考视频顶上就是这一排（序号 + 名字，选中项描药丸）。
          文本全部取自 videos.js 的 title，序号是数组位次 —— 数据里没有的字不编。
          放在 .video-rail 外面、跟着同一个 hover 门控：鼠标在挑名字的时候不该继续翻。
          包一层 wrap 是为了让底衬留在外面：nav 现在是横向滚动容器（overflow-x:auto 会把
          overflow-y 也算成 hidden），垫子挂在 nav 上就会被自己的盒子裁掉、四条 blur 边全没了。 */}
      <div className="video-rail-tabs-wrap">
        <nav className="video-rail-tabs" ref={tabsRef} aria-label="视频案例列表">
          {items.map((item, i) => (
            <button
              type="button"
              key={`tab-${item.title}-${i}`}
              className={`video-rail-tab${i === focusIndex ? ' is-this' : ''}`}
              aria-current={i === focusIndex ? 'true' : undefined}
              onClick={() => focusOn(i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {item.title}
            </button>
          ))}
        </nav>
      </div>

      <div
        className="video-rail"
        ref={rootRef}
        style={{ '--rail-ms': `${CF.ms}ms`, '--rail-persp': `${CF.persp}px` }}
        onKeyDown={onKeyDown}
      >
        <button
          className="video-rail-btn prev"
          onClick={() => step(-1)}
          aria-label="上一张"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div
          className={`video-rail-frame${dragging ? ' is-dragging' : ''}`}
          ref={frameRef}
          style={{ height: Math.round(cw * 0.5625) + CF.pad * 2, '--rail-pad': `${CF.pad}px` }}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={resetDrag}
        >
          <div className="video-rail-cards">
            {items.map((item, i) => {
              const d = delta(i)
              const a = Math.abs(d)
              const m = ramp(a)
              const k = Math.min(Math.floor(a), last - 1)
              const tx = Math.sign(d) * (T[k] + (a - k) * (T[k + 1] - T[k]))
              const far = a > CF.visible
              const isFocus = i === focusIndex
              return (
                <article
                  className={`video-rail-card${isFocus ? ' is-focus' : ''}`}
                  key={`${item.title}-${i}`}
                  data-i={i}
                  role="button"
                  tabIndex={far ? -1 : 0}
                  aria-hidden={far ? 'true' : 'false'}
                  aria-label={`预览 ${item.title}`}
                  style={{
                    width: `${cw}px`,
                    // 侧卡不做透明：这个值只剩「在不在 |offset|≤visible 的窗口里」两个档位。
                    // 仍然走 CSS 变量而不是 inline opacity —— inline 会盖掉「入场前先隐形」
                    // 那条规则，交错进场就没了
                    '--rail-edge': far ? '0' : '1',
                    pointerEvents: far ? 'none' : undefined,
                    zIndex: 100 - Math.round(a * 10),
                    transform:
                      `translateX(calc(-50% + ${tx.toFixed(2)}px)) translateZ(${(-a * CF.depth).toFixed(1)}px)` +
                      ` rotateY(${(Math.sign(d) * CF.rot * m).toFixed(2)}deg) scale(${(1 - (1 - CF.scale) * m).toFixed(3)})`,
                    '--rail-delay': `${i * 0.06}s`,
                  }}
                  onKeyDown={(e) => onCardKeyDown(e, item, i)}
                >
                  <div className="video-rail-poster">
                    <img src={item.cover} alt={item.title} loading="lazy" draggable={false} />
                  </div>
                  <div className="video-rail-info">
                    <span>
                      {item.type || `VIDEO / ${String(i + 1).padStart(2, '0')}`}
                    </span>
                    <h4>{item.title}</h4>
                    <p>{item.note}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <button
          className="video-rail-btn next"
          onClick={() => step(1)}
          aria-label="下一张"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41-1.41L13.17 12z" />
          </svg>
        </button>

        {/* 自动翻动开关。这条轨道是全站唯一无视系统「减少动效」的地方（参数是他自己勾的
            「强制动效」），所以这个按钮是唯一的显式关闭入口 —— WCAG 2.2.2 也要求会动的内容可暂停。 */}
        <button
          className="video-rail-play-toggle"
          onClick={() => setUserPaused(!userPaused)}
          aria-pressed={autoplay}
          aria-label={autoplay ? '暂停自动翻动' : '开始自动翻动'}
          title={autoplay ? '暂停自动翻动' : '开始自动翻动'}
        >
          {autoplay ? (
            <svg key="pause" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          ) : (
            <svg key="play" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
