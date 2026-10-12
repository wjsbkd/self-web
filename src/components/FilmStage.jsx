import './FilmStage.css'
import { useEffect, useRef } from 'react'

/* 全站影片层：首屏 = 首屏视频（眼神跟随鼠标，不滚动时画面不动），滚过交接点后 = 主视频（滚动驱动进度）。
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

/* ── 首屏眼神跟随 ──
   intro.mp4 是一条 10s 的「表情 + 视线」素材。锚点表是逐张看过抽帧后定的
   （x 正=看向画面右、y 正=看向画面上，视线单位向量）。
   `from` 是**起播点**：指针方向一变就先 seek 到 from，再用素材自己的 24fps 播进 t，
   转头那一下是原生播放，一次过渡只发 2 次 seek（起播 + 落点校准）。
   上一版按 0.18 逐帧插值（算式，不是量出来的）：从左(5.40)换到右(1.30) 要跨 4.1s 素材
   = 98 帧，收敛到一帧以内需 ln(0.0417/4.1)/ln(0.82) ≈ 23 个 rAF 拍 ≈ 0.4s，
   而且每拍跳的是剩余距离的 18% —— 头三拍就是 17/14/12 帧（一跳跨过 0.5–0.7s 素材，
   中间把朝右大笑那一整段扫过去），这就是"滞后 + 卡顿 + 倒着扫不相干表情"三个毛病同时成立。
   起播点一律只往回 0.30–0.35s（逐帧看过每段进入动作后定的）：再长就要穿过素材
   自己的其它表情，反而不像"眼神动了"。
   素材里没有「纯上」和「纯右下」的镜头，那两个方向由最接近的锚点代打。
   ⚠️ 时刻不能按方向加权平均：这条视线轨迹在时间轴上不单调，两个锚点之间隔着
   素材自己的其它表情，平均出来的时刻对应的是别的方向。只能选一个锚点再播进。 */
const GAZE = [
  { t: 0.15, from: 0.15, x: 0, y: 0 },
  { t: 1.3, from: 0.95, x: 1, y: 0.05 },
  { t: 2.85, from: 2.5, x: 0.55, y: 0.85 },
  { t: 5.4, from: 5.05, x: -1, y: 0 },
  { t: 5.75, from: 5.45, x: -0.6, y: -0.8 },
  { t: 6.8, from: 6.45, x: 0, y: -1 },
]
const GAZE_DEAD = 0.1 // 指针落在这个半径内（以短边一半为单位）视为"贴在脸上"→ 正面
/* 横扫（左→右）的指针路径必然从脸上掠过，死区是它中途的一站。所以"切回正面"要额外
   等指针在死区里停够 120ms 才认 —— 否则一次横扫被拆成"回正→再转向"两段，
   多一对 seek，看着就是两次抖。门槛只加在"切回正面"这一边，别的方向变化照常立即响应。 */
const GAZE_DWELL = 120
/* 双眼中点在源片里的位置，实测自 t=0.15 那帧的 128px/90px 网格叠图：
   左眼 (575,295) / 右眼 (700,295) → 中点 (638,295) ÷ 1280×720。 */
