/* 首屏指针涟漪：把 .film-layer--intro 那一层从 <video> 换成 WebGL 画布（React Bits 的
   RippleDistortion 等价实现，裸 WebGL2，不引 ogl）。两遍渲染：
     1) 每个波纹一个实例四边形 → 画进 displacement FBO（加法混合，取 .r 当扰动量）
     2) 全屏三角形：按 displacement 把源图推开，再叠色散与暖色高光
   GLSL 与参考那份逐行对齐（ES 1.00 写法，WebGL2 直接吃），差别只有三处：
     · coverUV 带 uZoom / uObjectPos，复刻 .film-layer 的 scale() 与 object-position
     · 多一条 uSepia/uHue/uSat/uBright，把 FilmStage.css 那串 CSS filter 搬进着色器
     · 没有波纹且源画面没换时整帧不出图（静置闸门），否则这一层会常驻占 GPU
   ⚠️ 几何与配色一律从 <video> 的 computedStyle 现读，CSS 是唯一真源。读成这里复刻不了的形状
   （带位移的 transform、px 单位的 object-position、filter 里出现这四个以外的函数）就整层不启用，
   退回现在的样子 —— 宁可没有涟漪，也不要一张和周围对不上的画面。
   数值口径见 HANDOVER「第三十次」：色彩在 8 个平面色块上与浏览器逐字节相同、整帧差 0.548/通道；
   原型里每帧上传 0.1ms、绘制 0.2ms（1440×900、medium 位移场、1280×720 视频源）。 */

const MAX_WAVES = 100
const FIELD_SCALE = 0.7 // 位移场相对画布 CSS 尺寸（1440×900 下 1129×630，原型里量过够用）
const START_SCALE = 1.5
const LIFE_CONSTANT = Math.log(500)

/* 原型里量出来的「克制（贴合本站）」那一档：参考默认会把那张脸打碎（13.85% 像素改动 >24），
   这组是 10.57%，且脸上有避让保护区。 */
const PARAMS = {
  brushSize: 120,
  rings: 2.4,
  swirl: 0.35,
  spread: 4,
  strength: 0.055,
  fade: 2.2,
  spacing: 26,
  dispersion: 0.12,
  glint: 0.18,
  tintAmount: 0.05,
  /* ⚠️ 2026-10-15：油彩上色轴（irid）整条撤掉，不要再加回来 —— 四轮实测全证伪，
     完整数据见 COMP_FS 里那块注释。这里只留已经实测有效的两项修复：
     glint 的脸部避让 gate、高光色从纯白改为 --rim-flare 琥珀。 */
}
const TINT = '#ffc489' // = global.css 的 --accent（参考组件默认是紫 #a855f7，和本站暖调不搭）
const HIGHLIGHT = '#ffc489' // = --rim-flare。上一版加的是纯白 vec3；白墨只留给文字（global.css:77-79）
const AVOID_R = 0.22 // 主体避让半径，单位=源图高度 → 1440×900 下约 185px
const AVOID_W = 1

const WAVE_VS = `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
attribute vec2 iOffset;
attribute vec2 iScale;
attribute float iOpacity;
varying vec2 vUv;
varying float vOpacity;
void main() {
  vUv = uv;
  vOpacity = iOpacity;
  gl_Position = vec4(iOffset + position * iScale, 0.0, 1.0);
}
`

const WAVE_FS = `
precision highp float;
varying vec2 vUv;
varying float vOpacity;
uniform float uRings;
const float PI = 3.141592653589793;
const float EDGE = 0.006737947;
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = dot(p, p);
  if (r > 1.0) discard;
  float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);
  brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);
  gl_FragColor = vec4(vec3(brush * vOpacity * vOpacity), 1.0);
}
`

