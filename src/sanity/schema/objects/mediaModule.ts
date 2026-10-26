/**
 * mediaModule —— 作品详情页的媒体模块（数组项，可自由排序）
 *
 * 四种模块类型，对应需求里的「单张图片 / 多图画廊 / 视频 / 图文」：
 *   image    单张图片（含 alt + hotspot）
 *   gallery  多图画廊（图片数组，前台横向滚动或网格）
 *   video    视频（文件或地址 + poster + 播放开关）
 *   imageText 图文模块（图片 + 标题 + 正文，左右排版）
 *
 * 排序：详情页数组用 orderable 列表，Studio 里直接拖拽，
 * GROQ 查询不带 order 子句，数组顺序即展示顺序（与 sortOrder 字段各司其职：
 * 模块内排序靠拖拽，作品之间排序靠 sortOrder 数字）。
 */
import { defineType, defineField, defineArrayMember } from 'sanity'

export const mediaModule = defineType({
  name: 'mediaModule',
  title: '详情页媒体模块',
  type: 'object',
  fields: [
    defineField({
      name: 'moduleType',
      title: '模块类型',
      type: 'string',
      description: '选择这个模块怎么展示，切换后下方字段会跟着变。',
      options: {
        list: [
          { title: '单张图片', value: 'image' },
          { title: '多图画廊', value: 'gallery' },
          { title: '视频', value: 'video' },
          { title: '图文模块', value: 'imageText' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),

    // ── 单张图片 ──
    defineField({
      name: 'image',
      title: '图片',
      type: 'image',
      options: { hotspot: true, accept: 'image/*' },
      hidden: ({parent}: any) => parent?.moduleType !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.moduleType === 'image' && !value) {
            return '「单张图片」模块必须上传图片'
          }
          return true
        }),
    }),
    defineField({
      name: 'alt',
      title: '替代文本（alt）',
      type: 'string',
      hidden: ({parent}: any) => parent?.moduleType === 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.moduleType === 'image' && !value) {
            return '图片必须填写替代文本'
          }
          return true
        }),
    }),
    defineField({
      name: 'caption',
      title: '图注',
      type: 'string',
      description: '显示在图片下方的小字说明，可留空。',
      hidden: ({parent}: any) => parent?.moduleType !== 'image' && parent?.moduleType !== 'gallery',
    }),

    // ── 多图画廊 ──
    defineField({
      name: 'gallery',
      title: '画廊图片',
      type: 'array',
      description: '至少 2 张。前台按数组顺序展示。',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true, accept: 'image/*' },
        }),
      ],
      hidden: ({parent}: any) => parent?.moduleType !== 'gallery',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.moduleType === 'gallery' && (!value || value.length < 2)) {
            return '「多图画廊」模块至少需要 2 张图片'
          }
          return true
        }),
    }),

    // ── 视频 ──
    defineField({
      name: 'videoFile',
      title: '视频文件',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({parent}: any) => parent?.moduleType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: '视频地址',
      type: 'url',
      description: '外链视频地址，与「视频文件」二选一即可。',
      hidden: ({parent}: any) => parent?.moduleType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: '视频 Poster',
      type: 'image',
      options: { hotspot: true, accept: 'image/*' },
      hidden: ({parent}: any) => parent?.moduleType !== 'video',
    }),
    defineField({
      name: 'autoplay',
      title: '自动播放',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}: any) => parent?.moduleType !== 'video',
    }),
    defineField({
      name: 'loop',
      title: '循环播放',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}: any) => parent?.moduleType !== 'video',
    }),
    defineField({
      name: 'muted',
      title: '静音',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}: any) => parent?.moduleType !== 'video',
    }),

    // ── 图文模块 ──
    defineField({
      name: 'imageTextTitle',
      title: '图文标题',
      type: 'string',
      hidden: ({parent}: any) => parent?.moduleType !== 'imageText',
    }),
    defineField({
      name: 'imageTextBody',
      title: '图文正文',
      type: 'text',
      rows: 4,
      hidden: ({parent}: any) => parent?.moduleType !== 'imageText',
    }),
  ],
  preview: {
    select: {
      moduleType: 'moduleType',
      image: 'image',
      caption: 'caption',
      imageTextTitle: 'imageTextTitle',
      videoUrl: 'videoUrl',
      gallery: 'gallery',
    },
    prepare({ moduleType, image, caption, imageTextTitle, videoUrl, gallery }) {
      const labels: Record<string, string> = {
        image: '单张图片',
        gallery: '多图画廊',
        video: '视频',
        imageText: '图文模块',
      }
      const media = moduleType === 'gallery' ? gallery?.[0] : image
      const subtitle =
        moduleType === 'imageText'
          ? imageTextTitle || '（未填标题）'
          : moduleType === 'video'
            ? videoUrl || '已上传视频文件'
            : caption || ''
      return {
        title: labels[moduleType] || moduleType,
        subtitle,
        media,
      }
    },
  },
})
