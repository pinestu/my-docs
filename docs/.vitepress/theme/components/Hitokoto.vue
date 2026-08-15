<template>
  <div class="hitokoto-card">
    <div class="hitokoto-head">
      <svg class="octicon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M2.75 1h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Zm0 5h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Zm0 5h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Zm0 5h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5Zm10-8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
      </svg>
      <span class="hitokoto-title">每日一言</span>
      <span class="hitokoto-sub">Hitokoto · 公开 API 实时获取</span>
      <button v-if="!loading" class="gh-btn gh-btn-sm hitokoto-refresh" type="button" @click="load">
        <svg class="octicon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path fill="currentColor" d="M1.705 8.005a6.285 6.285 0 0 1 10.716-4.516l1.442 1.442v-3.01a.75.75 0 0 1 1.5 0v4.865a.75.75 0 0 1-.75.75H9.747a.75.75 0 0 1 0-1.5h2.658l-1.28-1.28a4.785 4.785 0 1 0 .004 6.803.75.75 0 0 1 1.06 1.06 6.285 6.285 0 0 1-10.484-4.614Z"/>
        </svg>
        换一句
      </button>
    </div>

    <div v-if="loading" class="hitokoto-body">
      <div class="gh-skeleton" style="width: 78%"></div>
      <div class="gh-skeleton" style="width: 45%"></div>
    </div>

    <div v-else-if="failed" class="hitokoto-body hitokoto-error">
      <p class="hitokoto-quote">「道阻且长，行则将至；行而不辍，未来可期。」</p>
      <p class="hitokoto-from">—— 网络名言（接口暂不可用，点击重试）</p>
    </div>

    <blockquote v-else class="hitokoto-body">
      <p class="hitokoto-quote">「{{ data.hitokoto }}」</p>
      <p class="hitokoto-from">
        <span v-if="data.from_who">—— {{ data.from_who }}</span>
        <span v-if="data.from">《{{ data.from }}》</span>
        <span v-if="typeName" class="hitokoto-type">{{ typeName }}</span>
      </p>
    </blockquote>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const TYPE_NAMES = {
  a: '动画', b: '漫画', c: '游戏', d: '文学', e: '原创',
  f: '来自网络', g: '其他', h: '影视', i: '诗词', j: '网易云', k: '哲学', l: '抖机灵',
}

const data = ref(null)
const loading = ref(true)
const failed = ref(false)

const typeName = computed(() => (data.value && TYPE_NAMES[data.value.type]) || '')

async function load() {
  loading.value = true
  failed.value = false
  try {
    // 公开 API：Hitokoto 一言（文学/诗词/哲学/网易云/动画）
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch('https://v1.hitokoto.cn/?c=d&c=i&c=j&c=k&c=a&encode=json', { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    data.value = await res.json()
  } catch (e) {
    failed.value = true
  }
  loading.value = false
}

onMounted(load)
</script>