const FACE = { x: 0.498, y: 0.41 }
const SRC_W = 1280
const SRC_H = 720

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
    let moved = false // 鼠标还没动过 → 停在正面那一帧，别把 (0,0) 当成"左上角"
    let want = null // 指针此刻对应的锚点
    let aim = null // 正在播进的锚点；播进过程不打断，落位后再回头看 want
    let phase = 'hold' // hold 静止 / arming 等起播 seek / playing 播进中 / settle 落点校准
    let frontAt = 0 // 指针进入脸上死区的时刻
    let introSeekAt = 0
    let faceX = 0
    let faceY = 0
    let raf = 0
    let dodge = [] // measure() 生成：[{y 生效 scrollY, x, yOff}]
    let dx = 0 // 当前已应用的避让位移（视口比例）
    let dy = 0
    let lastTx = -1
    let lastTy = -1

    /* 触屏（没有可跟随的指针）才让首屏循环播；有指针或开了减少动效就钉在某一帧上。 */
    const looping = () => !fine && !reduce.matches
    /* 眼神状态机只在「有指针可跟 且 没开减少动效」时活着 */
    const gazeLive = () => fine && !reduce.matches

    function measure() {
      const hero = document.querySelector('.hero')
      const heroH = hero ? hero.offsetHeight : window.innerHeight
      anchor = heroH * HANDOFF
      docMax = document.documentElement.scrollHeight - window.innerHeight
      duration = main.duration > 0 && isFinite(main.duration) ? main.duration : duration
      // 脸在屏幕上的位置：getBoundingClientRect 已经带上了 CSS 的 scale，
      // 再按 object-fit:cover 的实际缩放把源片坐标映射过来。
      const r = intro.getBoundingClientRect()
      const s = Math.max(r.width / SRC_W, r.height / SRC_H)
      faceX = r.left + r.width / 2 + (FACE.x - 0.5) * SRC_W * s
      faceY = r.top + r.height / 2 + (FACE.y - 0.5) * SRC_H * s
      // 各板块「居中于视口」时的 scrollY，就是该板块避让档的生效点；档间线性插值
      dodge = DODGE.map(([sel, x, y]) => {
        const el = document.querySelector(sel)
        const mid = el ? el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2 : 0
        return { y: Math.min(docMax, Math.max(0, mid)), x, yOff: y }
      }).sort((a, b) => a.y - b.y)
    }

    /* 指针方向 → 锚点（点积最大的那个） */
    function gazeAnchor() {
      if (!moved) return GAZE[0]
      const vx = mx - faceX
      const vy = faceY - my // 屏幕 y 向下，取反成"向上为正"
      const len = Math.hypot(vx, vy)
      if (len < Math.min(window.innerWidth, window.innerHeight) * 0.5 * GAZE_DEAD) return GAZE[0]
      const ux = vx / len
      const uy = vy / len
      let best = GAZE[0]
      let bs = -2
      for (const a of GAZE) {
        const n = Math.hypot(a.x, a.y)
        if (!n) continue
        const sc = (a.x * ux + a.y * uy) / n
        if (sc > bs) {
          bs = sc
          best = a
        }
      }
      return best
    }

    /* seek 目标量化到整帧：落点必须是确定的那一帧，否则每次静止看到的画面会漂。 */
    function q(to) {
      return Math.round(to * FPS) / FPS
    }

    function seekIntro(to) {
      try {
        intro.currentTime = q(to)
        introSeekAt = performance.now()
        return true
      } catch {
        // metadata 还没到时浏览器会拒，下一帧重试
        return false
      }
    }

    function armIntro(a) {
      const to = a.from === a.t ? a.t : a.from
      if (!seekIntro(to)) return false
      phase = a.from === a.t ? 'hold' : 'arming'
      return true
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
      mx = e.clientX
      my = e.clientY
      moved = true
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
          if (looping()) {
            if (intro.paused) intro.play().catch(() => {})
          } else if (gazeLive()) {
            // 交棒期间 aim 可能已经落伍（滚走时指针还在动），回滚后先重新钉一次锚点帧
            phase = 'settle'
            seekIntro(aim ? aim.t : GAZE[0].t)
          }
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

      // 首屏眼神：这一层不做位移、不常驻播放，只在方向变化时播进对应锚点
      if (stage === 'intro' && gazeLive()) {
        want = gazeAnchor()
        if (want === GAZE[0]) {
          if (!frontAt) frontAt = now
        } else {
          frontAt = 0
        }
        const dwell = want !== GAZE[0] || now - frontAt >= GAZE_DWELL
        if (phase === 'hold' && want !== aim && dwell) {
          if (armIntro(want)) aim = want
        }
        if (
          phase === 'playing' &&
          (intro.currentTime >= q(aim.t) - 0.001 || intro.currentTime < q(aim.from) - 0.001)
        ) {
          // 到位（或万一 loop 绕回来了）→ 停住并把画面钉在锚点那一帧。
          // 两边都比"量化后的整帧"：拿原始秒数比会在 from 被舍入变小那档（5.05→5.0417）
          // 一开播就误判成绕回，直接跳过播进。
          intro.pause()
          if (Math.abs(intro.currentTime - q(aim.t)) > 0.001) {
            phase = 'settle'
            seekIntro(aim.t)
          } else {
            phase = 'hold'
          }
        }
        // seeked 迟迟不回来：起播那一步重试，落点那一步直接认了，别把状态机钉死
        if (phase === 'arming' && now - introSeekAt > SEEK_STALL) armIntro(aim)
        if (phase === 'settle' && now - introSeekAt > SEEK_STALL) phase = 'hold'
      }
    }

    const onSeeked = () => {
      seeking = false
    }

    const onIntroSeeked = () => {
      // seeked 是这台机器上唯一可靠的「画面已换帧」信号，状态机靠它推进
      if (phase === 'arming') {
        phase = 'playing'
        intro.play().catch(() => {
          phase = 'hold'
        })
      } else if (phase === 'settle') {
        phase = 'hold'
      }
    }

    const onVisibility = () => {
      if (document.hidden) return
      // 后台标签页里 seek 会被挂起，回到前台后必须允许重新发一次
      issuedFrame = -1
      seeking = false
      // 播进中途被切走的话 currentTime 已不可信：直接落回锚点那一帧，不再重播一遍转头
      phase = 'hold'
      if (aim) {
        if (!intro.paused) intro.pause()
        phase = 'settle'
        seekIntro(aim.t)
      }
    }

    /* 把首屏钉在注视帧上：触屏、开了「减少动效」或状态机复位时用。 */
    function holdIntro() {
      if (!intro.paused) intro.pause()
      phase = 'hold'
      aim = null
      try {
        intro.currentTime = q(want ? want.t : GAZE[0].t)
      } catch {
        // metadata 还没到时浏览器会拒，tick 里下一帧会补上
      }
    }

    function onPrefChange() {
      if (looping()) {
        if (stage === 'intro') intro.play().catch(() => {})
      } else {
        holdIntro()
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
    if (looping()) {
      // 触屏没有指针可跟，退回原来的循环播放
      intro.play().catch(() => {})
    } else {
      holdIntro()
    }

    main.addEventListener('seeked', onSeeked)
    intro.addEventListener('seeked', onIntroSeeked)
    intro.addEventListener('loadedmetadata', measure)
    const onMainMeta = () => {
      duration = main.duration
      main.pause()
      measure()
      onScroll()
    }
    main.addEventListener('loadedmetadata', onMainMeta)
    const onIntroPlay = () => {
      // autoplay 的启动是排队任务，会跑在脚本 pause() 之后，只能在事件上钉回。
      // phase==='playing' 时不能钉回：那正是我们自己发的播进。
      if (!looping() && phase !== 'playing') holdIntro()
    }
    intro.addEventListener('play', onIntroPlay)
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
      intro.removeEventListener('seeked', onIntroSeeked)
      intro.removeEventListener('loadedmetadata', measure)
      main.removeEventListener('loadedmetadata', onMainMeta)
      intro.removeEventListener('play', onIntroPlay)
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
