/**
 * resume —— 个人履历（单例文档，固定 _id）
 *
 * 单例模式：整个站点只有一份履历，用固定 _id 'resume' 保证
 * Studio 里不会出现「履历 1 / 履历 2」让人不知道该改哪个。
 * structure.ts 里用 singleton 插件语义（手写 document list 过滤）落地。
 *
 * 对应需求第四节：
 *   个人资料 profile：姓名 / 职位身份 / 头像 / 个人简介 / 所在地 /
 *                     邮箱 / 电话 / 社交平台链接 / 简历下载文件
 *   列表型内容（全部支持新增、编辑、删除、排序、草稿与发布）：
 *     experience   工作经历
 *     education    教育经历
 *     awards       获奖经历
 *     exhibitions  展览或活动
 *     services     服务能力
 *     skills       技能标签
 *     clients      合作品牌或客户
 *
 * 列表统一约定：
 * - 每项都有 sortOrder（数字排序）+ status（草稿/发布）
 * - GROQ 侧用 `items[status == "published"] | order(sortOrder asc)` 过滤并排序
 */
import { defineType, defineField, defineArrayMember } from 'sanity'

/** 社交链接对象（履历与全局设置共用同一结构） */
const socialLink = defineArrayMember({
  type: 'object',
  name: 'socialLink',
  title: '社交链接',
  fields: [
    defineField({
      name: 'platform',
      title: '平台名称',
      type: 'string',
      description: '例如：抖音 / 哔哩哔哩 / GitHub / LinkedIn / 小红书。',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: '链接地址',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'note',
      title: '备注',
      type: 'string',
      description: '可选，例如账号名。',
    }),
  ],
  preview: {
    select: { platform: 'platform', url: 'url' },
    prepare({ platform, url }) {
      return { title: platform || '（未命名平台）', subtitle: url }
    },
  },
})

