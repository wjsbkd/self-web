import { useState, useEffect } from 'react'

export default function useStaggerText(text, delay = 0, staggerMs = 35) {
  const [chars, setChars] = useState([])
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const list = Array.from(text).map((ch, i) => ({
      ch,
      delay: i * staggerMs,
    }))
    setChars(list)
  }, [started, text, staggerMs])

  return chars
}
