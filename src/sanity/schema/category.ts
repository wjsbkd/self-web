/**
 * category —— 作品分类
 *
 * 独立成文档而不是 project 上的 string 字段，原因：
 * 1. 分类可以有自己的排序与展示名，前台做「按分类筛选」时直接引用；
 * 2. 改名时所有引用它的作品自动跟随，不会出现「作品里写的是旧名」。
 *
 * slug 同样是唯一地址（将来若做 /category/xxx 页面可直接用）。
 */
import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: '分类',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '分类名称',
      type: 'string',
      description: '例如：赛事宣发、活动策划、视觉设计。',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'slug',
      title: '唯一地址（slug）',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value?.current) return '必须填写 slug'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)) {
            return 'slug 只能包含小写字母、数字与短横线'
          }
          const client = context.getClient({ apiVersion: '2024-10-01' })
          const id = context.document?._id?.replace(/^drafts\./, '')
          const existing = await client.fetch(
            `count(*[_type == "category" && slug.current == $slug && _id != $id][0])`,
            { slug: value.current, id },
          )
          if (existing > 0) return `slug「${value.current}」已被其他分类占用`
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: '分类说明',
      type: 'text',
      rows: 2,
      description: '可选，用于后台列表里说明这个分类包含什么。',
    }),
    defineField({
      name: 'sortOrder',
      title: '展示顺序',
      type: 'number',
      description: '数字越小越靠前。',
      initialValue: 99,
      validation: (Rule) => Rule.integer().min(0).max(9999),
    }),
  ],
  orderings: [
    { title: '展示顺序（小→大）', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: '名称（A→Z）', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', sortOrder: 'sortOrder' },
    prepare({ title, sortOrder }) {
      return { title: title || '（未命名分类）', subtitle: `排序 ${sortOrder ?? '-'}` }
    },
  },
})
