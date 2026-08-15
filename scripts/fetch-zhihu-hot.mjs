// ============================================================
// 知乎热榜抓取脚本（在 GitHub Actions 构建前运行）
// 从多个公开 API 抓取知乎热榜，归一化后写入 docs/public/hotlist/zhihu.json
// 站点首页组件通过同源 fetch 加载该 JSON（无 CORS 问题，稳定可靠）
// 数据源按顺序尝试，任一成功即止：
//   1. RSSHub 实例 (XML)  —— 聚合知乎官方热榜
//   2. 52vmy 聚合 API (JSON)
// 全部失败时: 保留上次生成的 JSON（不覆盖），并输出警告
// ============================================================
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../docs/public/hotlist')
const OUT_FILE = path.join(OUT_DIR, 'zhihu.json')
const MAX_ITEMS = 12
const TIMEOUT_MS = 20000

const SOURCES = [
  { id: 'rsshub-slarker',  type: 'rss',  url: 'https://hub.slarker.me/zhihu/hot' },
  { id: 'rsshub-ktachibana', type: 'rss', url: 'https://rsshub.ktachibana.party/zhihu/hot' },
  { id: 'rsshub-app',      type: 'rss',  url: 'https://rsshub.app/zhihu/hot' },
  { id: '52vmy',           type: 'json', url: 'https://api.52vmy.cn/api/wl/zhihu' },
  { id: 'vkeys',           type: 'json', url: 'https://api.vkeys.cn/api/zhihu_hot' },
]

function stripTags(html) {
  // 先解实体再剥标签（RSSHub 的 description 中 HTML 标签以 &lt;xxx&gt; 形式存在）
  return String(html || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '\u201c')
    .replace(/&rdquo;/g, '\u201d')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchText(url) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; MyDocsBot/1.0; +https://www.kekeily.top)' },
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

function parseRss(xml) {
  const items = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = re.exec(xml)) !== null) {
    const block = m[1]
    const get = (tag) => {
      const mm = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'))
      return mm ? mm[1].trim() : ''
    }
    const title = stripTags(get('title'))
    const url = stripTags(get('link'))
    if (!title || !url) continue
    items.push({
      rank: items.length + 1,
      title,
      url,
      excerpt: stripTags(get('description')).slice(0, 90),
      publishedAt: stripTags(get('pubDate')),
    })
  }
  return items.slice(0, MAX_ITEMS)
}

function parseJsonList(text) {
  let obj
  try { obj = JSON.parse(text) } catch { return null }
  const list = Array.isArray(obj) ? obj : (Array.isArray(obj?.data) ? obj.data : null)
  if (!list) return null
  const items = []
  for (const it of list) {
    const title = it.title || it.name || it.question?.title
    const url = it.url || it.link || it.mobileUrl || (it.id ? 'https://www.zhihu.com/question/' + it.id : '')
    if (!title) continue
    let hot = it.hot || it.heat || it.hot_value || ''
    if (typeof hot === 'number') {
      hot = hot >= 10000 ? (hot / 10000).toFixed(1) + ' 万' : String(hot)
    }
    items.push({
      rank: items.length + 1,
      title: String(title).trim(),
      url: String(url).trim(),
      excerpt: stripTags(it.desc || it.excerpt || it.summary || '').slice(0, 90),
      hot: String(hot),
      publishedAt: '',
    })
  }
  return items.slice(0, MAX_ITEMS)
}

async function main() {
  let items = null
  let used = ''
  for (const src of SOURCES) {
    try {
      const text = await fetchText(src.url)
      const parsed = src.type === 'rss' ? parseRss(text) : parseJsonList(text)
      if (parsed && parsed.length > 0) {
        items = parsed
        used = src.id
        break
      }
      console.warn('[fetch-zhihu-hot] source ' + src.id + ' returned no items')
    } catch (e) {
      console.warn('[fetch-zhihu-hot] source ' + src.id + ' failed: ' + e.message)
    }
  }

  if (!items) {
    console.error('[fetch-zhihu-hot] ALL SOURCES FAILED, keeping previous zhihu.json')
    process.exit(1)
  }

  const payload = {
    source: used,
    updatedAt: new Date().toISOString(),
    updatedAtCn: new Date().toLocaleString('zh-CN', { hour12: false }),
    items,
  }
  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8')
  console.log('[fetch-zhihu-hot] OK: ' + used + ', ' + items.length + ' items -> ' + OUT_FILE)
}

main().catch((e) => {
  console.error('[fetch-zhihu-hot] fatal: ' + e.message)
  process.exit(1)
})
