import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '我的文档站点',
  description: '基于 VitePress 的文档站点',
  // base 设为 '/'：GitHub Pages 默认子路径访问时由 Actions 工作流设置 base；
  // 绑定自定义域名后无需修改代码，直接以根路径生效
  base: '/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'Markdown 示例', link: '/markdown-examples' },
      { text: 'API 示例', link: '/api-examples' },
    ],
    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: 'API 示例', link: '/api-examples' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
  },
})
