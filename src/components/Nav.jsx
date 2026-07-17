import Arrow from '@/components/Arrow.jsx'

// 顶部导航：含项目内导航 + 简历下载 + 联系方式
export default function Nav() {
  return (
    <nav className="nav wrap">
      <a className="brand" href="#top">LZH<span>®</span></a>
      <div className="nav-links">
        <a href="#about">关于</a><a href="#experience">经历</a><a href="#work">项目</a><a href="#media">作品</a>
      </div>
      <a className="nav-dl" href="/assets/李纵横15087322631.pdf" target="_blank">下载简历 <Arrow /></a>
      <a className="nav-contact" href="#contact">联系我 <Arrow /></a>
    </nav>
  )
}
