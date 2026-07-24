import { useEffect, useRef, useState, createContext, useContext } from 'react'

const CountUpContext = createContext(false)

function CountUpValue({ target, suffix = '', duration = 1600, delay = 0 }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const parentReady = useContext(CountUpContext)

  useEffect(() => {
    if (!parentReady) return
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [parentReady, delay])

  useEffect(() => {
    if (!started) return
    const el = ref.current
    if (!el) return
    const start = performance.now()
    const isFloat = String(target).includes('.')
    const numTo = parseFloat(target)

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      el.textContent = (eased * numTo).toFixed(isFloat ? 1 : 0) + suffix
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, target, suffix, duration])

  return <b ref={ref}>0{suffix}</b>
}

export default function CountUpGroup({ children, className }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
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
