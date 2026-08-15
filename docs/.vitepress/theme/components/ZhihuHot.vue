<template>
  <div class="gh-card hot-card">
    <div class="gh-card-head">
      <svg class="octicon hot-icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M8.33 0h-.16c-2.19 0-3.47 1.12-3.47 2.9 0 1.2.34 1.91.76 2.61-.92.4-2.31 1.39-2.99 3.14-.8 2.08-.4 5.63 2.26 6.75 3.7 1.55 7.46-1.01 7.46-4.68 0-2.13-1.17-4.34-2.87-5.32.04-.88.17-2.02.72-2.83.31-.46.6-.85.82-1.37.22-.53.47-1.22.47-1.94C10.83.78 9.79 0 8.33 0Zm.07 4.53c-.33-.28-.63-.69-.63-1.27 0-.83.46-1.5 1.05-1.76.4.91.27 2.03-.42 3.03ZM5.44 14.72c-.38.23-.85-.1-.85-.44 0-.19.12-.36.27-.47 1.14-.83 2.5-1.44 3.38-2.66.2.37.1 1.02-.21 1.36-.77.83-1.53 1.59-2.59 2.21Z"/>
      </svg>
      <span class="hitokoto-title">知乎热榜</span>
      <span class="hitokoto-sub">Zhihu Hot · 公开 API 聚合 · 每 6 小时自动更新</span>
      <button v-if="items.length" class="gh-btn gh-btn-sm hot-refresh" type="button" @click="load" :disabled="loading">
        {{ loading ? '更新中…' : '刷新' }}
      </button>
    </div>

    <div v-if="loading && !items.length" class="hot-skeleton">
      <div v-for="i in 8" :key="i" class="hot-skeleton-row">
        <span class="gh-skeleton gh-skeleton-badge"></span>
        <span class="gh-skeleton" :style="{ width: (55 + (i * 7) % 40) + '%' }"></span>
      </div>
    </div>

    <div v-else-if="failed && !items.length" class="hot-error">
      <p>热榜数据暂时无法获取，请稍后刷新重试。</p>
      <button class="gh-btn" type="button" @click="load">重新加载</button>
    </div>

    <ol v-else class="hot-list">
      <li v-for="item in items" :key="item.rank" class="hot-item">
        <span class="hot-rank" :class="'hot-rank-' + item.rank">{{ item.rank }}</span>
        <div class="hot-main">
          <a class="hot-title" :href="item.url" target="_blank" rel="noopener" :title="item.title">{{ item.title }}</a>
          <p v-if="item.excerpt" class="hot-excerpt">{{ item.excerpt }}</p>
        </div>
        <span v-if="item.hot" class="hot-heat">
          <svg class="octicon" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path fill="currentColor" d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a2.5 2.5 0 0 0-1.663 2.027A2.99 2.99 0 0 0 4 13a2.99 2.99 0 0 0 .148 3h7.704A2.99 2.99 0 0 0 12 13c0-.662-.235-1.279-.644-1.736-.223-.294-.455-.63-.573-1.025-.105-.358-.085-.75.114-1.053.093-.14.213-.257.317-.38.363-.43.786-1.04.786-1.556C12 3.19 10.363 1.5 8 1.5ZM8 0c3.09 0 6 2.053 6 5.25 0 1.169-.533 2.15-1.132 2.846-.446.522-1.031 1.12-1.283 2.024-.3.845.198 1.785.605 2.27A3.99 3.99 0 0 1 12 13c0 1.657-1.343 3-3 3H7c-1.657 0-3-1.343-3-3 0-.963.354-1.842.944-2.518.549-.63 1.114-1.328 1.114-2.232 0-.833-.4-1.526-.776-2.063-.158-.226-.319-.447-.472-.665C4.18 6.131 3.5 5.22 3.5 3.75 3.5 1.657 5.49 0 8 0Z"/>
          </svg>
          {{ item.hot }}
        </span>
      </li>
    </ol>

    <p class="hot-footer">
      <span v-if="updatedAtCn">数据更新于 {{ updatedAtCn }}</span>
      <span>来源：知乎热榜（经由 RSSHub 公开聚合接口抓取，每 6 小时由 GitHub Actions 自动刷新）</span>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const loading = ref(false)
const failed = ref(false)
const updatedAtCn = ref('')

const BASE = import.meta.env.BASE_URL

async function load() {
  loading.value = true
  try {
    // 同源静态 JSON：由 GitHub Actions 定时从公开 API 抓取生成（无 CORS 问题）
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(BASE + 'hotlist/zhihu.json', { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    if (data && Array.isArray(data.items) && data.items.length) {
      items.value = data.items.slice(0, 10)
      updatedAtCn.value = data.updatedAtCn || ''
      failed.value = false
    } else {
      throw new Error('empty data')
    }
  } catch (e) {
    failed.value = true
  }
  loading.value = false
}

onMounted(load)
</script>
