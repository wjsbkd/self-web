import './Hero.css'
import { useRef, useEffect } from 'react'
import Arrow from '@/components/Arrow.jsx'
import Magnetic from '@/components/Magnetic.jsx'
import { useResume } from '@/data/hooks'
import { resumePdf as localResumePdf } from '@/data/nav.js'

// Hero 首页 —— 背景换成全站影片层（FilmStage）后，本组件只负责内容与离场。
// 原先手工搭的天光 / 数字雨 / 穹顶 / 灯泡四层已移除：首屏画面由首屏视频承担，
// 跟随鼠标的视差也在 FilmStage 里做（它持有那两个 <video> 的引用）。
export default function Hero() {
  const heroRef = useRef(null) // 区块根：驱动 --hero-exit 滚动进度
  const { data: resume } = useResume()
  const resumePdf = resume?.profile?.resumeFile ?? localResumePdf
  const contentRef = useRef(null) // 内容层：近景视差 + 滚动退出

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

  // 内容层随滚动离场（上移 + 缩小 + 淡出 + 模糊）。尊重「减少动效」：
  // 那是自主运动，不是用户主动触发的效果。
  useEffect(() => {
    const hero = heroRef.current
    const content = contentRef.current
    if (!hero || !content) return

    let raf = 0
    let bound = false

    const apply = () => {
      raf = 0
      const h = hero.offsetHeight
      const exit = Math.min(Math.max(window.scrollY / h, 0), 1)
      hero.style.setProperty('--hero-exit', exit.toFixed(3))
      const cRect = content.getBoundingClientRect()
      const cOff = (cRect.top + cRect.height / 2 - window.innerHeight / 2) / window.innerHeight
      content.style.transform = `translate3d(0, ${(cOff * 22 - exit * 42).toFixed(2)}px, 0) scale(${(1 - exit * 0.08).toFixed(3)})`
      content.style.opacity = (1 - exit).toFixed(3)
      content.style.filter = `blur(${(exit * 5).toFixed(2)}px)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const bind = () => {
      if (bound) return
      bound = true
      apply()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    }
    const unbind = () => {
      if (!bound) return
      bound = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      content.style.transform = ''
      content.style.opacity = ''
      content.style.filter = ''
    }

    const onPref = (e) => (e.matches ? unbind() : bind())
    if (!reduceMotionRef.current) bind()
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', onPref)

    return () => {
      unbind()
      mq.removeEventListener('change', onPref)
    }
  }, [])

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero-content wrap" ref={contentRef}>
        {/* 参考图的海报分工：满幅巨型标题压过主体，微标签缩在标题下方的左右两角，
            正文与 CTA 沉到画面底部两端。原先那四行点阵短列是为让开人头设计的，
            本轮不再让 —— 大字出血本身就是这套语言的主体，可读性由顶部压暗带兜住。
            两半字重对撞（800 / 300）对应参考图的「DJ Zak」重、「Derdan」轻。 */}
        <h1 className="hero-headline">
          <span className="line">让想法被看见，</span>
          <span className="line line--whisper">让体验被记住。</span>
        </h1>

        <div className="spec hero-spec">
          <span>Portfolio // 2026</span>
          <span className="spec--bracket">Li Zongheng // Creative Operator</span>
        </div>

        <div className="hero-foot">
          <p className="hero-sub">
            <span className="bullet">在内容、运营与现场执行的交界处，</span>
            <span className="bullet">将创意转化为可见的影响力。</span>
          </p>

          <div className="hero-cta-group">
            <Magnetic strength={0.4} radius={120}>
              <a className="pill" href="#work">
                探索精选项目 <Arrow />
              </a>
            </Magnetic>
            <Magnetic strength={0.3} radius={100}>
              <a
                className="pill pill--ghost"
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

      {/* 滚动提示（极简指示器 + 流动光点） */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
