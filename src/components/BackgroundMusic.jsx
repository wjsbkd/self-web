import { useEffect, useRef, useState } from 'react'
import './BackgroundMusic.css'
import { useSiteSettings } from '@/data/hooks'

/**
 * BackgroundMusic —— 可选背景音乐（需求第五节）
 *
 * ⚠️ 自动播放红线（需求第九节）：
 * - 默认不自动播放（浏览器禁止未授权有声播放）。
 * - 用户右下角点开按钮才播放，选择存 localStorage（key: lzh-bgm-pref）。
 * - 下次访问自动读取偏好：若用户上次开过，则**在首次用户交互后**才播放
 *   （仍受浏览器限制，不能一进站就响）。
 * - play() 被拒绝（NotAllowedError）时静默保持关闭，不弹错误。
 */
const PREF_KEY = 'lzh-bgm-pref'

export default function BackgroundMusic() {
  const { data: site } = useSiteSettings()
  const bgm = site?.seo.backgroundMusic
  const audioRef = useRef(null)
  const [on, setOn] = useState(false)

  // 站点配置了背景音乐 + 用户曾开启 → 首次用户交互后尝试播放
  useEffect(() => {
    if (!bgm?.enabled || !bgm.url) return
    const pref = localStorage.getItem(PREF_KEY)
    if (pref !== 'on') return

    const tryStart = () => {
      const audio = audioRef.current
      if (!audio) return
      audio
        .play()
        .then(() => setOn(true))
        .catch(() => {
          // 浏览器拒绝自动播放：保持关闭，不报错
          setOn(false)
        })
      window.removeEventListener('pointerdown', tryStart)
      window.removeEventListener('keydown', tryStart)
    }
    window.addEventListener('pointerdown', tryStart, { once: true })
    window.addEventListener('keydown', tryStart, { once: true })
    return () => {
      window.removeEventListener('pointerdown', tryStart)
      window.removeEventListener('keydown', tryStart)
    }
  }, [bgm?.enabled, bgm?.url])

  // 同步 audio 属性
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !bgm?.url) return
    audio.loop = Boolean(bgm.loop)
    audio.volume = typeof bgm.volume === 'number' ? bgm.volume : 0.35
  }, [bgm?.url, bgm?.loop, bgm?.volume])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (on) {
      audio.pause()
      setOn(false)
      localStorage.setItem(PREF_KEY, 'off')
    } else {
      audio
        .play()
        .then(() => {
          setOn(true)
          localStorage.setItem(PREF_KEY, 'on')
        })
        .catch(() => {
          // 拒绝：不做任何视觉报错
        })
    }
  }

  if (!bgm?.enabled || !bgm.url) return null

  return (
    <>
      <audio ref={audioRef} src={bgm.url} preload="none" />
      <button
        className={`bgm-toggle${on ? ' is-on' : ''}`}
        onClick={toggle}
        aria-label={on ? '关闭背景音乐' : '播放背景音乐'}
        title={bgm.name ?? '背景音乐'}
      >
        <span className="bgm-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="bgm-label">{on ? '♪ 开' : '♪ 关'}</span>
      </button>
    </>
  )
}
