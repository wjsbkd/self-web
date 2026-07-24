import Nav from '@/components/Nav.jsx'
import Hero from '@/components/Hero.jsx'
import About from '@/components/About.jsx'
import Experience from '@/components/Experience.jsx'
import Projects from '@/components/Projects.jsx'
import Media from '@/components/Media.jsx'
import Strengths from '@/components/Strengths.jsx'
import Footer from '@/components/Footer.jsx'
import useScrollSpy from '@/hooks/useScrollSpy.js'
import { navLinks } from '@/data/nav.js'

// 应用根组件：固定导航 + 按页面结构顺序组合各区块
export default function App() {
  const active = useScrollSpy(navLinks.map((l) => l.id))

  return (
    <>
      <Nav active={active} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Media />
        <Strengths />
        <Footer />
      </main>
    </>
  )
}
