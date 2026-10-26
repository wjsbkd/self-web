import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // 全局忽略：构建产物 / 本地快照 / 工具运行时 / 一次性探针脚本。
  // ESLint 9 flat config 要求全局 ignores 是独立对象，不能与 files/rules 写在一起。
  // 注意：src/ 与 public/ 一律不忽略——那是真正要检查的源码。
  {
    ignores: [
      '**/node_modules/**',
      'dist/**',           // vite build 产物
      'backups/**',        // 重构前的手工代码快照（.gitignore 已排除，不入库）
      '.sanity/**',        // Sanity Studio 本地构建产物
      '.vtest/**',         // 视频 seek 测试脚本
      '.ego/**',           // ego 浏览器自动化脚本
      '.research-tmp/**',  // 托管平台调研抓取的中间产物
      '.deploy-tmp/**',
      '**/*.min.js',
    ],
  },
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',          // Vite + React 17+ 不需要 import React
      'react/prop-types': 'off',                  // 暂不强制 prop-types
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    // 一次性脚本与构建工具：Node 环境，不套 React 规则
    files: ['scripts/**/*.{js,mjs}', '*.config.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    // public/ 下是原样拷贝给浏览器的脚本（如 public/scrolly/scrolly.js），
    // 走 <script> 直挂、非模块，按浏览器全局跑，且允许 console。
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: { ...globals.browser },
    },
    rules: {
      'no-console': 'off',
    },
  },
]