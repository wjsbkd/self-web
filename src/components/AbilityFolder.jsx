import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './AbilityFolder.css'
import Folder from '@/components/Folder.jsx'
import WorkModal from '@/components/WorkModal.jsx'
import { abilityMaterials } from '@/data/abilityMaterials.js'

/* 能力展示：两段式交互。
   0 收起 —— 文件夹在版块左侧，右边跟四行真标题（沿用 h3 的字号，不用缩略图，
              缩略图在 500px 宽的卡里和真卡是同一种信息，只会变成"两层卡片"）；
   1 聚焦 —— 点一下，文件夹 FLIP 飞到视口正中，背后压一层 --scrim + blur(12px)；
   2 展开 —— 再点一下，掀盖，四张真卡从它身上长出来（WAAPI，从文件夹中心出发）。

   为什么用 WAAPI 而不是 CSS transition：卡片要"从文件夹中心长出来"，
   起点依赖运行时的真实几何（getBoundingClientRect），CSS 写不出动态起点。
   收回同理，终点也是量出来的，所以两向都是 animate()。

   2026-10-14 由原型 %TEMP%\folder-A-20261014 搬入项目。原型里量过的数见 HANDOVER 第五十次。 */

const FOLDER_SCALE = 1.4
const FOLDER_COLOR = '#bb4d05' // = --rim-brick，站内主暖色
const FOLDER_PAPER = '#fffdfa' // = .media 档的 --card-void
const FLY_MS = 550
const CARD_MS = 560
const CARD_LEAD = 300 // 盖先掀起来，再放卡（和文件夹淡出的 300ms 对齐）
const CARD_STAGGER = 70
const CARD_BACK = 420

/* 纸片淡出时长写死在 AbilityFolder.css 的 .folder-item 上（180ms），
   这里不再导出一份常量 —— 两边各写一个数，迟早会对不上。 */

