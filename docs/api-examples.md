# API 示例

本页展示常见的代码示例，涵盖多种编程语言。

## TypeScript

```ts
function greet(name: string): string {
  return `你好，${name}！`
}

const users: string[] = ['张三', '李四', '王五']
users.forEach(user => console.log(greet(user)))
```

## JavaScript

```js
// 防抖函数
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

## Python

```python
from typing import List


def fibonacci(n: int) -> List[int]:
    """生成前 n 个斐波那契数"""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]


print(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Bash

```bash
#!/usr/bin/env bash
# 一键部署脚本
set -euo pipefail

npm run docs:build
git add -A
git commit -m "docs: update site" || true
git push origin main
echo "✅ 部署完成"
```

## JSON

```json
{
  "name": "my-docs",
  "version": "1.0.0",
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

## HTTP 请求

```http
GET /api/users?page=1&size=20 HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer <token>
```

## SQL

```sql
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id
HAVING order_count > 0
ORDER BY order_count DESC
LIMIT 10;
```
