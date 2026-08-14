# Markdown 示例

VitePress 对 Markdown 提供了完整支持，本页展示常用语法。

## 语法高亮

```js
export default {
  name: 'MyComponent',
  data() {
    return { count: 0 }
  },
}
```

## 表格

| 语法 | 说明 | 示例 |
| :--- | :--- | :--- |
| `**加粗**` | 粗体 | **加粗** |
| `*斜体*` | 斜体 | *斜体* |
| `~~删除~~` | 删除线 | ~~删除~~ |
| `[链接](url)` | 链接 | [GitHub](https://github.com) |

## 任务列表

- [x] 安装 VitePress
- [x] 配置 GitHub Actions
- [x] 部署到 GitHub Pages
- [ ] 绑定自定义域名

## 自定义容器

::: tip 提示
这是一个提示容器。
:::

::: info 信息
这是一个信息容器。
:::

::: warning 警告
这是一个警告容器。
:::

::: danger 危险
这是一个危险容器。
:::

::: details 详情
点击展开查看详细内容。
:::

## 代码块组

::: code-group

```bash [npm]
npm create vitepress@latest
```

```bash [pnpm]
pnpm create vitepress@latest
```

:::

## 行内代码与高亮

行内代码 `const foo = 'bar'`，带语言标识的行内代码：

```ts{2,4}
interface User {
  id: number      // 高亮此行
  name: string
  email: string   // 高亮此行
}
```

## 图片

![VitePress Logo](/logo.svg)

## 引用

> 文档是软件的灵魂，好的文档让项目走得更远。
>
> —— 佚名

## 更多

完整的语法参考见 [VitePress Markdown 文档](https://vitepress.dev/zh/guide/markdown)。
