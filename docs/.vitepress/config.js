import { defineConfig } from 'vitepress'

// ============================================================
// 动态 base 策略:
//   1. GitHub Actions 构建时传入 VITEPRESS_BASE:
//      - docs/public/CNAME 仍为占位符(docs.example.com) → '/my-docs/'
//        (GitHub Pages 默认子路径访问)
//      - CNAME 已替换为真实域名 → '/' (自定义域名根路径, 无需改代码)
//   2. 本地开发/预览默认 '/my-docs/' (与线上子路径一致)
// ============================================================
const base = process.env.VITEPRESS_BASE || '/my-docs/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '我的文档站点',
  description: '基于 VitePress 构建的现代化文档站点，自动部署到 GitHub Pages',
  base,

  head: [
    ['link', { rel: 'icon', href: base + 'logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#4f6ef7' }],
    ['meta', { name: 'keywords', content: 'VitePress, 文档, GitHub Pages' }],
  ],

  lastUpdated: true,
  cleanUrls: false,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '我的文档站点',
    outline: { label: '本页目录', level: [2, 3] },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到主要内容',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: 'API 示例', link: '/api-examples' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/pinestu/my-docs',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: 'Markdown 示例', link: '/markdown-examples' },
            { text: 'API 示例', link: '/api-examples' },
          ],
        },
      ],
      '/markdown-examples': [
        {
          text: '示例',
          items: [
            { text: 'Markdown 示例', link: '/markdown-examples' },
            { text: 'API 示例', link: '/api-examples' },
          ],
        },
      ],
      '/api-examples': [
        {
          text: '示例',
          items: [
            { text: 'Markdown 示例', link: '/markdown-examples' },
            { text: 'API 示例', link: '/api-examples' },
          ],
        },
      ],
    },

    footer: {
      message: '基于 VitePress 构建 · 自动部署到 GitHub Pages',
      copyright: 'Copyright © 2026 pinestu',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'full', timeStyle: 'short' },
    },

    editLink: {
      pattern: 'https://github.com/pinestu/my-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/pinestu/my-docs' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除查询',
            backButtonTitle: '关闭搜索',
            noResultsText: '未找到相关结果',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
  },
})
