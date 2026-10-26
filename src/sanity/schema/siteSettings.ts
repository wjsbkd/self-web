/**
 * siteSettings —— 网站全局设置（单例文档）
 *
 * 对应需求第五节：
 *   网站名称 / 首页介绍 / SEO 标题 / SEO 描述 / 分享封面 /
 *   页脚内容 / 联系方式 / 社交链接 / 可选背景音乐
 *
 * 背景音乐字段（需求明确要求的三项 + 两个播放策略项）：
 *   音频文件或地址 file / url
 *   音乐名称        name
 *   是否启用        enabled
 *   是否循环        loop
 *   默认音量        volume（0–1）
 *
 * ⚠️ 自动播放红线（需求第九节）：enabled 只表示「这个站点配了背景音乐」，
 *    不等于「进站就响」。前台 AudioToggle 组件必须由用户主动开启才播放，
 *    并把用户的选择存 localStorage（key: lzh-bgm-pref）。
 *    浏览器自动播放策略：未静音的 play() 会被拒绝，组件要 catch 这个
 *    NotAllowedError 并保持静默，不能弹错误。
 */
import { defineType, defineField, defineArrayMember } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '网站全局设置',
  type: 'document',
  // 单例语义由 structure.ts 的 singletonListItem 落地（固定 _id = 'siteSettings'）
  groups: [
    { name: 'basic', title: '基础信息', default: true },
    { name: 'seo', title: 'SEO 与分享' },
    { name: 'footer', title: '页脚与联系' },
    { name: 'music', title: '背景音乐' },
  ],
  fields: [
    // ═══ 基础信息 ═══
    defineField({
      name: 'siteName',
      title: '网站名称',
      type: 'string',
      group: 'basic',
      description: '显示在浏览器标签与分享卡片，例如：李纵横 · 个人作品集。',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: '首页介绍',
      type: 'text',
      rows: 4,
      group: 'basic',
      description: '首页的一段介绍文字，可留空使用默认文案。',
    }),

    // ═══ SEO 与分享 ═══
    defineField({
      name: 'seoTitle',
      title: 'SEO 标题',
      type: 'string',
      group: 'seo',
      description: '<title> 标签内容，建议 30 个汉字以内。',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO 描述',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: '搜索引擎结果里的摘要，建议 80 个汉字以内。',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'shareCover',
      title: '分享封面',
      type: 'image',
      group: 'seo',
      description: '微信 / Twitter 等分享卡片用的图，建议 1200×630。',
      options: { hotspot: true, accept: 'image/*' },
    }),

    // ═══ 页脚与联系 ═══
    defineField({
      name: 'footerText',
      title: '页脚内容',
      type: 'text',
      rows: 3,
      group: 'footer',
      description: '页脚显示的文字，例如版权行。',
    }),
    defineField({
      name: 'contact',
      title: '联系方式',
      type: 'object',
      group: 'footer',
      description: '全站联系入口的统一来源。',
      fields: [
        defineField({ name: 'email', title: '邮箱', type: 'string', validation: (Rule) => Rule.email() }),
        defineField({ name: 'phone', title: '电话（显示）', type: 'string' }),
        defineField({ name: 'phoneTel', title: '电话（拨号链接）', type: 'string', description: 'tel: 用的纯数字格式，例如 +8615087322631' }),
        defineField({ name: 'wechat', title: '微信号', type: 'string' }),
      ],
    }),
    defineField({
      name: 'social',
      title: '社交链接',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({ name: 'platform', title: '平台名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: '链接地址', type: 'url', validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }) }),
            defineField({ name: 'note', title: '备注', type: 'string' }),
          ],
          preview: {
            select: { platform: 'platform', url: 'url' },
            prepare({ platform, url }) {
              return { title: platform || '（未命名平台）', subtitle: url }
            },
          },
        }),
      ],
    }),

    // ═══ 背景音乐 ═══
    defineField({
      name: 'backgroundMusic',
      title: '背景音乐',
      type: 'object',
      group: 'music',
      description:
        '⚠️ 不自动播放：浏览器禁止未经用户许可的有声播放。用户可在右下角按钮主动开启，选择会被记住。',
      fields: [
        defineField({
          name: 'enabled',
          title: '是否启用',
          type: 'boolean',
          description: '开启后前台右下角出现音乐按钮。',
          initialValue: false,
        }),
        defineField({
          name: 'name',
          title: '音乐名称',
          type: 'string',
          description: '显示在音乐按钮旁，例如：Ambient Loop 01。',
        }),
        defineField({
          name: 'audioFile',
          title: '音频文件',
          type: 'file',
          description: '上传到 Sanity。受资产额度限制，大文件建议用地址。',
          options: { accept: 'audio/*' },
        }),
        defineField({
          name: 'audioUrl',
          title: '音频地址',
          type: 'url',
          description: '外链音频地址。与「音频文件」二选一即可。',
        }),
        defineField({
          name: 'loop',
          title: '是否循环',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'volume',
          title: '默认音量',
          type: 'number',
          description: '0 到 1 之间，例如 0.35。',
          initialValue: 0.35,
          validation: (Rule) => Rule.min(0).max(1),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value?.enabled && !value?.audioFile && !value?.audioUrl) {
            return '启用了背景音乐，必须提供音频文件或音频地址'
          }
          return true
        }),
    }),
  ],
  preview: {
    prepare() {
      return { title: '网站全局设置', subtitle: '全站唯一的一份全局配置' }
    },
  },
})
