import './Hero.css'
import { useRef, useEffect } from 'react'
import Arrow from '@/components/Arrow.jsx'
import Magnetic from '@/components/Magnetic.jsx'
import HeroGlobe from '@/components/HeroGlobe.jsx'
import { resumePdf } from '@/data/nav.js'

// Hero 首页 —— Claude 编辑式封面 × Apple 滚动编排（亮调版）
// 结构：暖色光晕背景 + 衬线大标题（斜体重音）+ 编辑式元数据 + 磁性 CTA + 滚动提示
// 动效：入场逐行揭示（Apple）+ 多层视差（Apple）+ 左侧反色光标聚光灯（MiMo 式）+ 右侧灯泡（hover 点亮四散发光，光晕随鼠标速度/方向自转）
export default function Hero() {
  const heroRef = useRef(null) // 区块根：驱动 --hero-exit 滚动进度
  const glowRef = useRef(null) // 背景光晕：远景慢视差
  const contentRef = useRef(null) // 内容层：近景视差 + 滚动退出
  const invertRef = useRef(null) // 左侧反色聚光灯（hero 顶层，与背景同层混合）
  const globeWrapRef = useRef(null) // 右侧灯泡包裹：鼠标交互区
  const globeBodyRef = useRef(null) // 灯泡光晕 SVG 主体：JS 驱动自转（旋转辐射光）
  const bulbRef = useRef(null) // 灯泡本体：hover 命中区

  // 「减少动效」偏好在系统设置里可随时切换，用 ref 持有最新值供下面的 effect 读取
  const reduceMotionRef = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => {
      reduceMotionRef.current = e.matches
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Hero 运动 loop：光晕视差 + 内容视差/退出 + 反色光标 + 地球仪速度自转
  useEffect(() => {
    const hero = heroRef.current
    const glow = glowRef.current
    const content = contentRef.current
    const invert = invertRef.current
    const globeWrap = globeWrapRef.current
    const globeBody = globeBodyRef.current
    if (!hero || !glow || !content || !invert || !globeWrap || !globeBody) return

    // 仅自动视差/滚动退出尊重「减少动效」；光标反色与地球仪交互是用户主动触发，
    // 不受此限制（否则开了减少动效的用户会完全看不到效果）。
    // 注意：下面各分支直接读 reduceMotionRef.current（而非挂载时取一次），
    // 这样用户在系统设置里切换该偏好后，无需刷新即可生效。
    const reduceMotion = () => reduceMotionRef.current

    let raf = 0

    const apply = () => {
      raf = 0
      const h = hero.offsetHeight
      const y = window.scrollY
      const exit = Math.min(Math.max(y / h, 0), 1)
      hero.style.setProperty('--hero-exit', exit.toFixed(3))
      const V = window.innerHeight

      // 光晕：远景慢视差（反方向）+ 离场微微绽放
      const gRect = glow.getBoundingClientRect()
      const gOff = (gRect.top + gRect.height / 2 - V / 2) / V
      const gPar = gOff * -8
      glow.style.transform =
        `translate3d(0, ${gPar.toFixed(2)}px, 0) scale(${(1 + exit * 0.2).toFixed(3)})`

      // 内容：近景视差 + 滚动退出（缩放 / 淡出 / 模糊）
      const cRect = content.getBoundingClientRect()
      const cOff = (cRect.top + cRect.height / 2 - V / 2) / V
      const cPy = cOff * 22
      content.style.transform =
        `translate3d(0, ${(cPy - exit * 42).toFixed(2)}px, 0) scale(${(1 - exit * 0.08).toFixed(3)})`
      content.style.opacity = (1 - exit).toFixed(3)
      content.style.filter = `blur(${(exit * 5).toFixed(2)}px)`
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    // 整屏（hero）鼠标移动：同一处理函数同时驱动
    //  ① 左侧反色光标聚光灯（仅左侧文字区生效，进入右侧地球仪区时隐藏）
    //  ② 右侧灯泡：鼠标在画面内任意位置移动，光晕按方向/速度跟随自转
    //     —— 不再要求鼠标压在球上；垂直移动额外带动一点立体倾斜。
    let lastX = null
    let lastY = null
    let lastT = null
    let tilt = 0
    let rotation = 0
    let velocity = 0
    let targetVelocity = 0

    const onHeroMove = (e) => {
      const rect = hero.getBoundingClientRect()
      // ① 反色聚光灯跟随光标（hero 坐标）
      invert.style.setProperty('--ix', `${e.clientX - rect.left}px`)
      invert.style.setProperty('--iy', `${e.clientY - rect.top}px`)
      const gRect = globeWrap.getBoundingClientRect()
      const overGlobe =
        e.clientX >= gRect.left - 24 &&
        e.clientX <= gRect.right + 24 &&
        e.clientY >= gRect.top - 24 &&
        e.clientY <= gRect.bottom + 24
      invert.classList.toggle('is-active', !overGlobe)
      // 灯泡：仅光标真正落在灯泡本体上才点亮四散发光；落在周围空白不触发
      let onBulb = false
      if (bulbRef.current) {
        const b = bulbRef.current.getBoundingClientRect()
        onBulb =
          e.clientX >= b.left &&
          e.clientX <= b.right &&
          e.clientY >= b.top &&
          e.clientY <= b.bottom
      }
      globeWrap.classList.toggle('is-lit', onBulb)

      // ② 右侧灯泡：鼠标在画面内任意位置移动，光晕按方向/速度跟随自转
      const now = performance.now()
      if (lastX !== null && lastT !== null) {
        const dt = now - lastT
        if (dt > 0 && dt < 120) {
          const dx = e.clientX - lastX
          const dy = e.clientY - lastY
          // 向右划 → 顺时针；向左划 → 逆时针（即"往左自转"），系数决定灵敏度
          targetVelocity += dx * 0.35
          // 垂直移动给一点 X 轴倾斜，增强"被拨动"的立体感，带上下限
          tilt = Math.max(-18, Math.min(18, tilt + dy * 0.6))
        }
      }
      lastX = e.clientX
      lastY = e.clientY
      lastT = now
    }
    const onHeroLeave = () => {
      invert.classList.remove('is-active')
      globeWrap.classList.remove('is-lit')
      lastX = null
      lastY = null
      lastT = null
    }

    if (!reduceMotion()) {
      apply()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    }
    hero.addEventListener('mousemove', onHeroMove)
    hero.addEventListener('mouseleave', onHeroLeave)

    // === 右侧灯泡：命令式 rAF 自转（绕 Z 轴，驱动光晕/放射线）+ 倾斜回正 ===
    // 监听已移至整屏 hero，故这里只负责惯性/阻尼推进与空闲慢转。
    // 用 IntersectionObserver 启停：hero 滚出视口后逐帧写 transform 纯属空耗，
    // 而上方视差循环本就随滚动停止，两者原本不一致。
    let rafGlobe = 0
    const globeLoop = () => {
      // 角速度平滑追上鼠标瞬时速度
      velocity += (targetVelocity - velocity) * 0.12
      // 阻尼（惯性衰减）
      velocity *= 0.94
      // 极低速时给一个微小的 idle 自转，让球不会死寂
      if (!reduceMotion() && Math.abs(velocity) < 0.03) {
        velocity += 0.015
      }
      rotation += velocity
      globeBody.style.transform = `rotateZ(${rotation.toFixed(2)}deg)`
      // 倾斜回正：无垂直输入时自然回到 0
      tilt *= 0.94
      globeWrap.style.setProperty('--globe-tilt-x', `${tilt.toFixed(2)}deg`)
      // 鼠标停止输入后目标角速度也衰减
      targetVelocity *= 0.9
      rafGlobe = requestAnimationFrame(globeLoop)
    }
    const stopGlobe = () => {
      if (rafGlobe) cancelAnimationFrame(rafGlobe)
      rafGlobe = 0
    }
    const startGlobe = () => {
      if (!rafGlobe) rafGlobe = requestAnimationFrame(globeLoop)
    }
    globeLoop()
    const visObs = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startGlobe() : stopGlobe()),
      { threshold: 0 }
    )
    visObs.observe(hero)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      hero.removeEventListener('mousemove', onHeroMove)
      hero.removeEventListener('mouseleave', onHeroLeave)
      visObs.disconnect()
      if (raf) cancelAnimationFrame(raf)
      stopGlobe()
    }
  }, [])

  return (
    <section className="hero" id="top" ref={heroRef}>
      {/* 背景画布：暖色光晕 + 极淡网格 + 右侧灯泡 */}
      <div className="hero-canvas" aria-hidden="true">
        <div className="hero-glow" ref={glowRef} />
        <div className="hero-globe-wrap" ref={globeWrapRef}>
          <HeroGlobe bodyRef={globeBodyRef} bulbRef={bulbRef} />
        </div>
        <div className="hero-grid" />
      </div>

      <div className="hero-content wrap" ref={contentRef}>
        <p className="hero-eyebrow">
          <span>01</span> — PORTFOLIO / 2026
        </p>

        {/* Claude 招牌：衬线大标题 + 斜体词重音（"被看见，"）
            Apple 招牌：三行 stagger 逐行揭示入场 */}
        <h1 className="hero-headline">
          <span className="line">让想法</span>
          <span className="line">
            <i>被看见，</i>
          </span>
          <span className="line">让体验被记住。</span>
        </h1>

        <div className="hero-foot">
          <div className="hero-intro">
            <p className="hero-name">
              李纵横 <span>/ LI ZONGHENG</span>
            </p>
            <p className="hero-role">AI 内容运营与视觉创作者</p>
            <p className="hero-desc">
              在内容、运营与现场执行的交界处，将创意转化为可见的影响力。
            </p>
          </div>

          <div className="hero-cta-group">
            <Magnetic strength={0.4} radius={120}>
              <a className="hero-cta-primary" href="#work">
                探索精选项目 <Arrow />
              </a>
            </Magnetic>
            <Magnetic strength={0.3} radius={100}>
              <a
                className="hero-cta-secondary"
                href={resumePdf}
                target="_blank"
                rel="noreferrer"
                download
              >
                下载简历 <Arrow />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* 左侧反色光标聚光灯：hero 顶层、与背景同层，mix-blend-mode 局部反色 */}
      <div className="hero-invert-spotlight" ref={invertRef} aria-hidden="true" />

      {/* 滚动提示（Apple 风格极简指示器 + 流动光点） */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>

      <p className="side-note">
        LIZONGHENG / CREATIVE OPERATOR <span /> 2026
      </p>
    </section>
  )
}
