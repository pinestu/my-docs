# 快速开始

本站点使用 [VitePress](https://vitepress.dev) 构建，本页介绍本地开发、构建与部署的完整流程。

## 环境要求

- **Node.js** 20 及以上
- **npm** 包管理器

::: tip 检查版本
```bash
node -v   # v20.0.0+
npm -v
```
:::

## 本地开发

克隆仓库并安装依赖：

```bash
git clone https://github.com/pinestu/my-docs.git
cd my-docs
npm install
```

启动本地开发服务器（默认端口 5173，支持热更新）：

```bash
npm run docs:dev
```

## 构建与预览

```bash
# 生产构建（输出到 docs/.vitepress/dist）
npm run docs:build

# 本地预览构建产物
npm run docs:preview
```

## 目录结构

```
my-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.js          # 站点配置（标题、导航、侧边栏等）
│   │   └── theme/             # 自定义主题
│   │       ├── index.js
│   │       └── custom.css     # 自定义样式（品牌色、排版等）
│   ├── public/
│   │   ├── logo.svg           # 站点 Logo
│   │   └── CNAME              # 自定义域名占位文件
│   ├── index.md               # 首页
│   ├── guide/                 # 指南
│   ├── markdown-examples.md   # Markdown 示例
│   └── api-examples.md        # API 示例
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages 自动部署
└── package.json
```

## 部署到 GitHub Pages

站点通过 GitHub Actions 自动部署：

1. 代码推送到 `main` 分支
2. 工作流自动安装依赖并执行 `npm run docs:build`
3. 构建产物上传至 GitHub Pages

::: warning 关于 base 路径
未绑定自定义域名时，站点部署在 `/my-docs/` 子路径，构建时会自动使用对应的 base。
将 `docs/public/CNAME` 替换为你的真实域名后，工作流自动切换为根路径 `/`，无需修改任何代码。
:::

## 添加新页面

在 `docs/` 下创建 `.md` 文件即可，例如新建 `docs/about.md`：

```md
# 关于本站

这里是关于本站的介绍。
```

然后在 `docs/.vitepress/config.js` 的 `nav` 和 `sidebar` 中添加链接。
