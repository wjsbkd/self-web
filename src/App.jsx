import Hero from '@/components/Hero.jsx'
import About from '@/components/About.jsx'
import Experience from '@/components/Experience.jsx'
import Campus from '@/components/Campus.jsx'
import Projects from '@/components/Projects.jsx'
import Media from '@/components/Media.jsx'
import Strengths from '@/components/Strengths.jsx'
import Footer from '@/components/Footer.jsx'

// 应用根组件：按区块顺序组合页面
export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Campus />
      <Projects />
      <Media />
      <Strengths />
      <Footer />
    </main>
  )
}
