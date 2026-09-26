import { useState } from 'react'
import './Media.css'
import { videos } from '@/data/videos.js'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'
import WorkModal from '@/components/WorkModal.jsx'
import VideoRail from '@/components/VideoRail.jsx'

export default function Media() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)

  const openVideo = (video) => {
    setActiveVideo(video)
    setModalOpen(true)
  }

  return (
    <section className="media section wrap" id="media">
      <SectionHeading num="05" kicker="MEDIA ARCHIVE">
        <h2>
          留给作品，
          <br />
          <span>更大的展示空间。</span>
        </h2>
        <p>
          视频案例的 Apple 风格陈列
          <br />
          点击卡片预览，完整作品可通过弹窗中的网盘链接查看。
        </p>
      </SectionHeading>

      {/* Apple 风格横向滚动视频轨道，可承载 10+ 个视频 */}
      <VideoRail items={videos} onSelect={openVideo} />

      <WorkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="video"
        item={activeVideo}
      />

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
