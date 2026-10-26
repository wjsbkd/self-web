/**
 * project —— 作品（核心内容类型）
 *
 * 对应需求第二节的全部字段：
 *   标题 title / 唯一地址 slug / 年份 year / 分类 category /
 *   项目摘要 summary / 项目详细文案 description / 封面 cover /
 *   展示顺序 sortOrder / 发布状态 status / 是否精选 featured /
 *   创建时间 createdAt / 更新时间 updatedAt
 *
 * 关键设计：
 * - slug 用 source(title) 自动生成，且 isUnique 校验唯一性；
 *   用户可手动改，重名会被 Sanity 拦下（这是需求「slug 必须唯一」的落地）。
 * - status 是判别草稿/发布的唯一依据。前台 GROQ 一律带
 *   `status == "published"` 过滤，草稿不出现在正式网站。
 * - sortOrder 为数字，前台 `order(sortOrder asc)`。
 *   ⚠️ 没用 orderRank：orderRank 在新版 Studio 里要额外装插件且行为偏重，
 *   数字字段 + 列表排序视图（见 studio.tsx 的 orderings）成本更低，
 *   也满足需求「至少提供数字排序字段」。
 * - createdAt / updatedAt 是只读字段，由 prepare/validate 之外的
 *   Studio 内置机制维护（这里显式声明，让 GROQ 能取到）。
 * - media[] 用 orderable 数组，Studio 内可拖拽排序详情页模块。
 */
import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: '作品',
  type: 'document',
  groups: [
    { name: 'basic', title: '基本信息', default: true },
    { name: 'content', title: '内容文案' },
    { name: 'media', title: '封面与媒体' },
    { name: 'meta', title: '发布与排序' },
  ],
  fields: [
    // ── 基本信息 ──
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      group: 'basic',
      description: '作品的展示名称，会出现在列表与详情页。',
      validation: (Rule) => Rule.required().min(1).max(120),
    }),
    defineField({
      name: 'slug',
      title: '唯一地址（slug）',
      type: 'slug',
      group: 'basic',
      description: '详情页网址的一部分，例如 my-project。留空会根据标题自动生成，也可手动修改；必须全站唯一。',
      options: {
        source: 'title',
        maxLength: 96,
        // slugify 由 Sanity 内置处理；isUnique 在下方自定义校验里做
      },
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value?.current) return '必须填写 slug（或根据标题自动生成）'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)) {
            return 'slug 只能包含小写字母、数字与短横线，且不能以短横线开头或结尾'
          }
          // 唯一性校验：查同 dataset 里有没有别的文档占用这个 slug
          const client = context.getClient({ apiVersion: '2024-10-01' })
          const id = context.document?._id?.replace(/^drafts\./, '')
          const existing = await client.fetch(
            `count(*[_type == "project" && slug.current == $slug && _id != $id][0])`,
            { slug: value.current, id },
          )
          if (existing > 0) return `slug「${value.current}」已被其他作品占用，请换一个`
          return true
        }),
    }),
    defineField({
      name: 'year',
      title: '年份',
      type: 'string',
      group: 'basic',
      description: '例如 2026。用字符串而不是 number：作品可能跨年（2025-2026）。',
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: 'category',
      title: '分类',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basic',
      description: '从「分类」里选择；没有合适的先去分类模块新增。',
      validation: (Rule) => Rule.required(),
    }),

    // ── 内容文案 ──
    defineField({
      name: 'summary',
      title: '项目摘要',
      type: 'text',
      rows: 3,
      group: 'content',
      description: '一两句话的简介，用在列表卡片与分享卡片。',
      validation: (Rule) => Rule.required().min(10).max(300),
    }),
    defineField({
      name: 'description',
      title: '项目详细文案',
      type: 'array',
      group: 'content',
      description: '详情页正文，支持加粗、斜体、链接、列表等富文本格式。',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),

    // ── 首页列表卡 / 详情面板的展示字段 ──
    // 这几个字段是现有前台设计里已有的文案位（Projects.jsx 的概览卡与右侧详情面板），
    // 不做成必填：新作品可以只写 summary，缺的格子自动留空，不会破版。
    defineField({
      name: 'subtitle',
      title: '卡片副标题',
      type: 'string',
      group: 'content',
      description: '首页概览卡右上角的那行小字，写角色或类型，例如「赛事内容宣发 / 账号运营」。留空则显示分类名。',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'stat',
      title: '数据亮点',
      type: 'string',
      group: 'content',
      description: '概览卡右下角的大数字，例如「70W+」「420+」。留空则不显示。',
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'label',
      title: '数据说明',
      type: 'string',
      group: 'content',
      description: '数据亮点下面的小字，例如「系列总浏览」「海内外媒体报道」。',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: 'background',
      title: '项目背景（详情面板）',
      type: 'text',
      rows: 2,
      group: 'content',
      description: '首页作品区右侧面板的第一段。留空则用「项目摘要」。',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'responsibility',
      title: '我的职责（详情面板）',
      type: 'text',
      rows: 3,
      group: 'content',
      description: '我在这个项目里具体做了什么。留空则这一栏不显示。',
      validation: (Rule) => Rule.max(600),
    }),
    defineField({
      name: 'result',
      title: '项目成果（详情面板）',
      type: 'text',
      rows: 3,
      group: 'content',
      description: '可量化的结果。留空则这一栏不显示。',
      validation: (Rule) => Rule.max(600),
    }),

    // ── 封面与媒体 ──
    defineField({
      name: 'cover',
      title: '封面',
      type: 'mediaCover',
      group: 'media',
      description: '支持图片或视频封面，选择类型后字段会跟着变。',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'media',
      title: '详情页媒体模块',
      type: 'array',
      group: 'media',
      description: '详情页里按顺序展示的媒体模块，可拖拽调整顺序。可为空（此时详情页只显示文案）。',
      of: [{ type: 'mediaModule' }],
      options: {
        // 数组项可拖拽排序（Sanity 内置能力）
        sortable: true,
      },
    }),

    // ── 发布与排序 ──
    defineField({
      name: 'sortOrder',
      title: '展示顺序',
      type: 'number',
      group: 'meta',
      description: '数字越小越靠前。新增作品时填一个较大的数（如 99）再按需调整。',
      initialValue: 99,
      validation: (Rule) => Rule.required().integer().min(0).max(9999),
    }),
    defineField({
      name: 'status',
      title: '发布状态',
      type: 'string',
      group: 'meta',
      description: '只有「已发布」的作品会出现在正式网站上；草稿仅后台与预览可见。',
      options: {
        list: [
          { title: '草稿', value: 'draft' },
          { title: '已发布', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: '是否精选',
      type: 'boolean',
      group: 'meta',
      description: '精选作品会在前台获得更突出的展示位置。',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: '展示顺序（小→大）',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: '创建时间（新→旧）',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: '标题（A→Z）',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      status: 'status',
      featured: 'featured',
      media: 'cover.image',
      poster: 'cover.poster',
      mediaType: 'cover.mediaType',
      sortOrder: 'sortOrder',
    },
    prepare({ title, year, status, featured, media, poster, mediaType, sortOrder }) {
      const statusMark = status === 'published' ? '✅ 已发布' : '📝 草稿'
      const featMark = featured ? ' ⭐精选' : ''
      return {
        title: title || '（未命名作品）',
        subtitle: `${statusMark}${featMark} · 排序 ${sortOrder ?? '-'} · ${year ?? ''}`,
        media: mediaType === 'video' ? poster : media,
      }
    },
  },
})
