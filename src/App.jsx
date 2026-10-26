import { useEffect, useState } from 'react'
import Nav from '@/components/Nav.jsx'
import FilmStage from '@/components/FilmStage.jsx'
import Hero from '@/components/Hero.jsx'
import About from '@/components/About.jsx'
import Experience from '@/components/Experience.jsx'
import Projects from '@/components/Projects.jsx'
import Media from '@/components/Media.jsx'
import AccountOperations from '@/components/AccountOperations.jsx'
import Strengths from '@/components/Strengths.jsx'
import Footer from '@/components/Footer.jsx'
import CursorGlow from '@/components/CursorGlow.jsx'
import SectionDots from '@/components/SectionDots.jsx'
import useScrollSpy from '@/hooks/useScrollSpy.js'
import useKeyboardNav from '@/hooks/useKeyboardNav.js'
import usePressSwing from '@/hooks/usePressSwing.js'
import { navLinks } from '@/data/nav.js'
import { registerLiveRefresh } from '@/data/sanityData'
import { useSiteSettings } from '@/data/hooks'
import ProjectDetail from '@/components/ProjectDetail.jsx'
import BackgroundMusic from '@/components/BackgroundMusic.jsx'

// 应用根组件：固定导航 + 按页面结构顺序组合各区块
export default function App() {
  const ids = navLinks.map((l) => l.id)
  const active = useScrollSpy(['top', ...ids])

  // 键盘导航：方向键跳转章节（含 Hero 顶部）
  useKeyboardNav(['top', ...ids])

  // 按钮按压时图标的阻尼摆动（document 级委托，只挂一次）
  usePressSwing()

  // 全局设置（SEO / 联系方式 / 背景音乐）；首帧用本地兜底，Sanity 回来后替换
  const { data: site } = useSiteSettings()

  // 实时刷新：后台发布后，前台切回可见时静默重新查询
  useEffect(() => {
    return registerLiveRefresh()
  }, [])

  // SEO + 分享元信息动态注入（来自全局设置 / 本地兜底）
  useEffect(() => {
    const seo = site?.seo
    if (!seo) return
    if (seo.seoTitle) document.title = seo.seoTitle
    if (seo.seoDescription) setMeta('description', seo.seoDescription)
    if (seo.shareCover) setOgMeta('og:image', seo.shareCover, 'property')
    if (seo.siteName) setOgMeta('og:site_name', seo.siteName, 'property')
  }, [site])

  // 作品详情页路由（hash 路由，兼容静态托管无 SPA fallback）
  const [detailSlug, setDetailSlug] = useState(parseDetailSlug())
  useEffect(() => {
    const onHash = () => setDetailSlug(parseDetailSlug())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // SectionDots 数据（与导航一致）
  const dotSections = [{ id: 'top', label: '首页' }, ...navLinks.map((l) => ({ id: l.id, label: l.label }))]

  // 详情页打开时，主页面隐藏（用 portal 渲染全屏详情）
  if (detailSlug) {
    return (
      <ProjectDetail
        slug={detailSlug}
        onClose={() => {
          window.location.hash = '#top'
        }}
      />
    )
  }

  return (
    <>
      {/* 影片层必须在 <main> 之前：各 section 是 position:relative，
          与它同层叠上下文时按 DOM 顺序压在它上面 */}
      <FilmStage />
      <CursorGlow />
      <Nav active={active} />
      <SectionDots sections={dotSections} active={active} />
      <main>
        <Hero />
        <About />
        <Strengths />
        <Experience />
        <Projects />
        <Media />
        <AccountOperations />
        <Footer />
      </main>
      {/* 背景音乐：默认不自动播放，由用户主动开启并记忆偏好 */}
      <BackgroundMusic />
    </>
  )
}

/** 从 location.hash 解析详情页 slug（#/project/:slug） */
function parseDetailSlug() {
  const m = window.location.hash.match(/^#\/project\/(.+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

/** 设置 meta 标签（按 name 或 property） */
function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** 设置 Open Graph / Twitter 元标签 */
function setOgMeta(name, content, attr) {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
