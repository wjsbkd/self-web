import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import './WorkModal.css'

/**
 * WorkModal —— 可复用的作品/素材详情弹窗
 * 桌面端：左侧图片/视频 + 右侧文字介绍
 * 移动端：上下堆叠
 * 支持 Esc 键、点击背景、关闭按钮关闭；含焦点陷阱与关闭后焦点还原。
 *
 * props:
 *   isOpen    是否显示
 *   onClose   关闭回调
 *   type      'image' | 'video'
 *   item      数据对象 { title, image, description, tags, link? }
 */
export default function WorkModal({ isOpen, onClose, type = 'image', item }) {
  const panelRef = useRef(null)
  const lastFocusedRef = useRef(null)

  const handleClose = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  // 焦点管理：打开时记录触发元素、聚焦面板；关闭时还原焦点
  // Esc 关闭、Tab/Shift+Tab 在面板内循环（焦点陷阱）
  useEffect(() => {
    if (!isOpen) return

    lastFocusedRef.current = document.activeElement

    // 聚焦面板（优先关闭按钮，便于 Esc 后直接 Tab 浏览）
    const panel = panelRef.current
    const focusTarget =
      panel?.querySelector('button') || panel
    if (focusTarget) focusTarget.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleClose()
        return
      }
      if (e.key !== 'Tab') return
      if (!panel) return
      const focusables = panel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    // 禁止背景滚动
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      // 关闭后还原焦点到触发元素
      if (lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
        lastFocusedRef.current.focus()
      }
    }
  }, [isOpen, handleClose])

  if (!isOpen || !item) return null

  const isVideo = type === 'video'
  const hasVideo = isVideo && item.videoSrc

  // portal 到 body：改前 `.work-modal` 的 z-index:200 能压过 global.css:741-744 `.section-rim ~ *` 的
  // z-index:1，纯靠 WorkModal.css 在打包结果里排在 global.css 之后（同特异度后写赢）—— 谁挪一下 import
  // 顺序，弹窗就掉回 z:1 被 Nav(50) 盖住。挂到 body 后这条因果链不存在。
  // 三处挂载（Media / AccountOperations / AbilityFolder）因此一处收口；CSS 一行不用改。
  return createPortal(
    <div className="work-modal" onClick={handleClose} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="work-modal-backdrop" />
      <div className={'work-modal-panel' + (isVideo ? ' is-video' : '')} ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button className="work-modal-close" onClick={handleClose} aria-label="关闭">
          <span />
          <span />
        </button>

        <div className="work-modal-content">
          <div className="work-modal-media">
            {isVideo ? (
              <div className="work-modal-video">
                {hasVideo ? (
                  <video src={item.videoSrc} controls poster={item.cover} preload="metadata" />
                ) : (
                  <div className="work-modal-video-placeholder">
                    <img src={item.cover} alt={item.title} />
                    <div className="work-modal-video-fallback">
                      <p>视频文件较大，已通过百度网盘提供</p>
                      <a href={item.link} target="_blank" rel="noreferrer" className="work-modal-link">
                        前往网盘观看
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="work-modal-image-wrap" style={{ '--object-fit': item.imageFit || 'contain' }}>
                <img src={item.image} alt={item.title} />
              </div>
            )}
          </div>

          <div className="work-modal-info">
            <span className="work-modal-type">{isVideo ? 'VIDEO' : 'VISUAL'}</span>
            <h3 className="work-modal-title">{item.title}</h3>
            <p className="work-modal-desc">{item.description}</p>

            {item.tags && item.tags.length > 0 && (
              <div className="work-modal-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}

            {item.link && (
              <a href={item.link} target="_blank" rel="noreferrer" className="work-modal-link">
                查看完整作品
              </a>
            )}
            {item.pwd && (
              <p className="work-modal-pwd">
                百度网盘提取码：<b>{item.pwd}</b>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
