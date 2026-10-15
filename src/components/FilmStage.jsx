import './FilmStage.css'
import { useEffect, useRef } from 'react'
import { attachHeroRipple } from './ripple.js'

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
   intro.mp4 是 241 帧 / 24fps / 10.04s 的素材（帧号 N 就是 currentTime=N/24，编码时 start 已归零）。
   判读口径：对**装进仓库的这份编码**按 4fps 抽全片、脸部裁切、逐张判读（`%TEMP%\hero4-diag\g4\`），
   再在 10 个控制帧上用 2% 网格量双眼中点定 FACE。素材里的人把头连视线**顺时针扫了一整圈**：
     左(仅眼球) 0.00–0.20 → 左上 0.25–0.42 → 正上 0.46–0.79 → 右上 1.04–1.71 → 正右 1.88–3.04
     → 右下 3.17–3.96 → 正下 4.04–5.46 → 左下 5.54–6.21 → 正左(头转过去) 6.25–7.04
     → 左上(头转过去) 7.08–8.29 → 闭眼笑 8.38–8.63 → 回正看镜头笑 8.96–10.04
   区间是 4fps 粒度（±0.13s），不是逐帧定的；控制点取每段里方向最正、表情最干净的那一帧。
   绑定关系：「指针相对脸心的角度 → 这条圈上的素材时刻」，相邻控制点线性插值。
   中间那些时刻在素材里真实存在，指针连续动就等于画面连续动 —— 不需要插值算法去"追"。
   上一版按 0.18 逐帧插值追锚点，量出来是滞后 0.4s + 一跳跨过十几帧（详见 HANDOVER 第八轮）。

   ⚠️ 三件只有素材本身能决定的事，改这张表前先记住：
   1. **素材那一圈走了 405°（正左→…→正左→左上），指针环只有 360°**，多出的 45° 是"左上→正左"它演了两遍
      （先正面头只动眼，后整个头转过去）。这一版不再在 135° 上把两遍硬切，而是**让指针环跨过片子的结尾接回
      头转过去那一遍**：表里 `t` 允许为负 = "上一圈"，用 `LAP` 折回真实时刻。于是 a=135 与 a=495 读出同一帧
      N=194，环闭合、没有硬缝，`SEAM_HYST` 那套贴线迟滞随之删掉。
   2. 代价（实测，逐帧判读 N194/200/210/220/230/240 + N0/8/17）：尾段 N194→N240 演的是**头的回程**，视线在这
      46 帧里从左上**回摆到正左**（135°→180°）。所以「指针从左上往正上」那 33° 行程（135°→102°，102° 就是循环点）
      里眼睛是**逆着鼠标**走的，最大方向误差 78°；过了 102° 才折回来追，指针到正上 90° 时误差归零。
      也就是说"视线=指针方向"只在正上→右→下→左→左上那 327° 上成立。换掉的是硬切，赔上的是这 33° 的跟随。
   3. 素材里那一次"闭眼笑"逐帧量到的是 **N=205–209**（8.54–8.71s；早先按 4fps 记成 8.38–8.63 是粗了）。
      它**现在落在环上**了：指针停在 124°~127° 就是闭眼帧，往正上那侧的播进也会一路经过它（动着看是一次
      真眨眼，停在那一条上就是一帧闭眼定格 —— 实测见 `%TEMP%\hero4-diag\blink\blink.jpg`）。
      环以外那几档的 lead 起播点仍然避开它（左上 7.33、FRONT 9.08，都不落进去）。
   `lead` = 起播点往回多少秒，是素材里"进入该姿态"那段动作的实际长度，逐段量的。 */
const ARC = [
  { a: 135, t: 8.083, lead: 0.5 }, // 左上（头整个转向左、眼睛左上，N=194）——这段 170–199 里只有 194/197 闭口带笑，188 还张着嘴
  { a: 180, t: 6.75, lead: 0.6 }, // 正左（四分之三侧脸朝左，N=162）
  { a: 225, t: 5.833, lead: 0.5 }, // 左下（N=140）
  { a: 270, t: 5.0, lead: 0.5 }, // 正下（低头，脸会掉到画面中下，N=120）
  { a: 315, t: 3.75, lead: 0.4 }, // 右下（旧素材缺这一档，这条有，N=90）
  { a: 360, t: 2.5, lead: 0.5 }, // 正右（四分之三侧脸朝右，N=60）
  { a: 405, t: 1.5, lead: 0.4 }, // 右上（N=36）
  { a: 450, t: 0.708, lead: 0.35 }, // 正上（眼睛向上、张嘴惊讶，N=17）
  { a: 495, t: -1.958, lead: 0.5 }, // 左上＝N=194 的"上一圈"（-47/24）：跨过片子结尾接回出发点，环在此闭合
]
/* 一圈的长度：装进仓库的这份编码 241 帧 @24fps。ARC 里负的 t 表示"上一圈"，加上 LAP 才是视频真实时刻，
   所以指针环可以在片子结尾处无缝绕回头部（N=240 与 N=0 头/眼同姿态，只差嘴型）。
   ⚠️ 口径：ARC 的 t、want/aimT/aimFrom、以及 tick 里读回来的 cur **一律是这个"虚拟时刻"**，
   距离比较全在虚拟空间做（否则每次跨过循环点都会算成 10 秒的大跳、各发一次播进）。
   只有真正写 currentTime 那一步用 realize() 折回真实秒。 */
const LAP = 241 / FPS
const realize = (v) => (v < 0 ? v + LAP : v)
/* 把视频报的真实时刻折回 ref 所在的那一圈：跨循环点时读数会从 10.04 掉到 0，这里认得出那是同一瞬间。 */
const unwrap = (real, refV) => real + LAP * Math.round((refV - real) / LAP)
/* 指针贴在脸上、或鼠标还没动过时钉的这一帧：正面、闭口微笑、看镜头（8.96–10.04 整段都是它）。 */
const FRONT = { t: 9.583, lead: 0.5 }
const GAZE_DEAD = 0.1 // 指针落在这个半径内（以短边一半为单位）视为"贴在脸上"→ 正面
/* 横扫（左→右）的指针路径必然从脸上掠过，死区是它中途的一站。所以"切回正面"要额外
   等指针在死区里停够 120ms 才认 —— 否则一次横扫被拆成"回正→再转向"两段，
   多一对 seek，看着就是两次抖。门槛只加在"切回正面"这一边，别的方向变化照常立即响应。 */
const GAZE_DWELL = 120
const GAZE_EPS = 1.5 / FPS // 差在一帧半以内不重发 seek，否则静止画面会自己抖
const GAZE_REAIM = 3 / FPS // 播进途中目标又挪出三帧半 → 作废这次播进，改瞄新目标
const SCRUB_MAX = 0.3 // 目标与当前差 ≤0.3s 直接 scrub 过去；更远才用素材自己的动作播进
/* 指针"停下来"多久才允许播进（ms）。拖动途中目标每拍都在挪，若每拍都够到 SCRUB_MAX 就各发一次
   播进，而播进是"先回卷到 t-lead、再往前播"—— 一路拖就一路回卷，看着就是左侧那种一下一下的顿挫
   （实测一次甩到左侧里 play()/回卷 6 轮，正左 lead 最大 0.6s → 回卷最狠）。所以只有指针不再挪、
   且离目标还 >SCRUB_MAX 时才补一次播进，把"停下来的最后一段"做成自然转头；途中一律 scrub。 */
const PLAYIN_SETTLE = 90
/* 素材里那次"闭眼笑"逐帧量到的是 N=205–209（8.54–8.71s）。环闭合后它落在环上（指针 124°–127°），
   于是出现一个只有这版才会有的问题：鼠标停在那一小条上 = 一帧闭眼定格，而"眼神跟随"要的恰恰是
   眼睛在看东西。路过没事（那是一次真眨眼），定格才是问题 → 落点一律不许停在这 5 帧里。
   ⚠️ 判帧号要先 realize()：指针 102°–135° 那一段的虚拟 t 是**负的**（上一圈），
   直接 round(t*24) 会得到负帧号，整条闭眼带都漏判。推走时也按同圈的偏移推，
   不能推成 8.75s 那种真实刻 —— 那在虚拟空间里是一整圈的跳变，会把播进条件全打乱。 */
const BLINK = [205, 209]
function noBlink(t) {
  const n = Math.round(realize(t) * FPS)
  return n >= BLINK[0] && n <= BLINK[1] ? t + (BLINK[1] + 1 - n) / FPS : t
}
/* 交棒前的"收回初始表情"：滚轮一动就停止跟随，把离开那一刻的那一帧钉成回程起点，之后按
   scrollY 到交棒点的**比例**把画面拉回 FRONT。用比例而不是定时：甩一下 200ms 就能滚过那 35vh，
   定时的回程会被交棒打断、脸停在半路，而交棒是 0.5s 的 opacity 交叉淡入 —— 一旦开始淡出，
   回程再走完也没人看得见。比例驱动保证"到交棒点时已经回正"，与手速无关。 */
const RETURN_AT = 24 // px：超过这个滚动量才算"要离开首屏"，防住回弹与触控板的 1~2px 抖动
/* 回程走**帧号最短路**（±120 帧以内），正向反向都行：素材里相邻帧本来就挨着。
   反向就是倒放这一段动作 —— 交棒那一刻要的是"收回正面"，不是重演一遍转头，
   所以从左上(N=194)回正只走 36 帧，从正上(N=17)回正倒着跨过片尾只要 28 帧。
   落点同样过 noBlink：回程也不许在交棒前闪一帧闭眼。 */
const FRONT_N = Math.round(FRONT.t * FPS)
function returnT(from, u) {
  const d = ((FRONT_N - from + 241 + 120) % 241) - 120
  return noBlink(((((from + d * u) % 241) + 241) % 241) / FPS)
}
/* 双眼中点在源片里的位置：ARC 的 9 个控制帧 + FRONT 各在 2% 网格叠图上量一次
   （x 0.39–0.60、y 0.37–0.52，头会转会低，走的范围比旧素材大得多）取均值 = (0.497, 0.429)。
   单次读数本身有 ±2% 的手动误差，所以均值也别当成精确值 —— 支点错 2% ≈ 屏幕上 26px，
   指针离脸 400px 时约等于 3.7° 的角度偏差，这就是这张表能给的最好精度。
   取均值而不是照某一帧钉死：脸在素材里本来就到处走。 */
const FACE = { x: 0.497, y: 0.429 }
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
  const rippleRef = useRef(null)

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
    let want = null // 指针此刻对应的目标帧 { t, lead }
    let aimT = 0 // 本次播进要落的时刻；进行中若指针挪出 GAZE_REAIM 就作废重瞄（见 tick）
    let aimFrom = 0 // 本次过渡发出去的那个 seek 落点（播进时＝起播点，scrub 时＝aimT）
    let phase = 'hold' // hold 静止 / arming 等起播 seek / playing 播进中 / seek 等一次 seek 落位
    let frontAt = 0 // 指针进入脸上死区的时刻
    let prevWantT = -1 // 上一拍的目标时刻，用来分辨"指针还在拖" vs "停在哪儿不动了"（见 PLAYIN_SETTLE）
    let wantStableAt = 0 // 目标最后一次挪动的时刻
    let retFrom = -1 // -1 = 还没触发回程；否则钉住"离开首屏那一刻的那一帧"，回程按滚动比例往 FRONT 走
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

    /* 指针 → 视线角（屏幕系、逆时针、向上为正）→ 素材时刻，沿 ARC 线性插值。
       ARC 的角域是**展开过的** [135,495)，两端都读 N=194（末端的 t 是负的一圈，见 LAP），所以这是个
       闭合环：指针绕一圈回到左上，素材正好顺着片子的结尾回到出发点，没有缝、不需要迟滞。
       指针角 <135 的先加 360 再插值，(315,360) 这类跨 0° 的区间不再需要钳位。 */
    function gazeTarget() {
      if (!moved) return FRONT
      const vx = mx - faceX
      const vy = faceY - my // 屏幕 y 向下，取反成"向上为正"
      const len = Math.hypot(vx, vy)
      if (len < Math.min(window.innerWidth, window.innerHeight) * 0.5 * GAZE_DEAD) return FRONT
      let a = (Math.atan2(vy, vx) * 180) / Math.PI
      if (a < 0) a += 360
      if (a < ARC[0].a) a += 360
      let lo = ARC[0]
      let hi = ARC[ARC.length - 1]
      for (let i = 1; i < ARC.length; i++) {
        if (ARC[i].a >= a) {
          lo = ARC[i - 1]
          hi = ARC[i]
          break
        }
      }
      const k = hi.a === lo.a ? 0 : (a - lo.a) / (hi.a - lo.a)
      return { t: noBlink(lo.t + (hi.t - lo.t) * k), lead: lo.lead + (hi.lead - lo.lead) * k }
    }

    /* seek 目标量化到整帧：落点必须是确定的那一帧，否则每次静止看到的画面会漂。
       进来的都是虚拟时刻，realize() 折回真实秒之后才量化（q 对 LAP 的整数倍不变，两侧等价）。 */
    function q(to) {
      return Math.round(to * FPS) / FPS
    }

    function seekIntro(to) {
      try {
        // 钳到最后一帧：虚拟时刻刚跨过循环点时 realize() 会得到正好一圈的 10.0417，
        // 量化成 N=241 —— 这份编码只有 0..240，写进去等于 seek 到 duration 边界。
        intro.currentTime = Math.min(q(realize(to)), LAP - 1 / FPS)
        introSeekAt = performance.now()
        return true
      } catch {
        // metadata 还没到时浏览器会拒，下一帧重试
        return false
      }
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
            // 交棒期间指针可能已经换向，滚回来先重新钉一次当前该看的帧（aimT 可能是 0=N0，别当假值）
            phase = 'seek'
            seekIntro(want ? want.t : FRONT.t)
          }
        } else {
          if (!intro.paused) intro.pause()
          /* 一次甩动就能从 u≈0.6 直接越过 anchor：这一拍 stage 已经是 main，下面的眼神块
             （gate 在 stage==='intro'）不再执行，回程会断在半路 —— 淡出那 0.5s 里观众看到的是一张
             转到一半的脸。所以交棒这一刻无条件把 intro 钉回 FRONT，回程走没走完都收正。
             只在眼神状态机活着时钉：触屏那一档 intro 是循环播放的，钉回 FRONT 等于把滚回来的
             续播点挪走，那不是这里要的事。 */
          if (gazeLive()) seekIntro(FRONT.t)
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

      // 首屏眼神：这一层不做位移、不常驻播放，只在指针换向时把画面挪到角度对应的那一帧
      if (stage === 'intro' && gazeLive()) {
        /* 滚轮一动就交权：越过 RETURN_AT 后指针不再决定画面，回程只由 scrollY 到交棒点的比例驱动，
           到 anchor 时正好回正 —— 交棒前那 0.5s 淡出里观众看到的已经是正面脸，下一段人物动画接的是同一姿态。
           往回滚到 RETURN_AT 以内则把这段路倒着走回去、指针重新接管（没离开首屏就不算交棒）。 */
        const u =
          anchor > RETURN_AT ? Math.min(1, Math.max(0, (window.scrollY - RETURN_AT) / (anchor - RETURN_AT))) : 0
        if (u > 0) {
          if (retFrom < 0) retFrom = Math.round(intro.currentTime * FPS) % 241
          want = { t: returnT(retFrom, u), lead: 0 }
        } else {
          retFrom = -1
          want = gazeTarget()
        }
        if (want === FRONT) {
          if (!frontAt) frontAt = now
        } else {
          frontAt = 0
        }
        const dwell = want !== FRONT || now - frontAt >= GAZE_DWELL
        const cur = unwrap(intro.currentTime, want.t)
        /* "还在拖"= 目标帧这一拍比上一拍挪了 ≥一帧半。每拍都刷 prevWantT，好让停下来那一刻
           wantStableAt 就停在最后一次真动上；PLAYIN_SETTLE 就是从那一刻起算的静止时长。 */
        const moving = prevWantT >= 0 && Math.abs(q(want.t) - q(prevWantT)) > GAZE_EPS
        if (moving) wantStableAt = now
        prevWantT = want.t
        if (phase === 'hold' && dwell && Math.abs(cur - want.t) > GAZE_EPS) {
          // 差得近、或指针还在拖 → scrub：素材里相邻方向的帧本来就挨着，一路 scrub 本身就是那段转头。
          // 只有指针停下来(见 PLAYIN_SETTLE)、离目标还 >SCRUB_MAX 时，才回卷起播点用素材动作播进，
          // 把"最后停住的那一段"补成自然转头 —— 拖动途中绝不播进，否则就是原地反复回卷的顿挫。
          const playIn = !moving && now - wantStableAt >= PLAYIN_SETTLE &&
            Math.abs(cur - want.t) > SCRUB_MAX && want.lead > 0
          aimT = want.t
          aimFrom = playIn ? want.t - want.lead : want.t
          if (seekIntro(aimFrom)) phase = playIn ? 'arming' : 'seek'
        }
        if (phase === 'playing') {
          // 播进途中指针又挪出三帧半：就地收手，下一帧改瞄新目标。
          // 放任播进跑完的话，它会把画面拖向一个已经过期的姿势——实测拖了 338ms 才回头补一次
          // 5.9→0.79 的大跳转，用户看到的「跟不上」全是这一段，不是 seek 慢。
          if (dwell && Math.abs(q(want.t) - q(aimT)) > GAZE_REAIM) {
            intro.pause()
            phase = 'hold'
          } else if (cur >= q(aimT) - 0.001 || cur < q(aimFrom) - 0.001) {
            // 到位（或万一 loop 绕回来了）→ 停住并把画面钉在那一帧。
            // 两边都比"量化后的整帧"：拿原始秒数比会在起播点被舍入变小那档
            // （如 5.05→5.0417）一开播就误判成绕回，直接跳过播进。
            intro.pause()
            if (Math.abs(cur - q(aimT)) > 0.001) {
              phase = 'seek'
              seekIntro(aimT)
            } else {
              phase = 'hold'
            }
          }
        }
        // seeked 迟迟不回来：起播那一步重试，落点那一步直接认了，别把状态机钉死
        if (phase === 'arming' && now - introSeekAt > SEEK_STALL) {
          if (seekIntro(aimFrom)) phase = 'arming'
        }
        if (phase === 'seek' && now - introSeekAt > SEEK_STALL) phase = 'hold'
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
      } else if (phase === 'seek') {
        phase = 'hold'
      }
    }

    const onVisibility = () => {
      if (document.hidden) return
      // 后台标签页里 seek 会被挂起，回到前台后必须允许重新发一次
      issuedFrame = -1
      seeking = false
      // 播进中途被切走的话 currentTime 已不可信：直接落回目标那一帧，不再重播一遍转头
      phase = 'hold'
      if (aimT) {
        if (!intro.paused) intro.pause()
        phase = 'seek'
        seekIntro(aimT)
      }
    }

    /* 把首屏钉在注视帧上：触屏、开了「减少动效」或状态机复位时用。 */
    function holdIntro() {
      if (!intro.paused) intro.pause()
      phase = 'hold'
      aimT = 0
      try {
        intro.currentTime = q(want ? want.t : FRONT.t)
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
    /* 首屏指针涟漪：它画得出画面就把上面那张 <video> 盖掉，画不出来（没 WebGL2、开了减少动效、
       没有可跟的指针）这层等于不存在。形状与配色由它自己从 intro 这一层的 computedStyle 现读，
       所以这里只递元素和脸的位置 —— CSS 仍然是唯一的真源。 */
    const ripple = attachHeroRipple({
      root, canvas: rippleRef.current, video: intro, face: FACE, src: [SRC_W, SRC_H],
    })
    raf = requestAnimationFrame(tick)

    return () => {
      ripple?.destroy()
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
      {/* 指针涟漪层：夹在两张片之间 —— 交棒时它跟着首屏一起淡出，交叉溶解的形状和原来一模一样 */}
      <canvas className="film-ripple" ref={rippleRef} />
      {/* 主视频层 preload="metadata"（2026-10-15 Q04，服务器侧限速实测，cf/sc26_wire_server.cjs）：
          auto 会在用户一次滚动都没有的情况下把整份 7,810,527 B 拉完（一条 bytes=0-，aborted=false，
          两次采样分别在起播 1.12s/2.70s、收完 8.37s/10.24s）；降到 metadata 后 Chrome 缓冲够了
          就把同一条请求掐掉（aborted=true），过线 1,277,952 B 与 1,441,792 B 两档 ——
          省 6.37–6.53 MB = −81.5%～−83.6%。⚠️ 取消点随网速/时序浮动，别把这个数当常量。
          代价为零：moov 在第 32 字节（faststart，5,216 B），duration 照样拿得到 → tick 里
          「stage==='main' && duration>0」那道 seek 门照开。交棒与 auto 实测一致：+120ms 时
          main.readyState 已是 4，第一帧 177ms vs auto 的 174ms，之后 6 个采样点
          画面平均亮度 74.72–75.52、近黑像素 0%，与 auto 同档。
          ⚠️ 别顺手改成 none：none 拿不到 duration → 那道门永久不开 → 第二段片子彻底不动，
          画面掉到平均亮度 13.78 / 78.7% 近黑。也无需补 poster：metadata 档交棒时第 0 帧已在
          缓冲里，poster 根本不会被画，白付 54 KB。
          intro 那层保持 auto：它是首屏正看着的一层、也是涟漪的纹理源，降级只会让每次眼神 seek
          都重新发一次 range 请求。 */}
      <video
        className="film-layer film-layer--main"
        ref={mainRef}
        muted
        playsInline
        preload="metadata"
        src="/assets/scrolly/main.mp4"
      />
      <div className="film-scrim" />
    </div>
  )
}
