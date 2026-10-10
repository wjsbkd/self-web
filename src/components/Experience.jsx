import './Experience.css'
import { experiences } from '@/data'
import SectionHeading from '@/components/SectionHeading.jsx'
import Reveal from '@/components/Reveal.jsx'

// 工作经历 —— timeline 风格：左 period 固定列 + 右 body 限宽列
// body 内 company/role/tags/text 垂直堆叠，避免原三列 grid 在文字短时空旷
export default function Experience() {
  return (
    <section className="experience section wrap" id="experience">
      <div className="section-glow section-glow--experience" aria-hidden="true" />
      <SectionHeading num="03" kicker="EXPERIENCE">
        <h2>
          在真实的现场，
          <br />
          <span>积累解决问题的能力。</span>
        </h2>
        <p>
          四段内容与产品运营实习
          <br />
          覆盖内容、活动、产品与用户增长。
        </p>
      </SectionHeading>
      <Reveal className="experience-list" stagger={0.08} once>
        {experiences.map((item) => (
          <article className="experience-item" key={`${item.company}-${item.period}`}>
            <div className="experience-period">{item.period}</div>
            <div className="experience-body">
              <header className="experience-head">
                <p className="experience-company">{item.company}</p>
                <h3 className="experience-role">{item.role}</h3>
              </header>
              <div className="tag-list">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p className="experience-text">{item.text}</p>
            </div>
          </article>
        ))}

        {/* 校园经历：从 About 移入，与实习经历统一为 timeline 条目 */}
        <article className="experience-item campus-item">
          <div className="experience-period">校园经历</div>
          <div className="experience-body">
            <header className="experience-head">
              <p className="experience-company">吉林建筑大学 · 记者团宣传部</p>
              <h3 className="experience-role">校园宣传与跨部门协同</h3>
            </header>
            <div className="campus-highlight">
              <b>
                20,000<span>+</span>
              </b>
              <span>校运会宣传线上、线下观看</span>
            </div>
            <div className="tag-list">
              <span>公众号运营</span>
              <span>校刊制作</span>
              <span>活动宣传</span>
              <span>跨部门沟通</span>
            </div>
            <p className="experience-text">
              参与校运会宣传，通过公众号推送与校内传播扩大活动触达；开学期间参与校刊制作，
              以板报和推文配合发行，完成从内容制作到线下落地的闭环。
            </p>
          </div>
        </article>
      </Reveal>
    </section>
  )
}
