import './SectionDots.css'

/**
 * SectionDots —— 侧边章节指示器（Apple 产品页风格）
 * 固定在右侧的垂直圆点列表，显示当前所在章节。
 * 点击圆点平滑滚动到对应章节；当前章节圆点放大填充。
 *
 * @param {Array} sections  [{ id, label }] 章节列表
 * @param {string} active   当前活动章节 id
 */
export default function SectionDots({ sections, active }) {
  return (
    <aside className="section-dots" aria-label="章节导航">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`section-dot${active === s.id ? ' active' : ''}`}
          aria-label={`跳转到${s.label}`}
          aria-current={active === s.id ? 'true' : undefined}
        >
          <span className="section-dot-mark" />
          <span className="section-dot-label">{s.label}</span>
        </a>
      ))}
    </aside>
  )
}
