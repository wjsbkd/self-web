// 个人能力展示数据：参考桌面《作品集.pdf》第一页
// 2026-10-17：四张图从 PNG 换成同目录 WebP（1,151,262 B → 304,276 B，−74%）。
// PNG 原样保留在 public/ 里 —— 它们是 pptx 的逐字节导出件，覆盖会把
// 「项目文件 ↔ pptx 媒体号」这条对应关系弄断，所以新增派生件、把引用改过去。
// ⚠️ 这 4 个 PNG（image2/4/6 + poster-trio-ai）在 `assets-src/pptx-media/` 里**没有副本**
//   （那次搬走的是另外 11 个未引用文件），但它们各自都已入库（`git hash-object` 与
//   `rev-parse HEAD:` 逐个比对一致），所以删工作区那份也能从仓库取回。
//   2026-10-18 审计曾误判「assets-src 有同字节副本」而要删，复核后撤回。
//   回退只需把下面四处 .webp 改回 .png。
export const abilityMaterials = [
  {
    id: 'capcut',
    title: '视频剪辑与特效',
    image: '/assets/pptx-media/image2.webp',
    description:
      '熟练运用剪映进行视频剪辑，覆盖素材导入、特效添加、转场设置等完整流程，具备扎实的短视频制作基础。能持续产出具有创意和观赏性的内容，如“付航”“黑神话”等相关系列作品，最高单条播放量超 270W。',
    tags: ['剪映', '短视频剪辑', '特效转场', '内容运营'],
  },
  {
    id: 'davinci',
    title: '调色与后期制作',
    image: '/assets/pptx-media/image6.webp',
    description:
      '精通达芬奇 Resolve Studio 的视频调色与剪辑后期工作，可对视频进行色彩校正、曲线调整等精细处理，有效提升视频视觉效果与质量，满足宣传视频素材的专业制作要求。',
    tags: ['达芬奇', '色彩校正', '曲线调整', '后期制作'],
  },
  {
    id: 'sketchup',
    title: '3D 场景与空间设计',
    image: '/assets/pptx-media/image4.webp',
    imageFit: 'contain',
    description:
      '能熟练使用 SketchUp、Revit、CATIA 等多种 3D 建模软件（以 SketchUp 为例），在图形设计、空间布局规划方面能力突出。可应用于宣传活动场地布置、舞台设计，能够根据视频或图片精准还原舞台场景，打造独特的空间视觉效果。',
    tags: ['SketchUp', '3D 建模', '空间布局', '舞台设计'],
  },
  {
    id: 'poster',
    title: '海报与视觉设计',
    image: '/assets/pptx-media/poster-trio-ai.webp',
    description:
      '具备出色的海报设计能力，能依据不同主题和风格要求，通过简洁明了的设计与文案精准传达关键信息，有效吸引目标群体。可直接迁移至宣传海报制作，依据形象和宣传主题打造独具特色的视觉作品。',
    tags: ['海报设计', '视觉设计', '排版', '品牌视觉'],
  },
]
