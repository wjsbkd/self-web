import './FilmStage.css'
import { useEffect, useRef } from 'react'

/* 全站影片层：首屏 = 首屏视频（循环 + 跟随鼠标），滚过交接点后 = 主视频（滚动驱动进度）。
   素材沿用 public/assets/scrolly/ 那两份，不复制第二份字节。
   数值依据（实测，见 HANDOVER「Scrollytelling」节）：
   - 主视频 24fps、重编码成 GOP6 后单次 seek p50 5.6–23ms（随解码路径浮动），
     所以每帧最多放一个 seek 在飞，且目标时间量化到整帧。
   - 读 video.currentTime 判断「seek 到位」不可信：seek 在飞时它已经返回目标值。 */
const FPS = 24
const SEEK_STALL = 400 // seeked 迟迟不回来就解锁，防止一次失败 seek 把整条时间线钉死
const HANDOFF = 0.35 // 滚过首屏高度的 35% 就交棒给主视频；未滚动时首屏画面保持不动
/* 主视频放大到 1.12：位移预算是几何量，横向 ±0.06×1.12×视口宽 ≈ ±12.7%、
   纵向 ±6%（前提是 FilmStage.css 把盒子做到 112% 宽，见那里的 ⚠️ 说明）。
   代价是上下各裁掉 6% 画面 —— 站立那一镜的鞋尖靠 DODGE 的负向 y 偏移补回来。 */
const FILM_K = 1.12

/* 主体避让表：板块滚到视口中央时，影片该往哪边让开多少（视口宽/高比例，x 正=主体右移）。
   数字口径：lanes.js 对每个板块居中的那一帧做背景减除，逐行量出「主体最靠左在哪」，
   再反推让多少能把信息道腾出来；check.js 拿这帧的逐行边界去验每个字的墨迹右缘。
   所以改这张表会让实测数字整体平移，两者要交替收敛，不能一次拍死。
   .work 是唯一不用让的（沙发那一镜主体本就在右），只补一点点。
   ⚠️ 上限：|x| ≤ 0.127、|y| ≤ 0.06，超了露黑边。这里留了余量（x 0.122、y 0.045）。 */
const DODGE = [
  ['.hero', 0, 0],
  ['.about', 0.122, -0.01],
  ['.strength', 0.115, 0],
  ['.experience', 0.122, 0],
  ['.work', 0.04, 0],
  ['.media', 0.06, 0],
  ['.account-ops', 0.1, -0.04],
  ['.footer', 0.122, -0.045],
]