const SCREEN_VS = `
precision highp float;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const COMP_FS = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uTexel;
uniform vec2 uObjectPos;
uniform float uZoom;
uniform vec3 uTint;
uniform vec4 uAvoid;
uniform mat3 uSepia;
uniform mat3 uHue;
uniform mat3 uSat;
uniform float uBright;
uniform float uStrength;
uniform float uSwirl;
uniform float uDispersion;
uniform float uGlint;
uniform float uTintAmount;
uniform vec3 uHighlight;
const float TAU = 6.283185307179586;

vec2 coverUV(vec2 uv) {
  vec2 safe = max(uTextureSize, vec2(1.0));
  vec2 s = uResolution / safe;
  vec2 scaledSize = safe * max(s.x, s.y);
  vec2 free = uResolution - scaledSize;
  // 先按 CSS transform: scale() 绕视口中点缩，再按 object-fit:cover + object-position 映射到源图
  vec2 c = (uv * uResolution - uResolution * 0.5) / uZoom + uResolution * 0.5;
  return (c - free * uObjectPos) / scaledSize;
}

void main() {
  float amount = texture2D(uDisplacement, vUv).r;
  vec2 base = coverUV(vUv);
  /* 主体避让：首屏的主体就是那张脸，视线跟随全靠它，涟漪压在眼睛上等于把功能盖掉。
     半径以源图高度为单位，x 按宽高比校正所以在源图上是正圆；内圈 72% 完全不扰动，外圈 28% 过渡。
     uAvoid.y 按屏幕向下给（和 FilmStage 的 FACE 一致），这里翻成 UV 的向上。
     ⚠️ 这条衰减曾经写反（保护的是圈外），两帧互比看不出来（动画相位差会盖掉信号），
     是拿单帧径向剖面量出来的。
     gate 必须单独提出来：glint 的高光直接对 uDisplacement 取梯度、不吃 amount
     （第四十九次 mock 实测：gate 只乘 amount 时脸区内圈 |ΔL| 均 0.92、瞳孔 +0.95 ——
     位移挡住了、高光漏了。提出后内圈 0.00、瞳孔 +0.00）。 */
  float gate = 1.0;
  if (uAvoid.z > 0.0001) {
    vec2 fc = vec2(uAvoid.x, 1.0 - uAvoid.y);
    float d = length((base - fc) * vec2(uTextureSize.x / max(uTextureSize.y, 1.0), 1.0));
    float near = 1.0 - smoothstep(uAvoid.z * 0.72, uAvoid.z, d);
    gate = 1.0 - uAvoid.w * near;
    amount *= gate;
  }
  vec2 dir = vec2(sin(amount * uSwirl * TAU), cos(amount * uSwirl * TAU));
  vec2 push = dir * amount * uStrength;

  vec3 color;
  if (uDispersion > 0.001) {
    float split = uDispersion * 0.25;
    color.r = texture2D(uTexture, base + push * (1.0 + split)).r;
    color.g = texture2D(uTexture, base + push).g;
    color.b = texture2D(uTexture, base + push * (1.0 - split)).b;
  } else {
    color = texture2D(uTexture, base + push).rgb;
  }

  /* CSS filter 链：浏览器就在 sRGB 编码值上算，而且"每个函数各乘一遍、各截一次"。
     实测（8 个平面色块正算预测 vs 截图配对）：逐步截 0.21/通道（逐块都是 0），
     预乘成一条矩阵不夹截 8.46/通道，走 linearRGB 25.8/通道 —— 所以这三步不能合成一个矩阵。 */
  color = clamp(uSepia * color, 0.0, 1.0);
  color = clamp(uHue * color, 0.0, 1.0);
  color = clamp(uSat * color, 0.0, 1.0);
  color = clamp(color * uBright, 0.0, 1.0);

  if (uTintAmount > 0.001) {
    color = mix(color, color * uTint * 1.9, clamp(amount * 1.6, 0.0, 1.0) * uTintAmount);
  }
  /* ── 油彩上色轴（irid）：2026-10-15 整条撤掉 ──
     想要的效果是参考录屏里那层蓝紫青油膜。四轮实测全部证伪，数据留在这里别重试：
       · 参考定量（录屏油彩斑彩色像素 H 直方图）：蓝紫 210-300° 53.9% + 青 150-210° 25.1%
         = 冷色 78.9%；暗部 H 253°/S 0.64，亮部 H 191°。
       · 本站首屏底图是饱和暖橙（头发左上 S≈0.42、画面中部 S=0.417、H 25-50°），
         到蓝紫要跨 100°~200° 色相。
       · 六条路实测的冷色(150-300°)占比：
         1 乘性   mix(color, color*gel*2.2, m)   →  7.4%
         2 加性   color + film*m                  →  7.1%（整体提亮，冷色被暖底淹掉）
         3 替换   mix(color, gel, m)              → 11.6%（四种混合里最高）
         4 替换+保亮 mix(color, gel*lum, m)       →  1.8%
         5 再扫 相位间距×起始相位×频率×强度 270 组 → 天花板 46%
         6 色相旋转+冷带钳位 hueRot(color,hue*m)  →  0.0%（m 小，旋转量不够）
         7 HSV 空间直接换 H（保 V）               →  0.0%（暗部 amount 小，m 起不来）
     ⇒ 共同根因：任何保留底图亮度/饱和的叠加或旋转都被暖底拽回黄绿；而 m 依赖 amount，
         头发正是暗部、amount 天然小，颜色根本起不来。
     要真做出来只剩两条路：把油膜做成**独立加性发光层**（不乘 amount、按波纹强度独立给亮度），
     或换一张冷调首屏底图 —— 都属改视觉语言，等他点头，不擅自改。 */
  if (uGlint > 0.001) {
    float ex = texture2D(uDisplacement, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uDisplacement, vUv - vec2(uTexel.x, 0.0)).r;
    float ey = texture2D(uDisplacement, vUv + vec2(0.0, uTexel.y)).r - texture2D(uDisplacement, vUv - vec2(0.0, uTexel.y)).r;
    vec3 normal = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
    vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
    float raw = pow(max(dot(normal, light), 0.0), 22.0);
    float flatSpec = pow(max(light.z, 0.0), 22.0);
    /* 高光吃 gate（避让圈里一丝不漏）+ 落站内琥珀而不是纯白（白墨只留给文字） */
    color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint * gate;
  }
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

/* CSS filter 链 → 三个 3×3 矩阵（列主序 arr[列*3+行]，在 sRGB 编码值上算）。
   顺序就是 filter 里写下的顺序：sepia → hue-rotate → saturate，brightness 最后单独乘。 */
function sepiaM(t) {
  const u = 1 - t
  return [0.393 + 0.607 * u, 0.349 - 0.349 * u, 0.272 - 0.272 * u,
    0.769 - 0.769 * u, 0.686 + 0.314 * u, 0.534 - 0.534 * u,
    0.189 - 0.189 * u, 0.168 - 0.168 * u, 0.131 + 0.869 * u]
}
function hueM(deg) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a)
  /* 列主序。参考组件那份是按「行」写下来的（前三个数就是规范矩阵第 0 行），照抄会让着色器
     乘上 hue 矩阵的转置 —— sepia/saturate 本来就是列主序，所以只有这一条错
     （实测红块 GL (177,28,0) vs 浏览器 (177,15,24)）。 */
  return [0.213 + c * 0.787 - s * 0.213, 0.213 - c * 0.213 + s * 0.143, 0.213 - c * 0.213 - s * 0.787,
    0.715 - c * 0.715 - s * 0.715, 0.715 + c * 0.285 + s * 0.14, 0.715 - c * 0.715 + s * 0.715,
    0.072 - c * 0.072 + s * 0.928, 0.072 - c * 0.072 - s * 0.283, 0.072 + c * 0.928 + s * 0.072]
}
function satM(s) {
  const u = 1 - s
  return [0.213 + 0.787 * s, 0.213 * u, 0.213 * u,
    0.715 * u, 0.715 + 0.285 * s, 0.715 * u,
    0.072 * u, 0.072 * u, 0.072 + 0.928 * s]
}

function hexToRGB(hex) {
  const clean = String(hex).replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const n = parseInt(full, 16)
  if (Number.isNaN(n)) return [1, 1, 1]
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/* ── 从 computedStyle 复刻这一层本来长什么样（解析不了的一律返回 null，交给上层放弃） ── */
const KNOWN_FILTERS = ['sepia', 'hue-rotate', 'saturate', 'brightness']
const FILTER_DEFAULT = { sepia: 0, 'hue-rotate': 0, saturate: 1, brightness: 1 }
function parseFilter(text) {
  const s = String(text || '').trim()
  if (!s || s === 'none') return { ...FILTER_DEFAULT }
  const found = {}
  const re = /([a-z-]+)\(([^)]*)\)/g
  let m
  while ((m = re.exec(s))) {
    const fn = m[1]
    if (!KNOWN_FILTERS.includes(fn)) return null
    const raw = m[2].trim()
    let v = parseFloat(raw)
    if (!isFinite(v)) return null
    if (/^[-\d.]+%$/.test(raw)) v /= 100
    found[fn] = v
  }
  return { ...FILTER_DEFAULT, ...found }
}
function parseScale(transform) {
  const s = String(transform || 'none').trim()
  if (s === 'none') return 1
  const m = s.match(/^matrix\(([^)]+)\)$/)
  if (!m) return null // matrix3d、带位移或斜切的都不接，这一层只可能是纯 scale()
  const p = m[1].split(',').map(parseFloat)
  if (p.some((v) => !isFinite(v))) return null
  if (Math.abs(p[1]) > 1e-6 || Math.abs(p[0] - p[3]) > 1e-6) return null
  return p[0]
}
const POS_KW = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 }
function parsePos(text) {
  const parts = String(text || 'center').trim().split(/\s+/)
  if (parts.length === 1) parts.push('center') // CSS 只写一值时第二轴是 center
  const out = parts.map((t) => (/%$/.test(t) ? parseFloat(t) / 100 : (t in POS_KW ? POS_KW[t] : NaN)))
  return out.length === 2 && out.every(isFinite) ? out : null // 长度单位（px）不接
}

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(sh))
  return sh
}
function link(gl, vs, fs) {
  const p = gl.createProgram()
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs))
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p))
  return p
}
function locs(gl, p, names) {
  const o = {}
  for (const n of names) {
    if (n.startsWith('a_')) { o[n] = gl.getAttribLocation(p, n.slice(2)); continue }
    // iOffset / iScale / iOpacity 是**实例属性**不是 uniform。把它们当 uniform 查会得到 null，
    // 于是整个波纹遍一个像素都没画进位移缓冲（原型阶段真踩过，症状是"涟漪完全没效果"）。
    const at = gl.getAttribLocation(p, n)
    o[n] = at >= 0 ? at : gl.getUniformLocation(p, n)
  }
  return o
}

export function attachHeroRipple(opts) {
  // 没有 WebGL2、着色器编不过之类的环境问题：整层当它不存在，首屏还是原来那个 <video>
  try {
    return createLayer(opts)
  } catch {
    opts.root.classList.remove('has-ripple')
    return null
  }
}

function createLayer({ root, canvas, video, face, src }) {
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false,
    powerPreference: 'high-performance', preserveDrawingBuffer: false })
  if (!gl) return null
  /* StrictMode 下 effect 会「挂载 → cleanup → 再挂载」走两遍，中间那遍如果把 context 弄丢了，
     第二次 getContext 拿回来的是**同一个已丢的对象**（不是 null），在它上面画什么都不会出图。
     这种时候直接退让，让首屏维持原来那张 <video>。 */
  if (gl.isContextLost()) return null
  // 源图第 0 行是画面顶部，而合批遍的 vUv.y=1 也在屏幕顶部 —— 不翻就是上下颠倒。
  // 位移 FBO 是自己画的（上传用 null），不受这条影响。
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine = window.matchMedia('(pointer:fine)')

  const waveP = link(gl, WAVE_VS, WAVE_FS)
  const compP = link(gl, SCREEN_VS, COMP_FS)
  const WL = locs(gl, waveP, ['a_position', 'a_uv', 'iOffset', 'iScale', 'iOpacity', 'uRings'])
  const CL = locs(gl, compP, ['a_position', 'uTexture', 'uDisplacement', 'uResolution', 'uTextureSize',
    'uTexel', 'uObjectPos', 'uZoom', 'uTint', 'uAvoid', 'uSepia', 'uHue', 'uSat', 'uBright',
    'uStrength', 'uSwirl', 'uDispersion', 'uGlint', 'uTintAmount', 'uHighlight'])

  const instBytes = new Uint8Array(MAX_WAVES * 20)
  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1,
  ]), gl.STATIC_DRAW)
  const inst = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, inst)
  gl.bufferData(gl.ARRAY_BUFFER, instBytes.byteLength, gl.DYNAMIC_DRAW)
  const waveVAO = gl.createVertexArray()
  gl.bindVertexArray(waveVAO)
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.enableVertexAttribArray(WL.a_position)
  gl.vertexAttribPointer(WL.a_position, 2, gl.FLOAT, false, 16, 0)
  gl.enableVertexAttribArray(WL.a_uv)
  gl.vertexAttribPointer(WL.a_uv, 2, gl.FLOAT, false, 16, 8)
  gl.bindBuffer(gl.ARRAY_BUFFER, inst)
  for (const [at, size, off] of [[WL.iOffset, 2, 0], [WL.iScale, 2, 8], [WL.iOpacity, 1, 16]]) {
    gl.enableVertexAttribArray(at)
    gl.vertexAttribPointer(at, size, gl.FLOAT, false, 20, off)
    gl.vertexAttribDivisor(at, 1)
  }

  const tri = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, tri)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const compVAO = gl.createVertexArray()
  gl.bindVertexArray(compVAO)
  gl.bindBuffer(gl.ARRAY_BUFFER, tri)
  gl.enableVertexAttribArray(CL.a_position)
  gl.vertexAttribPointer(CL.a_position, 2, gl.FLOAT, false, 0, 0)
  gl.bindVertexArray(null)

  const tex = gl.createTexture()
  const dispTex = gl.createTexture()
  const fbo = gl.createFramebuffer()
  for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER, gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) {
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, p, p === gl.TEXTURE_WRAP_S || p === gl.TEXTURE_WRAP_T ? gl.CLAMP_TO_EDGE : gl.LINEAR)
    gl.bindTexture(gl.TEXTURE_2D, dispTex)
    gl.texParameteri(gl.TEXTURE_2D, p, p === gl.TEXTURE_WRAP_S || p === gl.TEXTURE_WRAP_T ? gl.CLAMP_TO_EDGE : gl.LINEAR)
  }

  let width = 1
  let height = 1
  let fieldW = 2
  let fieldH = 2
  let srcW = src[0]
  let srcH = src[1]
  let srcDirty = true
  let forceDraw = true
  let alive = 0
  let last = 0
  let raf = 0
  let haveFrame = false // 源画面一次都没传上来过 —— 这种时候画出来是黑的
  let layerOn = false // has-ripple 的实际状态：真画出过一帧才允许压掉下面那张 <video>
  let prevX = 0
  let prevY = 0
  let geo = null
  let running = false

  const waves = Array.from({ length: MAX_WAVES }, () => ({
    x: 0, y: 0, scale: START_SCALE, target: START_SCALE, size: 1, opacity: 0,
  }))
  let cursor = 0

  function readGeometry() {
    const cs = getComputedStyle(video)
    const zoom = parseScale(cs.transform)
    const pos = parsePos(cs.objectPosition)
    const filter = parseFilter(cs.filter)
    if (zoom == null || !pos || !filter) {
      geo = null
      return false
    }
    geo = { zoom, pos, sepia: sepiaM(filter.sepia), hue: hueM(filter['hue-rotate']),
      sat: satM(filter.saturate), bright: filter.brightness }
    forceDraw = true
    return true
  }

  // 有指针可跟 + 没开「减少动效」+ 这一层的形状复刻得了，三者齐备才画
  const gateOk = () => fine.matches && !reduce.matches && geo != null

  function setLayer(on) {
    if (layerOn === on) return
    layerOn = on
    root.classList.toggle('has-ripple', on)
  }

  function makeDisp(w, h) {
    gl.bindTexture(gl.TEXTURE_2D, dispTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dispTex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  function resize() {
    const b = canvas.getBoundingClientRect()
    width = Math.max(1, Math.round(b.width))
    height = Math.max(1, Math.round(b.height))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    fieldW = Math.max(2, Math.round(width * FIELD_SCALE))
    fieldH = Math.max(2, Math.round(height * FIELD_SCALE))
    makeDisp(fieldW, fieldH)
    srcDirty = true
  }

  function upload() {
    gl.bindTexture(gl.TEXTURE_2D, tex)
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
    } catch {
      return false // metadata/帧还没到，下一拍再来
    }
    if (video.videoWidth) {
      srcW = video.videoWidth
      srcH = video.videoHeight
    }
    srcDirty = false
    haveFrame = true
    forceDraw = true // 传了新画面就必须出一帧，否则首帧 / resize 之后一直是黑的
    return true
  }

  function frame(now) {
    const delta = last ? Math.min(0.05, (now - last) / 1000) : 0
    last = now
    // 只在首屏那一屏画：交棒之后这一层已经被淡掉，没必要继续占 GPU
    if (!root.classList.contains('is-intro') || document.hidden) return

    /* 源画面重传：视频在**播**（状态机里的播进段）时每帧都得传，停下来就不传 ——
       首屏的设计本来就是「不滚动时画面不动」。换帧由 seeked / timeupdate 标脏。 */
    if (!haveFrame) {
      if (video.readyState < 2 || !upload()) return
    } else if (srcDirty || forceDraw || !video.paused) {
      upload()
    }

    const growth = 1 - Math.exp(-delta * 1.09)
    const decay = Math.exp((-delta * LIFE_CONSTANT) / PARAMS.fade)
    alive = 0
    const iv = new Float32Array(instBytes.buffer)
    for (let i = 0; i < MAX_WAVES; i++) {
      const w = waves[i]
      if (w.opacity <= 0) { iv[i * 5 + 4] = 0; continue }
      w.opacity *= decay
      w.scale += (w.target - w.scale) * growth
      if (w.opacity < 0.002) { w.opacity = 0; iv[i * 5 + 4] = 0; continue }
      alive++
      const half = (w.scale * w.size) / 2
      iv[i * 5] = (w.x / width) * 2 - 1
      iv[i * 5 + 1] = (w.y / height) * 2 - 1
      iv[i * 5 + 2] = (half / width) * 2
      iv[i * 5 + 3] = (half / height) * 2
      iv[i * 5 + 4] = w.opacity
    }
    if (!alive && !forceDraw) return // 静置：这一帧整个不出图

    gl.bindBuffer(gl.ARRAY_BUFFER, inst)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, iv)

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.viewport(0, 0, fieldW, fieldH)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.disable(gl.DEPTH_TEST)
    gl.useProgram(waveP)
    gl.uniform1f(WL.uRings, PARAMS.rings)
    gl.bindVertexArray(waveVAO)
    // quad 是两个独立三角形（6 顶点），不是 4 顶点的 strip —— 用 strip 只会画出半个波纹
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, MAX_WAVES)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.disable(gl.BLEND)
    gl.useProgram(compP)
    gl.uniform1i(CL.uTexture, 0)
    gl.uniform1i(CL.uDisplacement, 1)
    gl.uniform2f(CL.uResolution, canvas.width, canvas.height)
    gl.uniform2f(CL.uTextureSize, srcW, srcH)
    gl.uniform2f(CL.uTexel, 1 / fieldW, 1 / fieldH)
    gl.uniform2f(CL.uObjectPos, geo.pos[0], geo.pos[1])
    gl.uniform1f(CL.uZoom, geo.zoom)
    gl.uniform3fv(CL.uTint, hexToRGB(TINT))
    gl.uniform4f(CL.uAvoid, face.x, face.y, AVOID_R, AVOID_W)
    // 三个矩阵分开上传：浏览器每一步各截一次，预乘成一个就没法夹截（实测差 8.46/通道）
    gl.uniformMatrix3fv(CL.uSepia, false, new Float32Array(geo.sepia))
    gl.uniformMatrix3fv(CL.uHue, false, new Float32Array(geo.hue))
    gl.uniformMatrix3fv(CL.uSat, false, new Float32Array(geo.sat))
    gl.uniform1f(CL.uBright, geo.bright)
    gl.uniform1f(CL.uStrength, PARAMS.strength)
    gl.uniform1f(CL.uSwirl, PARAMS.swirl)
    gl.uniform1f(CL.uDispersion, PARAMS.dispersion)
    gl.uniform1f(CL.uGlint, PARAMS.glint)
    gl.uniform1f(CL.uTintAmount, PARAMS.tintAmount)
    gl.uniform3fv(CL.uHighlight, hexToRGB(HIGHLIGHT))
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, dispTex)
    gl.bindVertexArray(compVAO)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.bindVertexArray(null)

    forceDraw = false
    let bad = 0
    for (let k = 0; k < 3; k++) if (gl.getError()) bad++
    if (bad) {
      // 画不出来就整层退回去：宁可没有涟漪，也不要一块盖住首屏的黑
      stop()
      setLayer(false)
      return
    }
    // 真画出过一帧才允许把下面那张 <video> 压掉：这一层要是黑的，首屏就跟着黑了
    setLayer(true)
  }

  function loop(now) {
    raf = requestAnimationFrame(loop)
    if (gateOk()) frame(now)
  }

  const box = { left: 0, top: 0, height: 1 }
  function remeasure() {
    const b = canvas.getBoundingClientRect()
    box.left = b.left
    box.top = b.top
    box.height = b.height
    resize()
  }

  function onMove(e) {
    if (!gateOk() || !root.classList.contains('is-intro')) return
    // 波纹坐标是画布盒子内的像素、y 向上为正（盒子比视口宽 12%，见 FilmStage.css 那条 ⚠️）
    const x = e.clientX - box.left
    const y = box.height - (e.clientY - box.top)
    if (Math.abs(x - prevX) > PARAMS.spacing || Math.abs(y - prevY) > PARAMS.spacing) {
      const w = waves[cursor]
      cursor = (cursor + 1) % MAX_WAVES
      w.x = x
      w.y = y
      w.scale = START_SCALE
      w.target = START_SCALE * PARAMS.spread
      w.size = PARAMS.brushSize
      w.opacity = 1
      prevX = x
      prevY = y
    }
  }

  const markDirty = () => { srcDirty = true }
  const onLost = (e) => { e.preventDefault(); stop(); setLayer(false) }
  function onGate() {
    // 门翻了不必停监听：不画的时候 loop 自己会跳过，翻回来补一次 forceDraw 就续上
    if (gateOk()) forceDraw = true
    else setLayer(false)
  }
  function onResize() {
    readGeometry()
    remeasure()
    // 视口跨到 CSS 写了这里复刻不了的形状（object-position 变成 px、filter 多出函数之类）：让位给视频
    if (!geo) setLayer(false)
  }

  const ro = new ResizeObserver(remeasure)

  function start() {
    if (running) return
    running = true
    readGeometry()
    remeasure()
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    video.addEventListener('seeked', markDirty)
    video.addEventListener('timeupdate', markDirty)
    video.addEventListener('loadeddata', markDirty)
    canvas.addEventListener('webglcontextlost', onLost)
    reduce.addEventListener('change', onGate)
    fine.addEventListener('change', onGate)
    raf = requestAnimationFrame(loop)
  }

  function stop() {
    if (!running) return
    running = false
    cancelAnimationFrame(raf)
    raf = 0
    ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('resize', onResize)
    video.removeEventListener('seeked', markDirty)
    video.removeEventListener('timeupdate', markDirty)
    video.removeEventListener('loadeddata', markDirty)
    canvas.removeEventListener('webglcontextlost', onLost)
    reduce.removeEventListener('change', onGate)
    fine.removeEventListener('change', onGate)
  }

  start()

  return {
    /* 故意不调 WEBGL_lose_context.loseContext()：dev 下 StrictMode 是「挂载 → cleanup → 再挂载」，
       主动丢上下文之后，第二次在同一 canvas 上拿到的还是那个已丢的对象，首屏就永远没有涟漪。
       监听、rAF 与 has-ripple 由 stop()/setLayer() 收干净，GL 对象留在同一个 context 上。 */
    destroy() {
      stop()
      setLayer(false)
    },
  }
}
