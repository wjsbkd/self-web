import { useEffect } from 'react'

/**
 * useKeyboardNav —— 键盘章节导航（Apple 无障碍 + 高级感）
 * ↑/↓ 或 PgUp/PgDn：在章节间逐个跳转
 * Home/End：跳到顶部/底部
 * Esc：触发回调（用于关闭移动端菜单等）
 *
 * @param {string[]} ids  章节元素 id 列表（按文档顺序）
 * @param {function} onEsc  Esc 按键回调
 */
export default function useKeyboardNav(ids, onEsc) {
  useEffect(() => {
    if (!ids || ids.length === 0) return

    const onKeyDown = (e) => {
      // 在输入框/可编辑区域内时不拦截
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return

      // Esc：关闭菜单
      if (e.key === 'Escape') {
        if (onEsc) onEsc()
        return
      }

      // 方向键 / PgUp PgDn / Home End
      const navKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']
      if (!navKeys.includes(e.key)) return

      e.preventDefault()

      if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (e.key === 'End') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
        return
      }

      // 计算当前位于哪个章节
      const scrollY = window.scrollY + window.innerHeight * 0.4
      let currentIdx = 0
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i])
        if (el && el.offsetTop <= scrollY) currentIdx = i
      }

      const isDown = e.key === 'ArrowDown' || e.key === 'PageDown'
      const isUp = e.key === 'ArrowUp' || e.key === 'PageUp'
      let nextIdx = currentIdx
      if (isDown && currentIdx < ids.length - 1) nextIdx = currentIdx + 1
      else if (isUp && currentIdx > 0) nextIdx = currentIdx - 1
      else return // 已到边界

      const target = document.getElementById(ids[nextIdx])
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [ids, onEsc])
}
