# 从零搭建 VitePress 文档站并部署到 GitHub Pages（完整人工教程）

> 本教程完整记录本站点的搭建过程，所有步骤均可在**命令行 + 浏览器**中独立完成，无需借助任何 AI 工具。跟着做，你将拥有一个：自动构建、自动部署、支持自定义域名的免费文档站。

---

## 0. 前置准备

开始前请确认以下环境（终端中逐一验证）：

| 工具 | 用途 | 验证命令 | 最低版本 |
| --- | --- | --- | --- |
| Node.js | 运行构建工具 | `node -v` | v20.0.0 |
| npm | 包管理器 | `npm -v` | 9.x |
| Git | 版本控制 | `git --version` | 2.x |
| GitHub 账号 | 托管仓库 | 浏览器打开 [github.com](https://github.com) 注册/登录 | — |

安装方式：

- **Node.js**：前往 [nodejs.org](https://nodejs.org) 下载 LTS 版本安装包，一路下一步即可（Windows/macOS）；Linux 建议用 nvm 安装
- **Git**：Windows 安装 [Git for Windows](https://git-scm.com/downloads)；macOS 执行 `brew install git`；Linux 用系统包管理器（`apt install git`）

::: warning 版本检查
`node -v` 输出必须 ≥ v20。若版本过低，请先升级 Node.js 再继续，否则 VitePress 无法正常运行。
:::

---

## 1. 创建项目并安装 VitePress

### 1.1 创建项目目录

```bash
mkdir -p my-docs && cd my-docs
```

### 1.2 初始化 package.json

```bash
npm init -y
```

::: danger 关键一步：设置模块类型为 ESM
**必须执行下面这条命令**，否则构建会报错：

```bash
npm pkg set type=module
```

**原因**：VitePress 是 ESM-only 包（只能被 `import` 加载）。`npm init -y` 默认生成 `"type": "commonjs"`，会导致 `vitepress build` 报错 `"vitepress" resolved to an ESM file...`。此命令把 package.json 的 `type` 改为 `module`。
:::

### 1.3 安装 VitePress

```bash
npm add -D vitepress
```

### 1.4 创建文档目录结构

```bash
mkdir -p docs docs/.vitepress docs/public
```

---

## 2. 编写站点内容

### 2.1 首页 `docs/index.md`

写入以下内容（`cat > 文件 << 'EOF'` 可直接粘贴）：

```md
---
layout: home

hero:
  name: "我的文档"
  text: "现代化文档站点"
  tagline: 基于 VitePress 构建，提交即自动部署到 GitHub Pages
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: Markdown 示例
      link: /markdown-examples

features:
  - icon: 🚀
    title: 秒级构建
    details: 基于 Vite 的极速构建体验，Markdown 即代码。
  - icon: 🤖
    title: 自动部署
    details: GitHub Actions 监听 main 分支，推送即自动发布。
  - icon: 🌐
    title: 自定义域名
    details: 预留根路径绑定能力，随时切换自有域名。
---
```

### 2.2 示例页

`docs/markdown-examples.md`：

```md
# Markdown 示例

这里展示 Markdown 常用语法。
```

`docs/api-examples.md`：

```md
# API 示例

这里展示代码示例。
```

### 2.3 站点配置 `docs/.vitepress/config.js`

这是全站最重要的配置文件。**注意 base 的处理方式**（详见第 8 节踩坑说明）：

```js
import { defineConfig } from 'vitepress'

// 动态 base：
//   1. 构建时传入 VITEPRESS_BASE 环境变量则使用它（GitHub Actions 自动计算）
//   2. 本地默认 '/my-docs/'（与 GitHub Pages 子路径一致）
//   3. 绑定自定义域名后，Actions 自动传 '/'
const base = process.env.VITEPRESS_BASE || '/my-docs/'

export default defineConfig({
  lang: 'zh-CN',
  title: '我的文档站点',
  description: '基于 VitePress 的文档站点',
  base,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '示例', link: '/markdown-examples' },
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
  },
})
```

### 2.4 添加 npm scripts

```bash
npm pkg set scripts.docs:dev="vitepress dev docs" \
  scripts.docs:build="vitepress build docs" \
  scripts.docs:preview="vitepress preview docs"
```

### 2.5 本地预览与构建验证

```bash
# 启动本地开发服务器(热更新, 浏览器打开 http://localhost:5173)
npm run docs:dev

# 生产构建(输出到 docs/.vitepress/dist)
npm run docs:build
```

::: tip 验证
看到 `build complete in Xs` 即构建成功。这一步务必先通过，再进入部署环节。
:::

---

## 3. 初始化 Git 并提交代码

### 3.1 初始化仓库

```bash
git init -b main
```

### 3.2 配置身份（首次使用 Git 必需）

```bash
git config user.name "你的名字"
git config user.email "你的邮箱"
```

不配置会报错：`fatal: empty ident name ...`

### 3.3 编写 .gitignore

写入文件 `.gitignore`：

```
node_modules/
docs/.vitepress/cache/
docs/.vitepress/dist/
# VitePress 构建时可能在项目根目录生成缓存
.vitepress/cache/
```

::: warning 为什么最后一条也很重要
`vitepress build docs` 有时会在**项目根目录**生成 `.vitepress/cache/`（而非 docs 下），若不忽略会被误提交进仓库。
:::

### 3.4 首次提交

```bash
git add .
git commit -m "chore: init VitePress project"
```

---

## 4. 创建 GitHub 仓库并推送

### 方式 A：使用 gh CLI（推荐）

安装并登录 [GitHub CLI](https://cli.github.com)：

```bash
# Windows: winget install GitHub.cli / macOS: brew install gh
gh auth login   # 浏览器授权登录
```

创建公开仓库并推送：

```bash
gh repo create my-docs --public --source=. --remote=origin --push
```

### 方式 B：网页手动创建（不装 gh）

1. 浏览器打开 [github.com/new](https://github.com/new)，仓库名填 `my-docs`，选择 **Public**，**不要**勾选 README/.gitignore/license 等任何初始化选项，点击 Create repository
2. 回到终端执行：

```bash
git remote add origin https://github.com/你的用户名/my-docs.git
git push -u origin main
```

### 推送时的认证问题（HTTPS）

如果 push 提示 `could not read Username`，说明没有凭据。两种解决方式：

**方式 1：Personal Access Token（PAT）**
1. GitHub 网页 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token，勾选 `repo` 权限，生成形如 `ghp_xxxx` 的 token
2. 终端执行：

```bash
git config --global credential.helper store
git push -u origin main
# 用户名填 GitHub 用户名, 密码填 ghp_ 开头的 token
```

**方式 2：SSH 密钥（长期推荐）**

```bash
ssh-keygen -t ed25519 -C "你的邮箱"   # 一路回车
cat ~/.ssh/id_ed25519.pub            # 复制输出
```

GitHub 网页 → Settings → SSH and GPG keys → New SSH key，粘贴保存。然后：

```bash
git remote set-url origin git@github.com:你的用户名/my-docs.git
git push -u origin main
```

---

## 5. 配置 GitHub Actions 自动部署

### 5.1 创建工作流文件

```bash
mkdir -p .github/workflows
```

写入 `.github/workflows/deploy.yml`：

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Compute base path
        id: base
        run: |
          # CNAME 仍为占位符(未绑定域名) → GitHub Pages 子路径
          # CNAME 为真实域名 → 根路径
          if [ -f docs/public/CNAME ] && ! grep -q "docs.example.com" docs/public/CNAME; then
            echo "base=/" >> "$GITHUB_OUTPUT"
          else
            echo "base=/my-docs/" >> "$GITHUB_OUTPUT"
          fi
      - name: Install dependencies
        run: npm ci
      - name: Build with VitePress
        run: npm run docs:build
        env:
          VITEPRESS_BASE: ${{ steps.base.outputs.base }}
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 5.2 提交并推送

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment"
git push
```

推送后可在仓库 **Actions** 标签页看到工作流自动运行（橙色 = 进行中，绿色 ✓ = 成功）。

---

## 6. 启用 GitHub Pages

### 6.1 网页设置（必须手动操作）

仓库页面 → **Settings** → 左侧 **Pages** → 找到 **Build and deployment** → **Source** 下拉框选择 **"GitHub Actions"**（默认可能是 "Deploy from a branch"，务必切换）。

### 6.2 验证

等待 Actions 运行完成后，访问：

```
https://你的用户名.github.io/my-docs/
```

::: danger 最常见的失败：Setup Pages 步骤报错
若 Actions 在 **Setup Pages** 步骤失败，几乎都是因为**还没在 Settings → Pages 里把 Source 切换为 "GitHub Actions"**。切换后重新 push（或点 Actions 里的 Re-run jobs）即可。
:::

---

## 7. 绑定自定义域名（可选但推荐）

### 7.1 准备域名与 DNS

在域名服务商（阿里云/腾讯云/宝塔 DNS 等）添加解析记录：

**裸域（如 example.com）→ 4 条 A 记录：**

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**子域（如 docs.example.com）→ 1 条 CNAME 记录：**

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | docs | 你的用户名.github.io |

### 7.2 创建 CNAME 占位文件并推送

```bash
echo "docs.example.com" > docs/public/CNAME
git add docs/public/CNAME
git commit -m "chore: reserve CNAME for custom domain"
git push
```

### 7.3 设置 Custom domain

仓库 **Settings → Pages → Custom domain** 输入你的真实域名 → **Save** → 等待验证成功（绿色提示 `Your site is live at ...`）→ 勾选 **Enforce HTTPS**（证书自动签发，几分钟到 24 小时）。

::: warning 常见报错
保存域名时报 `InvalidDNSError`（DNS record could not be retrieved）= 该域名的 DNS 记录还没生效或写错，检查 DNS 是否已指向 GitHub Pages 的 IP/CNAME，等待生效后重试。
:::

### 7.4 更新 CNAME 为真实域名

```bash
echo "你的真实域名" > docs/public/CNAME
git add docs/public/CNAME
git commit -m "chore: bind custom domain"
git push
```

**为什么无需改代码？** 工作流中的 "Compute base path" 步骤检测到 CNAME 不再是占位符后，会自动以 `base: '/'`（根路径）构建，这就是本项目动态 base 的设计。

---

## 8. 踩坑清单（务必阅读）

| # | 现象 | 原因 | 解决 |
| --- | --- | --- | --- |
| 1 | 页面能打开但**完全没样式** | `base` 写死 `'/'`，而站点部署在 `/仓库名/` 子路径，CSS/JS 全部 404 | 使用本教程的动态 base 方案（第 2.3 / 5.1 节） |
| 2 | 构建报 `ESM file cannot be loaded by require` | package.json 是 `commonjs` 类型 | `npm pkg set type=module` |
| 3 | 仓库里混入 `.vitepress/cache` | 构建缓存在根目录生成 | .gitignore 增加 `.vitepress/cache/` |
| 4 | `git commit` 报 empty ident | 未配置 user.name/user.email | `git config user.name ...` |
| 5 | push 提示 `could not read Username` | 无凭据 | PAT 或 SSH 方式（第 4 节） |
| 6 | Actions 在 Setup Pages 失败 | 仓库 Pages 未启用或 Source 未选 GitHub Actions | Settings → Pages → Source 切换 |
| 7 | 保存域名报 InvalidDNSError | 域名 DNS 未生效 | 检查 DNS 记录后等待生效再保存 |
| 8 | 绑定域名后旧子路径样式丢失 | base 已切为根路径，属正常 | 直接使用新域名访问 |

---

## 9. 日常维护

- **新增页面**：在 `docs/` 下创建 `.md` 文件，并在 `config.js` 的 `nav`/`sidebar` 中添加链接
- **更新内容**：修改后 `git push`，Actions 自动构建部署，无需手动操作
- **本地预览**：`npm run docs:dev`（热更新）；`npm run docs:build && npm run docs:preview`（预览产物）

## 10. 最终架构一览

```
┌────────────┐   git push   ┌─────────────────┐   构建    ┌──────────────┐
│ 本地 my-docs │ ──────────► │ GitHub Actions   │ ────────► │ docs/        │
│ (Markdown)  │             │ (deploy.yml)     │           │ .vitepress/  │
└────────────┘             └─────────────────┘           │ dist/        │
                                                          └──────┬───────┘
                                                                 │ 上传产物
                                                          ┌──────▼───────┐
                                                          │ GitHub Pages │
                                                          │ (静态托管)    │
                                                          └──────┬───────┘
                                                                 │
                                                     ┌───────────▼───────────┐
                                                     │ https://www.你的域名/ │
                                                     └───────────────────────┘
```

至此，你已拥有一个免费、自动部署、可绑定自定义域名的文档站点。祝写作愉快！🎉
