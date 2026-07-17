import './Footer.css'
import Arrow from '@/components/Arrow.jsx'

// 页脚：联系 + 简历下载 + 回到顶部
export default function Footer() {
  return (
    <footer className="footer" id="contact"><div className="footer-glow" /><div className="wrap footer-inner"><p className="eyebrow">LET'S CREATE SOMETHING MEANINGFUL</p><h2>下一个故事，<br /><i>从一次对话开始。</i></h2><div className="footer-actions">
      <a className="email" href="mailto:lizongheng2025@163.com">lizongheng2025@163.com <Arrow /></a>
      <a className="footer-dl" href="/assets/李纵横15087322631.pdf" target="_blank">下载简历 PDF <Arrow /></a>
    </div><div className="footer-bottom"><span>© 2026 LIZONGHENG</span><span>长春 / 中国</span><a href="#top">BACK TO TOP ↑</a></div></div></footer>
  )
}
