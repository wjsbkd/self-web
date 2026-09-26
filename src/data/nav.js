// 顶部导航数据（单一数据源），组件只负责渲染
// 顺序与页面自上而下阅读顺序严格一致：
// 关于 → 能力与优势 → 经历 → 项目 → 作品 → 账号运营
// 导航 / 右侧圆点 / 滚动高亮 / 键盘方向键均由此驱动，保持一致才不会“跳序”。
export const navLinks = [
  { id: 'about', label: '关于' },
  { id: 'strengths', label: '能力与优势' },
  { id: 'experience', label: '经历' },
  { id: 'work', label: '项目' },
  { id: 'media', label: '作品' },
  { id: 'account', label: '账号运营' },
]

// 联系方式单一数据源：全站所有联系入口（邮箱 / 电话 / 微信 / 简历 PDF）
// 均从此取值，避免在多个组件里散落硬编码导致不一致。
export const contactEmail = 'lizongheng2025@163.com'
export const contactPhone = '150-8732-2631'
export const contactPhoneTel = '+8615087322631'
export const contactWechat = '15087322631'
export const resumePdf = '/assets/李纵横15087322631.pdf'
