import './Strengths.css'
import { strengths } from '@/data'
import Arrow from '@/components/Arrow.jsx'
import SectionHeading from '@/components/SectionHeading.jsx'

// 核心能力
export default function Strengths() {
  return (
    <section className="strength section wrap" id="strength">
      <SectionHeading num="05" kicker="WHAT I BRING">
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
      <div className="strength-grid">
        {strengths.map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <Arrow />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