export default function FilmStage() {
  const rootRef = useRef(null)
  const introRef = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const intro = introRef.current
    const main = mainRef.current
    if (!root || !intro || !main) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer:fine)').matches

    let duration = 0
    let anchor = 0 // 交接点（px）
    let docMax = 0 // 全页可滚距离（px）
    let targetP = 0
    let smoothP = 0
    let stage = 'intro'
    let seeking = false
    let issuedFrame = -1
    let seekAt = 0
    let mx = 0
    let my = 0
    let pmx = 0
    let pmy = 0
    let raf = 0
    let dodge = [] // measure() 生成：[{y 生效 scrollY, x, yOff}]
    let dx = 0 // 当前已应用的避让位移（视口比例）
    let dy = 0
    let lastTx = -1
    let lastTy = -1

    function measure() {
      const hero = document.querySelector('.hero')
      const heroH = hero ? hero.offsetHeight : window.innerHeight
      anchor = heroH * HANDOFF
      docMax = document.documentElement.scrollHeight - window.innerHeight
      duration = main.duration > 0 && isFinite(main.duration) ? main.duration : duration
      // 各板块「居中于视口」时的 scrollY，就是该板块避让档的生效点；档间线性插值
      dodge = DODGE.map(([sel, x, y]) => {
        const el = document.querySelector(sel)
        const mid = el ? el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2 : 0
        return { y: Math.min(docMax, Math.max(0, mid)), x, yOff: y }
      }).sort((a, b) => a.y - b.y)
    }

    function dodgeAt(y) {
      if (!dodge.length) return [0, 0]
      if (y <= dodge[0].y) return [dodge[0].x, dodge[0].yOff]
      const last = dodge[dodge.length - 1]
      if (y >= last.y) return [last.x, last.yOff]
      for (let i = 1; i < dodge.length; i++) {
        const b = dodge[i]
        if (y > b.y) continue
        const a = dodge[i - 1]
        const k = (y - a.y) / (b.y - a.y || 1)
        return [a.x + (b.x - a.x) * k, a.yOff + (b.yOff - a.yOff) * k]
      }
      return [last.x, last.yOff]
    }

    function onScroll() {
      const y = window.scrollY
      targetP = docMax - anchor > 0 ? Math.min(1, Math.max(0, (y - anchor) / (docMax - anchor))) : 0
      if (y <= anchor) targetP = 0
    }

    function onMainMove(e) {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
    }

    function tick(now) {
      raf = requestAnimationFrame(tick)

      smoothP += (targetP - smoothP) * 0.45
      if (Math.abs(targetP - smoothP) < 0.00015) smoothP = targetP

      const next = smoothP > 0.0005 || window.scrollY > anchor ? 'main' : 'intro'
      if (next !== stage) {
        stage = next
        root.classList.toggle('is-main', stage === 'main')
        root.classList.toggle('is-intro', stage === 'intro')
        // 隐藏的循环层停掉解码，否则一份 1280×720 常驻；显示时再续上
        if (stage === 'intro') {
          if (!reduce.matches && intro.paused) intro.play().catch(() => {})
        } else if (!intro.paused) {
          intro.pause()
        }
      }

      if (stage === 'main' && duration > 0) {
        const f = Math.round(smoothP * duration * FPS)
        if (f !== issuedFrame && (!seeking || now - seekAt > SEEK_STALL)) {
          issuedFrame = f
          seeking = true
          seekAt = now
          try {
            main.currentTime = f / FPS
          } catch {
            seeking = false
          }
        }
      }

      // 主体避让：位移跟着 scrollY 走，属于用户驱动的镜头运动，不受「减少动效」限制
      if (stage === 'main') {
        const [tx, ty] = dodgeAt(window.scrollY)
        dx += (tx - dx) * 0.12
        dy += (ty - dy) * 0.12
        const px = dx * window.innerWidth
        const py = dy * window.innerHeight
        if (Math.abs(px - lastTx) > 0.2 || Math.abs(py - lastTy) > 0.2) {
          lastTx = px
          lastTy = py
          main.style.transform =
            'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) scale(' + FILM_K + ')'
        }
      }

      // 首屏跟随鼠标：位移由这里每帧写，CSS 侧不能再挂 transition（两套时钟会互相拉扯）
      if (fine && !reduce.matches && stage === 'intro') {
        pmx += (mx - pmx) * 0.08
        pmy += (my - pmy) * 0.08
        intro.style.transform =
          'translate3d(' + (-pmx * 26).toFixed(2) + 'px,' + (-pmy * 16).toFixed(2) + 'px,0) scale(1.08)'
      }
    }

    const onSeeked = () => {
      seeking = false
    }

    const onVisibility = () => {
      if (document.hidden) return
      // 后台标签页里 seek 会被挂起，回到前台后必须允许重新发一次
      issuedFrame = -1
      seeking = false
    }

    function onPrefChange() {
      if (reduce.matches && !intro.paused) {
        intro.pause()
        intro.currentTime = 0
      } else if (!reduce.matches && stage === 'intro' && intro.paused) {
        intro.play().catch(() => {})
      }
    }

    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    onScroll()
    if (main.readyState >= 1) {
      duration = main.duration
      main.pause()
    }
    if (reduce.matches) {
      intro.removeAttribute('autoplay')
      intro.pause()
    }

    main.addEventListener('loadedmetadata', () => {
      duration = main.duration
      main.pause()
      measure()
      onScroll()
    })
    main.addEventListener('seeked', onSeeked)
    intro.addEventListener('play', () => {
      // autoplay 的启动是排队任务，会跑在脚本 pause() 之后，只能在事件上钉回
      if (reduce.matches) {
        intro.pause()
        intro.currentTime = 0
      }
    })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMainMove, { passive: true })
    reduce.addEventListener('change', onPrefChange)

    measure()
    onScroll()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      main.removeEventListener('seeked', onSeeked)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMainMove)
      reduce.removeEventListener('change', onPrefChange)
    }
  }, [])

  return (
    <div className="film-stage is-intro" ref={rootRef} aria-hidden="true">
      <video
        className="film-layer film-layer--intro"
        ref={introRef}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        src="/assets/scrolly/intro.mp4"
      />
      <video
        className="film-layer film-layer--main"
        ref={mainRef}
        muted
        playsInline
        preload="auto"
        src="/assets/scrolly/main.mp4"
      />
      <div className="film-scrim" />
    </div>
  )
}
