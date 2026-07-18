import './Nav.css'
import Arrow from '@/components/Arrow.jsx'

// 顶部导航
export default function Nav() {
  return (
    <nav className="nav wrap">
      <a className="brand" href="#top">
        LZH<span>®</span>
      </a>
      <div className="nav-links">
        <a href="#work">项目</a>
        <a href="#experience">经历</a>
        <a href="#media">作品</a>
        <a href="#about">关于</a>
      </div>
      <span className="nav-status">AVAILABLE FOR 2026</span>
      <a className="nav-contact" href="#contact">
        联系我 <Arrow />
      </a>
    </nav>
  )
}