export const resume = defineType({
  name: 'resume',
  title: '个人履历',
  type: 'document',
  // 单例语义由 structure.ts 的 singletonListItem 落地（固定 _id = 'resume'）
  groups: [
    { name: 'profile', title: '个人资料', default: true },
    { name: 'experience', title: '工作经历' },
    { name: 'education', title: '教育经历' },
    { name: 'awards', title: '获奖经历' },
    { name: 'exhibitions', title: '展览或活动' },
    { name: 'services', title: '服务能力' },
    { name: 'skills', title: '技能标签' },
    { name: 'clients', title: '合作品牌或客户' },
  ],
  fields: [
    // ═══ 个人资料 ═══
    defineField({
      name: 'name',
      title: '姓名',
      type: 'string',
      group: 'profile',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'role',
      title: '职位或身份',
      type: 'string',
      group: 'profile',
      description: '例如：AI 内容运营与视觉创作者。',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'avatar',
      title: '头像',
      type: 'image',
      group: 'profile',
      options: { hotspot: true, accept: 'image/*' },
    }),
    defineField({
      name: 'bio',
      title: '个人简介',
      type: 'text',
      rows: 5,
      group: 'profile',
      description: '一段式自我介绍，显示在「关于」板块。',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'location',
      title: '所在地',
      type: 'string',
      group: 'profile',
      description: '例如：长春 / 中国。',
    }),
    defineField({
      name: 'email',
      title: '邮箱',
      type: 'string',
      group: 'profile',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: '电话',
      type: 'string',
      group: 'profile',
      description: '显示用的号码，例如 150-8732-2631。',
    }),
    defineField({
      name: 'social',
      title: '社交平台链接',
      type: 'array',
      group: 'profile',
      of: [socialLink],
    }),
    defineField({
      name: 'resumeFile',
      title: '简历下载文件',
      type: 'file',
      group: 'profile',
      description: '上传 PDF，前台「下载简历」按钮指向它。',
      options: { accept: '.pdf' },
    }),

    // ═══ 工作经历 ═══
    defineField({
      name: 'experience',
      title: '工作经历',
      type: 'array',
      group: 'experience',
      description: '按 sortOrder 升序展示；「是否至今」开启时结束时间不填。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'experienceItem',
          title: '工作经历',
          fields: [
            defineField({ name: 'company', title: '公司或客户名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: '职位', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'startDate', title: '开始时间', type: 'string', description: '例如 2026.01', validation: (Rule) => Rule.required() }),
            defineField({ name: 'endDate', title: '结束时间', type: 'string', description: '例如 2026.03。开启「至今」时留空。', hidden: ({ parent }) => parent?.current }),
            defineField({
              name: 'current',
              title: '至今',
              type: 'boolean',
              description: '开启表示仍在职，前台显示「至今」。',
              initialValue: false,
            }),
            defineField({ name: 'description', title: '工作描述', type: 'text', rows: 4 }),
            defineField({
              name: 'points',
              title: '分点',
              type: 'array',
              description: '沿用简历的分点结构：小标题 + 描述。可留空。',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'point',
                  fields: [
                    defineField({ name: 'label', title: '小标题', type: 'string' }),
                    defineField({ name: 'text', title: '描述', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
                  ],
                  preview: {
                    select: { label: 'label', text: 'text' },
                    prepare({ label, text }) {
                      return { title: label || '（无小标题）', subtitle: text?.slice(0, 60) }
                    },
                  },
                }),
              ],
            }),
            defineField({
              name: 'tags',
              title: '标签',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              options: { layout: 'tags' },
            }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { company: 'company', role: 'role', startDate: 'startDate', endDate: 'endDate', current: 'current', status: 'status' },
            prepare({ company, role, startDate, endDate, current, status }) {
              const mark = status === 'published' ? '✅' : '📝'
              return {
                title: `${company || '（未命名）'} · ${role || ''}`,
                subtitle: `${mark} ${startDate || '?'} — ${current ? '至今' : endDate || '?'}`,
              }
            },
          },
        }),
      ],
    }),

    // ═══ 教育经历 ═══
    defineField({
      name: 'education',
      title: '教育经历',
      type: 'array',
      group: 'education',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'educationItem',
          fields: [
            defineField({ name: 'school', title: '学校名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'degree', title: '学位或身份', type: 'string', description: '例如：本科 / 记者团宣传部干事' }),
            defineField({ name: 'major', title: '专业', type: 'string' }),
            defineField({ name: 'startDate', title: '开始时间', type: 'string' }),
            defineField({ name: 'endDate', title: '结束时间', type: 'string' }),
            defineField({ name: 'description', title: '描述', type: 'text', rows: 3 }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { school: 'school', degree: 'degree', startDate: 'startDate', endDate: 'endDate', status: 'status' },
            prepare({ school, degree, startDate, endDate, status }) {
              const mark = status === 'published' ? '✅' : '📝'
              return { title: school || '（未命名学校）', subtitle: `${mark} ${degree || ''} · ${startDate || '?'} — ${endDate || '?'}` }
            },
          },
        }),
      ],
    }),

    // ═══ 获奖经历 ═══
    defineField({
      name: 'awards',
      title: '获奖经历',
      type: 'array',
      group: 'awards',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'awardItem',
          fields: [
            defineField({ name: 'title', title: '奖项名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'issuer', title: '颁发机构', type: 'string' }),
            defineField({ name: 'date', title: '时间', type: 'string' }),
            defineField({ name: 'description', title: '描述', type: 'text', rows: 3 }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title', issuer: 'issuer', date: 'date', status: 'status' },
            prepare({ title, issuer, date, status }) {
              return { title: title || '（未命名奖项）', subtitle: `${status === 'published' ? '✅' : '📝'} ${issuer || ''} ${date || ''}` }
            },
          },
        }),
      ],
    }),

    // ═══ 展览或活动 ═══
    defineField({
      name: 'exhibitions',
      title: '展览或活动',
      type: 'array',
      group: 'exhibitions',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'exhibitionItem',
          fields: [
            defineField({ name: 'title', title: '活动名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: '担任角色', type: 'string' }),
            defineField({ name: 'location', title: '地点', type: 'string' }),
            defineField({ name: 'date', title: '时间', type: 'string' }),
            defineField({ name: 'description', title: '描述', type: 'text', rows: 3 }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title', role: 'role', date: 'date', status: 'status' },
            prepare({ title, role, date, status }) {
              return { title: title || '（未命名活动）', subtitle: `${status === 'published' ? '✅' : '📝'} ${role || ''} ${date || ''}` }
            },
          },
        }),
      ],
    }),

    // ═══ 服务能力 ═══
    defineField({
      name: 'services',
      title: '服务能力',
      type: 'array',
      group: 'services',
      description: '你能提供的服务项，例如内容策划、视觉设计。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'serviceItem',
          fields: [
            defineField({ name: 'title', title: '服务名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: '服务描述', type: 'text', rows: 3 }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title', status: 'status' },
            prepare({ title, status }) {
              return { title: title || '（未命名服务）', subtitle: status === 'published' ? '✅ 已发布' : '📝 草稿' }
            },
          },
        }),
      ],
    }),

    // ═══ 技能标签 ═══
    defineField({
      name: 'skills',
      title: '技能标签',
      type: 'array',
      group: 'skills',
      description: '简短标签，例如剪映、DaVinci、Figma。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'skillItem',
          fields: [
            defineField({ name: 'name', title: '标签名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'level',
              title: '熟练度',
              type: 'string',
              options: {
                list: ['了解', '熟练', '精通'],
                layout: 'radio',
              },
            }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { name: 'name', level: 'level', status: 'status' },
            prepare({ name, level, status }) {
              return { title: name || '（未命名标签）', subtitle: `${status === 'published' ? '✅' : '📝'} ${level || ''}` }
            },
          },
        }),
      ],
    }),

    // ═══ 合作品牌或客户 ═══
    defineField({
      name: 'clients',
      title: '合作品牌或客户',
      type: 'array',
      group: 'clients',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clientItem',
          fields: [
            defineField({ name: 'name', title: '品牌或客户名称', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true, accept: 'image/*' } }),
            defineField({ name: 'url', title: '官网链接', type: 'url' }),
            defineField({ name: 'note', title: '合作内容', type: 'string' }),
            defineField({ name: 'sortOrder', title: '展示顺序', type: 'number', initialValue: 99, validation: (Rule) => Rule.integer().min(0) }),
            defineField({
              name: 'status',
              title: '发布状态',
              type: 'string',
              options: { list: ['draft', 'published'], layout: 'radio' },
              initialValue: 'published',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { name: 'name', logo: 'logo', status: 'status' },
            prepare({ name, logo, status }) {
              return { title: name || '（未命名品牌）', subtitle: status === 'published' ? '✅ 已发布' : '📝 草稿', media: logo }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: '个人履历', subtitle: '全站唯一的一份履历数据' }
    },
  },
})
