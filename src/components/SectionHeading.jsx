// 通用区块标题：渲染 section-kicker 序号标签，可选附 heading-row 标题/描述
// 用法一（仅序号标签，如 About）：
//   <SectionHeading num="01" kicker="ABOUT ME" />
//
// 用法二（序号标签 + 标题行，如 Experience/Projects/Media/Strengths）：
//   <SectionHeading num="02" kicker="EXPERIENCE">
//     <h2>在真实的现场，<br /><span>积累解决问题的能力。</span></h2>
//     <p>四段内容与产品运营实习<br />覆盖内容、活动、产品与用户增长。</p>
//   </SectionHeading>
//
// children 里的 <h2>/<p> 由调用方自由组合，保留各区块在换行、强调色片段上的细微差异。
export default function SectionHeading({ num, kicker, children }) {
  return (
    <>
      <div className="section-kicker">
        <span>{num}</span> {kicker}
      </div>
      {children ? <div className="heading-row">{children}</div> : null}
    </>
  )
}
