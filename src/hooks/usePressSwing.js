import { useEffect } from 'react'

/**
 * usePressSwing —— 按下按钮时图标做一次阻尼摆动
 * 动效语言移植自 React Bits 的 BellToggle（摇铃）：源件用 ringKeyframes 生成一串
 * 半摆，角度按 (1 - k/passes)^decay 衰减、时间按 WARP=0.6 的幂分布前密后疏，
 * 每段单独吃 cubic-bezier(0.77,0,0.175,1) —— 这套"摆幅递减 + 段落急起急收"
 * 才是钟摆读起来像真的的原因，随便写个 rotate 关键帧出不来。
 * 这里原样保留算法，只换三处接线（下面各自注明）。
 *
 * 全站只在 App 挂一次，靠 document 级 pointerdown 委托，不给每个按钮加 ref。
 */

// ── 源件常量，未改动 ──
const SEG_EASE = 'cubic-bezier(0.77, 0, 0.175, 1)'
const WARP = 0.6
const DECAY = 1 // 源件 ringDecay 默认值：等比衰减

// ── 换档：源件全摆是 ringAmplitude 17° / ringPasses 5 / ringDuration 820ms，
//    那是"一枚钟被敲响"的量级；我们的图标只有一枚 ↗ 和两枚雪佛龙，照搬会把
//    导航晃散。改用源件自己为"来了一条新通知"准备的轻摇档 WOBBLE：
//    amplitude 0.4×、passes 3、duration 420ms —— 三个数都取自源件，不是新调的。
const AMPLITUDE = 17 * 0.4
const PASSES = 3
const DURATION = 420

// 参与摆动的按钮：药丸与命令件（大卡片不在此列，见 global.css 按压层的同一取舍）。
// .brand 也不在此列 —— 它里面确实有一枚 svg（LZH 字标），但那是 120×48 的字标锁版，
// 整枚摇起来是 logo 抖动、不是图标反馈；它只吃按压 scale。别把它当漏网之鱼补进来。
const HOSTS =
  '.pill, .nav-items a, .nav-contact, .footer-cta, .social-btn, .portfolio-bar > a, ' +
  '.work-modal-link, .video-rail-btn, .video-rail-play-toggle, .identity-name'
const GLYPH = '.arrow, svg'

const passOffset = (k, passes) => 1 - Math.pow(1 - (k + 2 / 3) / (passes + 1), WARP)

/**
 * 关键帧表。与源件唯一的不同：写独立属性 rotate 而不是 transform: rotate()。
 * 因为 .arrow 的 hover 位移就是 transform: translate(3px,-3px)，两者共用一个
 * transform 会在摆动那 420ms 里把位移顶掉（箭头先跳回原位再摆回来）。
 * 独立 rotate 与 transform 相乘，位移与摆动同时成立 —— 与按压层同一套做法。
 */
function swingFrames(from, amplitude, passes, decay) {
  const frames = [{ rotate: `${from.toFixed(2)}deg`, offset: 0, easing: SEG_EASE }]
  for (let k = 0; k < passes; k++) {
    const angle = amplitude * Math.pow(1 - k / passes, decay) * (k % 2 ? 1 : -1)
    frames.push({ rotate: `${angle.toFixed(2)}deg`, offset: passOffset(k, passes), easing: SEG_EASE })
  }
  frames.push({ rotate: '0deg', offset: 1 })
  return frames
}

// 半摆中途再次按下时，从当前角度接着摆而不是跳回 0 重摆（源件 liveAngle 同义）。
// 独立 rotate 的计算值形如 "6.8deg" 或 "none"，比源件拆 DOMMatrix 简单。
function liveAngle(el) {
  const v = getComputedStyle(el).rotate
  if (!v || v === 'none') return 0
  return Number.parseFloat(v) || 0
}

export default function usePressSwing() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    // 只取消自己起的那次摆动：源件写的是 el.getAnimations().forEach(a => a.cancel())，
    // 但它的图标身上没有 CSS 过渡，我们的 .arrow 有（transform 0.3s）。
    // getAnimations() 会把 CSSTransition 一起返回，一并 cancel 等于把 hover 位移
    // 的过渡掐死在半路，箭头会瞬跳。
    const running = new WeakMap()

    const onDown = (e) => {
      if (reduce.matches) return
      // 源件同样只给指针输入摆动：键盘激活走的是 crossfadeMs 那一档淡入，不摇。
      if (e.pointerType === 'mouse' && e.button !== 0) return
      const host = e.target instanceof Element ? e.target.closest(HOSTS) : null
      if (!host || host.disabled) return
      const glyph = host.querySelector(GLYPH)
      if (!glyph) return
      running.get(glyph)?.cancel()
      const anim = glyph.animate(swingFrames(liveAngle(glyph), AMPLITUDE, PASSES, DECAY), {
        duration: DURATION,
        easing: 'linear', // 分段缓动已在每帧的 easing 里，整体必须是 linear
      })
      running.set(glyph, anim)
      anim.finished.catch(() => {}) // 被 cancel 时 finished 会 reject，不吞掉会报未处理拒绝
    }

    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])
}
