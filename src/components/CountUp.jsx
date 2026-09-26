import { useEffect, useRef, useState, createContext, useContext } from 'react'

const CountUpContext = createContext(false)

/**
 * CountUp 数字滚动组件
 * - parentReady=true 时启动动画，RAF 从 0 滚到 target
 * - parentReady=false 时立即把文本归零
 * - 每次重新进入视口都会重播（不再只触发一次）
 */
function CountUpValue({ target, suffix = '', duration = 1600, delay = 0 }) {
  const ref = useRef(null)
  const parentReady = useContext(CountUpContext)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 退出视口：直接归零，停止动画
    if (!parentReady) {
      el.textContent = '0' + suffix
      return
    }

    // 进入视口：延时后启动滚动
    let raf
    const startTimer = setTimeout(() => {
      const start = performance.now()
      const isFloat = String(target).includes('.')
      const numTo = parseFloat(target)
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = (eased * numTo).toFixed(isFloat ? 1 : 0) + suffix
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(startTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [parentReady, target, suffix, duration, delay])

  return <b ref={ref}>0{suffix}</b>
}

export default function CountUpGroup({ children, className }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 每次进入/退出视口都同步 visible —— 数字可反复重播
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <CountUpContext.Provider value={visible}>
        {children}
      </CountUpContext.Provider>
    </div>
  )
}

CountUpGroup.Item = CountUpValue