export default function AbilityFolder() {
  const [stage, setStage] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [spread, setSpread] = useState(false)
  const [active, setActive] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const flyRef = useRef(null)
  /* home 用 state 而不是 ref：它是 render 要读的（flyStyle 靠它定位），
     ref 在 render 期间读 .current 会被 react-hooks/refs 拦下，
     而且那是真正的反模式（render 读到的是上一帧的值）。
     注意 focus() 里要「先量一次、立刻用」，所以那里 setState 之后
     紧接着的 rAF 里读的就是新值，不会出现量到旧几何的问题。 */
  const [home, setHome] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const cardRefs = useRef([])
  const reduceRef = useRef(false)
  const timers = useRef([])

  const after = (ms, fn) => timers.current.push(window.setTimeout(fn, ms))
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    reduceRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  /* ---------- 阶段机 ---------- */

  const focus = useCallback(() => {
    const el = flyRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setHome({ left: r.left, top: r.top, width: r.width, height: r.height })
    setPinned(true)
    setStage(1)
    requestAnimationFrame(() =>
      setOffset({
        x: Math.round((window.innerWidth - r.width) / 2 - r.left),
        y: Math.round((window.innerHeight - r.height) / 2 - r.top),
      }),
    )
  }, [])

  const expand = useCallback(() => {
    setStage(2)
    setSpread(true)
  }, [])

  const tap = useCallback(() => {
    if (stage === 0) focus()
    else if (stage === 1) expand()
  }, [stage, focus, expand])

  const flyHome = useCallback(() => {
    setOffset({ x: 0, y: 0 })
    after(reduceRef.current ? 0 : FLY_MS + 60, () => {
      setPinned(false)
      setStage(0)
      setSpread(false)
    })
  }, [])

  /* 四张卡往文件夹中心收：终点是量出来的，所以每张各算各的 dx/dy */
  const cardsBack = useCallback(() => {
    const el = flyRef.current
    if (!el) {
      setSpread(false)
      return
    }
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    cardRefs.current.forEach((node, i) => {
      if (!node) return
      const b = node.getBoundingClientRect()
      const dx = cx - (b.left + b.width / 2)
      const dy = cy - (b.top + b.height / 2)
      node.animate(
        [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(0.26)`, opacity: 0 }],
        {
          duration: reduceRef.current ? 1 : CARD_BACK - 60,
          delay: reduceRef.current ? 0 : i * 40,
          easing: 'cubic-bezier(0.4, 0, 0.7, 0.2)',
          fill: 'forwards',
        },
      )
    })
  }, [])

  const collapse = useCallback(() => {
    setActive(null)
    clearTimers()
    if (stage === 2) {
      setStage(1)
      cardsBack()
      after(reduceRef.current ? 0 : CARD_BACK + 120, flyHome)
    } else if (stage === 1) {
      flyHome()
    }
  }, [stage, cardsBack, flyHome])

  /* 卡从文件夹中心长出来 */
  useLayoutEffect(() => {
    if (!spread || stage !== 2) return undefined
    const el = flyRef.current
    if (!el) return undefined
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    cardRefs.current.forEach((node, i) => {
      if (!node) return
      const b = node.getBoundingClientRect()
      const dx = cx - (b.left + b.width / 2)
      const dy = cy - (b.top + b.height / 2)
      node.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(0.26) rotate(${i % 2 ? 3.5 : -3.5}deg)`, opacity: 0.15 },
          { transform: 'none', opacity: 1 },
        ],
        {
          duration: reduceRef.current ? 1 : CARD_MS,
          delay: reduceRef.current ? 0 : CARD_LEAD + i * CARD_STAGGER,
          easing: 'cubic-bezier(0.18, 0.86, 0.28, 1.04)',
          fill: 'backwards',
        },
      )
    })
    return undefined
  }, [spread, stage])

  /* Esc / 点外面。注意判据里要排除弹窗：卡片详情开着时 Esc 该先关弹窗，
     这一步只负责收起文件夹，两者叠在一起会把用户刚点开的内容一起抽走。 */
  useEffect(() => {
    if (!pinned) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && !active) collapse()
    }
    const onDown = (e) => {
      if (active) return
      if (e.target.closest('.ability-fly, .ability-spread, .work-modal')) return
      collapse()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [pinned, collapse, active])

  /* 聚焦时把文件夹放大：1.4 档本体只有 314×274，在 1470×900 中间会小到读不出
     「四张卡是从它身上出来的」。放大走 transform scale（原点默认在中心，所以
     不用重算位移），组件自己那层 size 不动，纸片是原图，放大 1.9 倍仍在源分辨率以下。 */
  const sc = stage === 0 ? 1 : stage === 1 ? 1.9 : 1.75

  /* pinned 时文件夹改成 fixed：left/top 用原位量到的几何，位移用 --tx/--ty。
     z-index 75 高于 scrim(70)、低于展开层(80)（阶梯与它的来历写在 AbilityFolder.css:3）：
     聚焦时它盖在糊掉的页面上，展开时四张卡又盖住它。 */
  const flyStyle = pinned
    ? {
        position: 'fixed',
        left: home.left,
        top: home.top,
        width: home.width,
        zIndex: 75,
        '--tx': `${offset.x}px`,
        '--ty': `${offset.y}px`,
        '--sc': String(sc),
      }
    : { '--tx': '0px', '--ty': '0px', '--sc': '1' }

  /* 展开态把文件夹内部整棵子树从无障碍树和 Tab 顺序里摘掉。组件自己在 open 时
     给纸片 role="button" tabIndex={0}，所以展开那一刻会有 4 个纸片 + 4 张真卡
     同时在 Tab 序列里，读屏也会把标题念两遍。 */
  const sunk = stage === 2

  return (
    <>
      <div className="ability-row">
        {/* 收起态：文件夹就躺在这里，四行标题在它右边。
            pinned 时它加 .ability-fly--seated 退成一个只负责量几何的占位节点，
            看得见的那一个由下面的 portal 顶到 body 下去盖 scrim。
            为什么不直接给这一个设高 z-index：.tool-gallery 被
            global.css:762 的 .section-rim ~ * 设成 relative + z-index:1，
            它自己是一个 stacking context，后代的 75 被关在里面，
            比不过 portal 出去的 scrim(70) —— 文件夹就会落在糊面底下被
            backdrop-filter 一起糊掉（他 10-14 23:58 反馈的"文件夹也模糊"）。 */}
        <div
          className={`ability-fly${pinned ? ' ability-fly--seated' : ''}`}
          ref={flyRef}
          /* pinned 期间用 home 把盒子撑住：FLIP 要一个稳定的起点/终点尺寸，
             而 focus() 量到的是收起态那一次的几何；同时不再渲染 Folder ——
             否则同一时刻挂了两份组件（各带一张 WebGL 玻璃画布），
             白占一份合成器内存，还会让 seated 那个继续跑 rAF。 */
          style={pinned ? { width: home.width, height: home.height } : undefined}
          role="button"
          tabIndex={0}
          aria-label="打开能力档案"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              tap()
            }
          }}
        >
          {!pinned && (
            <Folder
              label="能力展示"
              mode="flap"
              variant="matte"
              layout="spread"
              color={FOLDER_COLOR}
              paperColor={FOLDER_PAPER}
              theme="light"
              size={FOLDER_SCALE}
              open={stage === 2}
              openOn="click"
              onOpenChange={(o) => {
                if (o) tap()
                else if (stage === 2) collapse()
              }}
              closeOnOutsideClick={false}
              draggable={false}
              zoomOnClick={false}
              peek
              intro
              tilt={0.35}
              bounce={0.32}
              onItemClick={(item, index) => setActive(abilityMaterials[index] ?? null)}
            >
              {abilityMaterials.map((mat) => (
                <div key={mat.id} className="ability-page">
                  <img src={mat.image} alt="" style={{ objectFit: mat.imageFit === 'contain' ? 'contain' : 'cover' }} />
                  <span>{mat.title}</span>
                </div>
              ))}
            </Folder>
          )}
        </div>

        <ul className="ability-index">
          {abilityMaterials.map((mat) => (
            <li key={mat.id}>{mat.title}</li>
          ))}
          <li className="ability-index-hint">点文件夹：先飞到中间，再点一下展开四张卡</li>
        </ul>
      </div>

      {/* scrim、聚焦态文件夹、展开层，三者都挂到 document.body。
          为什么必须都搬：.tool-gallery 被 .section-rim ~ * 设成
          position:relative + z-index:1（global.css:762），它自己是一个
          stacking context —— 留在这里的 fixed 后代，z-index 再高也被关在里面：
            · 展开层(80) 比不过后继兄弟 .video-gallery(1) → 卡片被视频轨道盖住；
            · 文件夹(75) 比不过 portal 出去的 scrim(70) → 文件夹落在糊面底下，
              被 backdrop-filter 一起糊掉（他 10-14 23:58 反馈的现象）。
          portal 到 body 之后它们回到根 stacking context，75/80 才真正大过 70/1。
          ⚠️ 用 portal 而不是把 .tool-gallery 的 z-index 调高：那个数是全站板块
          共用的，动它会连带改掉别的板块与缘光的相对关系（global.css:664 的注释
          专门写了这件事）。
          聚焦态的文件夹不是"第二个"：收起态那一个加了 .ability-fly--seated
          退成只量几何的占位节点，portal 出来的这个才是看得见的那一个。 */}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className={`ability-scrim${pinned ? ' ability-scrim--on' : ''}`} aria-hidden="true" />

            {pinned && (
              <div
                className={`ability-fly${sunk ? ' ability-fly--sunk' : ''}`}
                style={flyStyle}
                role="button"
                tabIndex={0}
                aria-expanded={stage === 2}
                aria-hidden={sunk ? true : undefined}
                aria-label={`打开能力档案（当前阶段 ${stage}）`}
                onClick={tap}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    tap()
                  }
                }}
              >
                <Folder
                  label="能力展示"
                  mode="flap"
                  variant="matte"
                  layout="spread"
                  color={FOLDER_COLOR}
                  paperColor={FOLDER_PAPER}
                  theme="light"
                  size={FOLDER_SCALE}
                  open={stage === 2}
                  openOn="click"
                  onOpenChange={(o) => {
                    if (o) tap()
                    else if (stage === 2) collapse()
                  }}
                  closeOnOutsideClick={false}
                  draggable={false}
                  zoomOnClick={false}
                  peek
                  intro
                  tilt={0.35}
                  bounce={0.32}
                  onItemClick={(item, index) => setActive(abilityMaterials[index] ?? null)}
                >
                  {abilityMaterials.map((mat) => (
                    <div key={mat.id} className="ability-page">
                      <img src={mat.image} alt="" style={{ objectFit: mat.imageFit === 'contain' ? 'contain' : 'cover' }} />
                      <span>{mat.title}</span>
                    </div>
                  ))}
                </Folder>
              </div>
            )}

            {spread && (
              <div className="ability-spread">
                {abilityMaterials.map((mat, i) => (
                  <figure
                    key={mat.id}
                    className="ability-card"
                    ref={(n) => (cardRefs.current[i] = n)}
                    role="button"
                    tabIndex={0}
                    aria-label={`查看 ${mat.title}`}
                    onClick={() => setActive(mat)}
                    onKeyDown={(e) => e.key === 'Enter' && setActive(mat)}
                  >
                    <img src={mat.image} alt="" style={{ objectFit: mat.imageFit === 'contain' ? 'contain' : 'cover' }} />
                    <figcaption>{mat.title}</figcaption>
                  </figure>
                ))}
              </div>
            )}

            {/* 历史（第五十二/五十三次实测，已于 2026-10-15 由 WorkModal 自 portal 收口）：
                详情弹窗原来留在 .tool-gallery 里面，而 global.css:741 的 `.section-rim ~ *`
                把 .tool-gallery 设成 relative + z-index:1 —— 那是一个 stacking context，
                弹窗的 z-index:200 只在这一层里说话，出不了那个 1。展开层(80)和文件夹(75)
                已经 portal 到 body，于是 55/45 > 1：弹窗挂上了、也铺满视口，却被糊面和四张卡
                压在底下。当时在 1470×900 点第一张卡量到：.work-modal 存在、1470×900 @0,0，
                但面板中心 (735,450) 的 elementFromPoint 拿到的是 .folder-back-fill ——
                他看到的「点卡片没反应」其实是先关掉一个看不见的弹窗、再点两下才轮到收起。
                现在 WorkModal.jsx 内部自己 portal 到 body，这一处变成嵌套 portal，DOM 父节点
                仍是 body（改前实测 parent=body、层叠祖先为空，所以这一处从头到尾没变过）。
                ⚠️ 上面那层 createPortal 不能跟着删：scrim/展开层/飞行文件夹三件仍必须在 body 层。 */}
            <WorkModal
              isOpen={Boolean(active)}
              onClose={() => setActive(null)}
              type="image"
              item={active ?? undefined}
            />
          </>,
          document.body,
        )}
    </>
  )
}
