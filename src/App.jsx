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
import { navLinks } from '@/data/nav.js'

// 应用根组件：固定导航 + 按页面结构顺序组合各区块
export default function App() {
  const ids = navLinks.map((l) => l.id)
  const active = useScrollSpy(['top', ...ids])

  // 键盘导航：方向键跳转章节（含 Hero 顶部）
  useKeyboardNav(['top', ...ids])

  // SectionDots 数据（与导航一致）
  const dotSections = [{ id: 'top', label: '首页' }, ...navLinks.map((l) => ({ id: l.id, label: l.label }))]

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
    </>
  )
}
