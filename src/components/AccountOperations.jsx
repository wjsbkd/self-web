import { useState } from 'react'
import './AccountOperations.css'
import { douyinWorks, accountIdentity } from '@/data/douyinWorks.js'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'
import SpiralGallery from '@/components/SpiralGallery.jsx'
import WorkModal from '@/components/WorkModal.jsx'

/**
 * AccountOperations —— 账号运营板块
 * 展示抖音账号「我将势不可挡」的作品集
 *
 * 设计语言融合：
 * - Claude 官网：衬线 Display 标题、mono 序号标签、暖羊皮纸底、generous whitespace
 * - Apple 产品宣发：3D 螺旋照片墙（SpiralGallery）、scroll-reveal、springy hover
 */
export default function AccountOperations() {
  const [activeMaterial, setActiveMaterial] = useState(null)

  const openMaterial = (work) => {
    // 将抖音作品数据映射为 WorkModal 的统一 item 结构
    setActiveMaterial({
      title: work.title,
      image: work.image,
      description: work.caption,
      tags: work.tags,
    })
  }

  return (
    <section className="account-ops section wrap" id="account">
      <SectionHeading num="06" kicker="DOUYIN / ACCOUNT">
        <h2>
          账号运营，
          <br />
          <span>每一条都是一次对话。</span>
        </h2>
        <p>
          抖音账号「{accountIdentity.name}」作品展示
          <br />
          从历史解读到励志语录，用短视频传递观点与情绪。
        </p>
      </SectionHeading>

      {/* ── 账号身份卡片（Apple 净白卡片风格）── */}
      <Reveal className="identity-card" once>
        <div className="identity-header">
          <span className="identity-platform">{accountIdentity.platform}</span>
          <a
            className="identity-name"
            href={accountIdentity.url}
            target="_blank"
            rel="noreferrer"
          >
            {accountIdentity.name}
            <Arrow />
          </a>
        </div>
        <div className="identity-stats">
          {accountIdentity.stats.map((s) => (
            <div key={s.label} className="id-stat">
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── 3D 螺旋照片墙（核心展示区）── */}
      <SpiralGallery works={douyinWorks} onSelect={openMaterial} />

      {/* ── 作品详情弹窗（复用 WorkModal，统一 Esc / 焦点管理 / 背景滚动锁定）── */}
      <WorkModal
        isOpen={Boolean(activeMaterial)}
        onClose={() => setActiveMaterial(null)}
        type="image"
        item={activeMaterial}
      />
    </section>
  )
}
