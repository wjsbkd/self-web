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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin, threshold: 0 }
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), rootMargin])

  return active
}
