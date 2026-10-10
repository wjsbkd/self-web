import { useState } from 'react'
import './Strengths.css'
import { strengths, tools } from '@/data'
import { abilityMaterials } from '@/data/abilityMaterials.js'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'
import WorkModal from '@/components/WorkModal.jsx'

// 能力与优势 —— 合并「核心能力 / 能力展示 / 个人优势」为统一板块
// 文本类能力（核心能力 + 个人优势）进统一网格，带图能力展示单独成行并支持点击展开
export default function Strengths() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState(null)

  const openMaterial = (mat) => {
    setActiveMaterial(mat)
    setModalOpen(true)
  }

  // 核心能力（带编号）+ 个人优势（软技能）合并为同一文本网格
  const capabilities = [
    ...strengths.map(([number, title, text]) => ({
      index: number,
      name: title,
      desc: text,
    })),
    ...tools.map((t) => ({
      name: t.name,
      desc: t.desc,
    })),
  ]

  return (
    <section className="strength section wrap" id="strengths">
      <div className="section-glow section-glow--strengths" aria-hidden="true" />
      <SectionHeading num="02" kicker="WHAT I BRING">
        <h2>
          不止完成，
          <br />
          <span>更在意如何抵达。</span>
        </h2>
        <p>
          把不同媒介、不同场景中的经验
          <br />
          收束为面向问题的行动力。
        </p>
      </SectionHeading>

      {/* 核心能力 + 个人优势：编辑式统一网格 */}
      <Reveal className="capability-grid" stagger={0.08} once>
        {capabilities.map((cap) => (
          <article className="capability-item" key={cap.name}>
            {cap.index && <span className="capability-index">{cap.index}</span>}
            <Arrow />
            <h3 className="capability-name">{cap.name}</h3>
            <p className="capability-desc">{cap.desc}</p>
          </article>
        ))}
      </Reveal>

      {/* 能力展示：带图，点击展开详情弹窗 */}
      <Reveal className="tool-gallery" stagger={0.08} once>
        <h3 className="tool-gallery-heading">能力展示</h3>
        <div className="tool-gallery-grid">
          {abilityMaterials.map((mat) => (
            <figure
              key={mat.id}
              className="tool-gallery-item"
              onClick={() => openMaterial(mat)}
              role="button"
              tabIndex={0}
              aria-label={`查看 ${mat.title}`}
              onKeyDown={(e) => e.key === 'Enter' && openMaterial(mat)}
            >
              <img src={mat.image} alt={mat.title} loading="lazy" />
              <figcaption>{mat.title}</figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <WorkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="image"
        item={activeMaterial}
      />
    </section>
  )
}
