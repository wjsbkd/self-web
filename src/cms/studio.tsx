/**
 * Sanity Studio 配置（后台入口）
 *
 * 设计：
 * - 用 defineConfig 而非 sanity init 脚手架：把 Studio 收到项目内，不另起仓库。
 * - structure：中文分组，单例文档（siteSettings / resume）固定到侧栏顶部，
 *   作品 / 分类走列表视图（带排序）方便拖拽调整顺序。
 * - title / 分组名全部中文，符合需求第八节「字段名称使用清晰的中文说明」。
 * - 身份验证：靠 Sanity 的登录（project 的 auth 在 Sanity 后台配置），
 *   Studio 本身不存 token，只通过用户 session 读写。
 *
 * 注意：**本文件只被 admin.html / sanity.config.ts 引用，主站 bundle 不含它**，
 * 所以 Sanity Studio 代码不会拖慢前台。
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from '../sanity/schema'
import { sanityEnv } from '../sanity/env'

const SINGLETONS = ['siteSettings', 'resume']

/** 允许外部（根目录 sanity.config.ts）覆盖的连接参数 */
export interface StudioOverrides {
  projectId?: string
  dataset?: string
}

/** 单例文档列表（固定 _id，不出现「新增」按钮） */
function singletonListItem(S: any, typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

/**
 * 生成 Studio 配置。
 *
 * 为什么要工厂函数：同一条配置有两个运行环境，读环境变量的方式不同 ——
 *
 *   /admin 入口（本仓库 Vite 构建）        → import.meta.env.VITE_SANITY_*
 *   `npm run studio:deploy`（Sanity 构建）→ 只注入 SANITY_STUDIO_* 前缀
 *
 * 所以根目录 sanity.config.ts 把 CLI 环境读到的值作为 overrides 传进来，
 * 两边共用同一套 schema / structure，不复制配置。
 */
export function createStudioConfig(overrides: StudioOverrides = {}) {
  return defineConfig({
    name: 'lizongheng-portfolio',
    title: '李纵横 · 作品集后台',
    projectId: overrides.projectId || sanityEnv.projectId || 'placeholder',
    dataset: overrides.dataset || sanityEnv.dataset,
    plugins: [
      structureTool({
        structure: (S: any) =>
          S.list()
            .id('content')
            .title('内容管理')
            .items([
              // ── 单例：全局设置 / 履历 ──
              singletonListItem(S, 'siteSettings', '网站全局设置'),
              singletonListItem(S, 'resume', '个人履历'),

              S.divider(),

              // ── 作品（核心内容，带排序）──
              S.listItem()
                .id('projects')
                .title('作品')
                .schemaType('project')
                .child(
                  S.documentTypeList('project')
                    .id('projects')
                    .title('作品')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
                ),

              // ── 分类 ──
              S.listItem()
                .id('categories')
                .title('分类')
                .schemaType('category')
                .child(
                  S.documentTypeList('category')
                    .id('categories')
                    .title('分类')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }]),
                ),
            ]),
      }),
    ],
    schema: {
      types: schemaTypes,
    },
    document: {
      // 单例文档隐藏「新建」菜单里重复出现的项
      newDocumentOptions: (prev: any, { creationContext }: any) => {
        if (creationContext.type === 'global') {
          return prev.filter((t: any) => !SINGLETONS.includes(t.templateId))
        }
        return prev
      },
      actions: (prev: any, { schemaType }: any) => {
        if (SINGLETONS.includes(schemaType)) {
          return prev.filter(
            (a: any) =>
              a.action === 'publish' || a.action === 'discardChanges' || a.action === 'restore',
          )
        }
        return prev
      },
    },
  })
}

/** 默认导出：/admin 入口（admin.html → src/cms/main.tsx）直接用这个 */
export default createStudioConfig()
