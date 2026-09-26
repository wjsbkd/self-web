import { cloneElement, isValidElement, useEffect, useRef, useState, Children } from 'react'

/**
 * Reveal —— 滚动揭示组件（苹果官网标志性效果）
 * 使用 IntersectionObserver 在元素进入视口时触发淡入上浮动画，
 * 支持子元素交错延迟（stagger）。
 *
 * 用法：
 *   <Reveal>...</Reveal>                       单块揭示
 *   <Reveal as="ul" stagger={0.08}>...</Reveal> 列表交错揭示（直接子节点依次延迟）
 *   <Reveal delay={0.2}>...</Reveal>            自定义延迟
 *
 * props:
 *   as        渲染的标签，默认 'div'
 *   delay     整体延迟（秒）
 *   stagger   直接子节点之间的额外延迟（秒）
 *   once      是否只触发一次，默认 true
 *   threshold 触发阈值，默认 0.15
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  stagger = 0,
  once = true,
  threshold = 0.15,
  className = '',
  style = {},
  children,
  ...rest
}) {
  const ref = useRef(null)
  // 尊重「减少动态效果」系统偏好：直接以可见态初始化，避免在 effect 内同步 setState
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [visible, setVisible] = useState(reduceMotion)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 已因 reduce-motion 可见，无需再观察
    if (reduceMotion) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [once, threshold, reduceMotion])

  // 为子节点注入交错延迟（通过 CSS 变量 --reveal-delay）
  // 使用 cloneElement 正确复制 React 元素（避免 $$typeof 丢失导致渲染错误）
  const styledChildren =
    stagger > 0
      ? Children.map(children, (child, i) =>
          isValidElement(child)
            ? cloneElement(child, {
                style: { ...child.props.style, '--reveal-delay': `${i * stagger}s` },
              })
            : child
        )
      : children

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' reveal-in' : ''}${stagger > 0 ? ' reveal-stagger' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}s`, ...style }}
      {...rest}
    >
      {styledChildren}
    </Tag>
  )
}
