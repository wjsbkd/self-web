import { useState } from 'react'
import './Media.css'
import { getVideos } from '@/data/sanityData'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'
import WorkModal from '@/components/WorkModal.jsx'
import VideoRail from '@/components/VideoRail.jsx'
import AbilityFolder from '@/components/AbilityFolder.jsx'

export default function Media() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)
  const videos = getVideos()

  const openVideo = (video) => {
    setActiveVideo(video)
    setModalOpen(true)
  }

  return (
    <section className="media section wrap" id="media">
      <div className="section-rim" aria-hidden="true" />
      <SectionHeading num="05" kicker="MEDIA ARCHIVE">
        <h2>
          留给作品，
          <br />
          <span>更大的展示空间。</span>
        </h2>
        <p>
          能力档案与视频案例的陈列
          <br />
          点开卡片看详情，完整作品可通过弹窗中的网盘链接查看。
        </p>
      </SectionHeading>

      {/* 能力展示：两段式交互 —— 点文件夹飞到中心，再点一下四张卡从它身上展开。
          2026-10-14 由原型 %TEMP%\folder-A-20261014 搬入，实测见 HANDOVER 第五十次。
          全息膜已按决定移除（HoloCard 链 2026-10-15 删除），卡片数值沿用
          Media.css 那一档的圆角/阴影/压暗滤镜。
          ⚠️ 这里不能用 <Reveal> 包：reveal-up 动画的是独立的 translate 属性
          （global.css:992），而 translate 会创建包含块 —— 包在里面的
          .ability-fly 一旦 position:fixed 就被困在 .reveal 里，
          rect 报在 (497,501) 而 elementFromPoint 命中视频轨道，
          第二次点击全部落空（probe-diag6 用"搬到 body 下"做对照证实了这条）。
          想要入场动画就写在 AbilityFolder 自己身上，别用外层 Reveal。 */}
      <div className="tool-gallery">
        <h3 className="tool-gallery-heading">能力展示</h3>
        <AbilityFolder />
      </div>

      {/* 视频案例轨道（2026-10-13 补二级标题：上面能力展示有 h3，这块一直是裸的）
          这里不用 Reveal 包 —— 轨道自己有逐卡交错进场，再套一层就是两套动画打架。 */}
      <div className="video-gallery">
        <h3 className="video-gallery-heading">视频案例</h3>
        <VideoRail items={videos} onSelect={openVideo} />
      </div>

      <WorkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="video"
        item={activeVideo}
      />

      {/* 滚动驱动短片：纯 HTML/CSS/JS 独立页，不经 React，见 public/scrolly/ */}
      <Reveal className="portfolio-bar" once>
        <div>
          <span>SCROLLYTELLING / 01</span>
          <b>滚动看完这条片子</b>
        </div>
        {/* 用 /scrolly/ 不带 index.html：GitHub Pages 与 Cloudflare Pages 都能直接服，
            而 Cloudflare 会把 /scrolly/index.html 308 到 /scrolly/（多一跳）。 */}
        <a href="/scrolly/">向下滚就是进度条 <Arrow /></a>
      </Reveal>

      {/* 完整作品集 PDF 入口 */}
      <Reveal className="portfolio-bar" once>
        <div>
          <span>PORTFOLIO / FULL</span>
          <b>完整作品集 PDF</b>
        </div>
        <a href="/assets/作品集.pdf" target="_blank" rel="noreferrer">
          在线查看 <Arrow />
        </a>
      </Reveal>

    </section>
  )
}
