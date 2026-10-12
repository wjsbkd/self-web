import { useState, useEffect } from 'react'

// 滚动高亮：观察一组区块，返回当前视口中部所在的区块 id
// ids: 形如 ['work', 'experience', 'media', 'about']
export default function useScrollSpy(ids, { rootMargin = '-45% 0px -45% 0px' } = {}) {
  const [active, setActive] = useState(ids[0] || '')

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length) return

    // 观察窗口是视口中间 10% 的一条带。相邻两个 section 可以同时压在带上
    // （上一节还没走完、下一节已经进来），所以必须自己维护「当前有哪些节在带上」，
    // 按文档顺序取第一个 —— 只认 isIntersecting 为真的 entry 会漏掉「离开」事件，
    // 于是被挤走的那一节会永远粘在高亮位（实测：首屏 关于 一直亮着）。
    const visible = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        const next = ids.find((id) => visible.has(id))
        if (next) setActive(next)
      },
      { rootMargin, threshold: 0 }
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), rootMargin])

  return active
}
