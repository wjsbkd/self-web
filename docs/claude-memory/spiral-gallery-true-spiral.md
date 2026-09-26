---
name: spiral-gallery-true-spiral
description: "SpiralGallery \"真螺旋照片墙\" 的正确几何与踩过的多圈重合坑；改动前必读"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7e495bb2-5e65-4668-a24c-d2f5755c1b8a
  modified: 2026-08-01T03:17:13.022Z
---

`src/components/SpiralGallery.jsx`（账号运营板块图片墙）2026-08-01 改为"真·阶梯螺旋"，几何选型踩过坑，务必带上下文再改。

**正确实现（当前 v7）**：单圈圆柱 `turns=1`（rotateY(i·θ) translateZ(radius)），θ=2π/N；y 沿"距正前方的张数 d"做**线性阶梯**：`frontIdx = round(-rot/θ)`，`d = i-frontIdx` 折叠到 (-N/2,N/2]，`y = (d/N)·climbY`。正前那张 d=0 居中、唯一大图、完整露出（front>0.9 时 maskImage='none'）；旁侧逐张阶梯，背面接缝看不见。滚轮 step-snap 推进 frontIdx → 整条阶梯线整体上下挪，所有 N 张依次到正前完整展示。

**踩坑：多圈 turns>1 的方案已否决**。
- `turns=2.5`、`turns=2.3` 都试过：多圈里每圈都有一个 front=1 方向 → 多张同时"最大"，且当 (turns·N) 使某两张角度差恰为 360° 整数倍时**完全重合**（i0 与 i4 同角度、同 front）。即便 turns=2.3 错开重合，y 还要折叠到 ±totalClimb/2 循环 → 视觉是零散点而非连贯螺旋线。
- 结论：要"唯一正前方大图"必须 `turns=1`；要"阶梯螺旋"用 `d` 的线性 y 而非多圈。两者不要叠加。

**验证注意**：无头 Chrome/Edge 默认 `prefers-reduced-motion: reduce`，SpiralGallery 的 `wheelEnabled = !reduceMotion` → 滚轮 step-snap 在 headless 下被 `if(!wheelEnabled) return` 拦掉、不扭转。**用户真实浏览器不开 reduce-motion 时正常**。验证阶梯几何用 DOM 座标（每张 getBoundingClientRect 的 y 排序应为连续阶梯），不要靠滚轮 dispatch。

**几何参数**：radius 460、climbPerTurn 1.0（climbY = cardH × 1.0，随卡片 offsetHeight 自适应响应式）。视觉权重 scale 0.45~1.2、opacity 0.1~1.0（温和衰减，旁侧阶梯半透明可见）。
