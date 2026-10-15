import './Strengths.css'
import { strengths, tools } from '@/data'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'

// 能力与优势 —— 合并「核心能力 / 个人优势」为统一文本网格
// 带图的「能力展示」已挪到 Media（作品展示区），见 Media.jsx
export default function Strengths() {
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
      <div className="section-rim" aria-hidden="true" />
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
    </section>
  )
}
