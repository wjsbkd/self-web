export default function HeroGlobe({ bodyRef, bulbRef }) {
  // 12 条放射光线（绕灯泡中心、旋转对称），由 rAF 自转驱动
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180
    return {
      x1: 210 + 104 * Math.cos(a),
      y1: 185 + 104 * Math.sin(a),
      x2: 210 + 198 * Math.cos(a),
      y2: 185 + 198 * Math.sin(a),
    }
  })

  return (
    <div className="hero-globe" aria-hidden="true">
      <svg
        className="hero-globe-svg"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 点亮的暖光向四周扩散 */}
          <radialGradient id="bulbAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 206, 120, 0.62)" />
            <stop offset="45%" stopColor="rgba(255, 190, 95, 0.28)" />
            <stop offset="100%" stopColor="rgba(255, 180, 90, 0)" />
          </radialGradient>
          {/* 灯泡玻璃点亮后的暖色填充 */}
          <radialGradient id="bulbGlassOn" cx="42%" cy="34%" r="75%">
            <stop offset="0%" stopColor="rgba(255, 234, 158, 0.55)" />
            <stop offset="60%" stopColor="rgba(255, 205, 110, 0.22)" />
            <stop offset="100%" stopColor="rgba(255, 196, 104, 0.06)" />
          </radialGradient>
        </defs>

        {/* 旋转组：对称的暖光晕 + 放射光线（rAF 自转驱动；灯泡本体保持竖直） */}
        <g className="hero-globe-body" ref={bodyRef}>
          <circle className="bulb-ambient" cx="210" cy="185" r="200" fill="url(#bulbAmbient)" />
          <g className="bulb-rays">
            {rays.map((r, i) => (
              <line
                key={i}
                className="bulb-ray"
                x1={r.x1}
                y1={r.y1}
                x2={r.x2}
                y2={r.y2}
              />
            ))}
          </g>
        </g>

        {/* 灯泡本体（竖直、不自转），同时作为 hover 命中区 */}
        <g className="hero-bulb-shape" ref={bulbRef}>
          {/* 玻璃罩（圆顶 + 收颈） */}
          <path
            className="bulb-glass"
            d="M114 160 C114 98 152 60 210 60 C268 60 306 98 306 160 C306 206 280 242 250 260 L250 264 L170 264 L170 260 C140 242 114 206 114 160 Z"
          />
          {/* 灯丝（两支架 + 顶部线圈） */}
          <path
            className="bulb-filament"
            d="M198 258 L203 200 C196 184 200 165 210 158 C220 165 224 184 217 200 L222 258"
          />
          {/* 螺口底座 */}
          <path
            className="bulb-base"
            d="M174 260 L246 260 L242 314 Q242 322 234 322 L186 322 Q178 322 178 314 Z"
          />
          {/* 螺口纹路 */}
          <line className="bulb-thread" x1="180" y1="278" x2="240" y2="278" />
          <line className="bulb-thread" x1="181" y1="292" x2="239" y2="292" />
          <line className="bulb-thread" x1="183" y1="306" x2="237" y2="306" />
          {/* 触点 */}
          <rect className="bulb-tip" x="195" y="322" width="30" height="16" rx="5" />
        </g>
      </svg>
    </div>
  )
}
