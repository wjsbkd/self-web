/**
 * mediaCover —— 作品封面对象（图片 / 视频二选一）
 *
 * 设计要点：
 * - mediaType 是判别字段，Studio 用 hidden() 根据它切换显示哪些字段，
 *   避免「选了图片却还要填视频 URL」的割裂感。
 * - 图片分支的 hotspot 由 Sanity 图片管线原生支持（裁切 + 焦点），
 *   前台用 @sanity/image-url 的 .fit('crop').crop(hotspot) 还原。
 * - 视频分支同时支持「上传文件」和「外链地址」：
 *   上传受 Sanity 资产额度限制（免费档 5GB / 250 资产），
 *   所以大文件优先填 URL； poster 仍是图片。
 */
import { defineType, defineField } from 'sanity'

/** 前台媒体类型判别（与 adapters/mediaCover.ts 的返回结构一致） */
export type CoverMediaType = 'image' | 'video'

export const mediaCover = defineType({
  name: 'mediaCover',
  title: '封面媒体',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: '媒体类型',
      type: 'string',
      description: '选择封面的呈现形式，切换后下方字段会跟着变。',
      options: {
        list: [
          { title: '图片', value: 'image' },
          { title: '视频', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),

    // ── 图片分支 ──
    defineField({
      name: 'image',
      title: '封面图片',
      type: 'image',
      description: '建议 1600×900 以上，Sanity 会自动生成响应式尺寸。',
      options: {
        hotspot: true, // 开启裁切与焦点设置
        accept: 'image/*',
      },
      hidden: ({parent}: any) => parent?.mediaType !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.mediaType === 'image' && !value) {
            return '选择「图片」类型时，必须上传封面图片'
          }
          return true
        }),
    }),
    defineField({
      name: 'alt',
      title: '图片替代文本（alt）',
      type: 'string',
      description: '给读屏软件与图片加载失败时的文字说明，同时用于 SEO。',
      hidden: ({parent}: any) => parent?.mediaType !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.mediaType === 'image' && !value) {
            return '图片必须填写替代文本（无障碍要求）'
          }
          return true
        }),
    }),

    // ── 视频分支 ──
    defineField({
      name: 'videoFile',
      title: '视频文件',
      type: 'file',
      description:
        '直接上传到 Sanity。⚠️ 免费档资产额度 5GB / 250 个，大文件建议改用「视频地址」。',
      options: { accept: 'video/*' },
      hidden: ({parent}: any) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: '视频地址',
      type: 'url',
      description: '外链视频（mp4 / m3u8）。与「视频文件」二选一即可，都填时优先用文件。',
      hidden: ({parent}: any) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'poster',
      title: '视频 Poster（封面帧）',
      type: 'image',
      description: '视频加载前显示的静帧，也用作卡片封面。',
      options: { hotspot: true, accept: 'image/*' },
      hidden: ({parent}: any) => parent?.mediaType !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if ((context.parent as any)?.mediaType === 'video' && !value) {
            return '视频封面必须提供 Poster 图'
          }
          return true
        }),
    }),
    defineField({
      name: 'autoplay',
      title: '自动播放',
      type: 'boolean',
      description: '⚠️ 浏览器普遍禁止带声音的自动播放，通常需要同时开启「静音」。',
      initialValue: false,
      hidden: ({parent}: any) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'loop',
      title: '循环播放',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}: any) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'muted',
      title: '静音',
      type: 'boolean',
      description: '静音是自动播放能被浏览器放行的前提，建议保持开启。',
      initialValue: true,
      hidden: ({parent}: any) => parent?.mediaType !== 'video',
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
      poster: 'poster',
      alt: 'alt',
      videoUrl: 'videoUrl',
    },
    prepare({ mediaType, image, poster, alt, videoUrl }) {
      const media = image ?? poster
      const title = mediaType === 'video' ? '视频封面' : '图片封面'
      return {
        title,
        subtitle: mediaType === 'video' ? videoUrl || '已上传视频文件' : alt || '（未填替代文本）',
        media,
      }
    },
  },
})
