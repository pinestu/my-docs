<template>
  <div class="gh-card">
    <div class="gh-card-head">
      <svg class="octicon gh-repo-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
      </svg>
      <a class="gh-repo-name" :href="repoUrl" target="_blank" rel="noopener">{{ repoFullName }}</a>
      <span class="gh-badge">{{ repoPublic ? 'Public' : 'Private' }}</span>
    </div>

    <p class="gh-repo-desc">
      {{ repoDesc || '基于 VitePress 构建的现代化文档站点，自动部署到 GitHub Pages' }}
    </p>

    <div class="gh-stats">
      <span class="gh-stat" title="Stars">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41Z"/>
        </svg>
        <b>{{ fmtNum(repo.stargazers_count) }}</b> Stars
      </span>
      <span class="gh-stat" title="Forks">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
        </svg>
        <b>{{ fmtNum(repo.forks_count) }}</b> Forks
      </span>
      <span class="gh-stat" title="Watchers">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
        </svg>
        <b>{{ fmtNum(repo.watchers_count) }}</b> Watchers
      </span>
      <span class="gh-stat" title="Open Issues">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
          <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
        </svg>
        <b>{{ fmtNum(repo.open_issues_count) }}</b> Issues
      </span>
      <span v-if="repo.language" class="gh-stat gh-stat-lang" title="主要语言">
        <span class="gh-lang-dot" :style="{ backgroundColor: langColor }"></span>
        {{ repo.language }}
      </span>
    </div>

    <div class="gh-actions">
      <a class="gh-btn gh-btn-primary" :href="repoUrl" target="_blank" rel="noopener">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
        </svg>
        GitHub 仓库
      </a>
      <a class="gh-btn" :href="starUrl" target="_blank" rel="noopener">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
        </svg>
        Star
      </a>
      <a class="gh-btn" :href="forkUrl" target="_blank" rel="noopener">
        <svg class="octicon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <path fill="currentColor" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
        </svg>
        Fork
      </a>
      <span v-if="repo.license" class="gh-license">{{ repo.license.spdx_id }}</span>
      <span v-if="repo.updated_at" class="gh-updated">更新于 {{ fmtDate(repo.updated_at) }}</span>
    </div>

    <div class="gh-badges">
      <a :href="repoUrl" target="_blank" rel="noopener">
        <img src="https://img.shields.io/github/stars/pinestu/my-docs?style=for-the-badge&logo=github&logoColor=white&color=4f6ef7" alt="GitHub stars" loading="lazy" />
      </a>
      <a :href="repoUrl + '/forks'" target="_blank" rel="noopener">
        <img src="https://img.shields.io/github/forks/pinestu/my-docs?style=for-the-badge&logo=github&logoColor=white&color=8b5cf6" alt="GitHub forks" loading="lazy" />
      </a>
      <a :href="repoUrl + '/issues'" target="_blank" rel="noopener">
        <img src="https://img.shields.io/github/issues/pinestu/my-docs?style=for-the-badge&logo=github&logoColor=white&color=ec4899" alt="GitHub issues" loading="lazy" />
      </a>
      <a href="https://github.com/pinestu/my-docs/actions" target="_blank" rel="noopener">
        <img src="https://img.shields.io/github/actions/workflow/status/pinestu/my-docs/deploy.yml?style=for-the-badge&label=Deploy&logo=githubactions&logoColor=white" alt="Deploy status" loading="lazy" />
      </a>
      <a :href="repoUrl + '/blob/main/docs/public/CNAME'" target="_blank" rel="noopener">
        <img src="https://img.shields.io/badge/custom%20domain-www.kekeily.top-2f4ad0?style=for-the-badge&logo=vercel&logoColor=white" alt="Custom domain" loading="lazy" />
      </a>
    </div>

    <div class="gh-chart">
      <div class="gh-chart-head">
        <span class="gh-chart-title">2026 年贡献日历</span>
        <a class="gh-chart-link" href="https://github.com/pinestu" target="_blank" rel="noopener">查看 pinestu 的 GitHub 主页 →</a>
      </div>
      <img v-if="!chartFailed" class="gh-chart-img" :src="chartSrc" alt="GitHub 贡献图" loading="lazy" @error="chartFailed = true" />
      <p v-else class="gh-chart-fallback">贡献图服务暂不可用</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const repo = ref({})
const chartFailed = ref(false)
const chartSrc = 'https://ghchart.rshah.org/pinestu'

const repoUrl = 'https://github.com/pinestu/my-docs'
const starUrl = repoUrl + '/stargazers'
const forkUrl = repoUrl + '/forks'
const repoFullName = computed(() => (repo.value.full_name ? repo.value.full_name : 'pinestu/my-docs'))
const repoDesc = computed(() => (repo.value.description || '').trim())
const repoPublic = computed(() => !repo.value.private)
const langColor = computed(() => {
  const m = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#41b883', HTML: '#e34c26',
    CSS: '#563d7c', MDX: '#fcb32c', SCSS: '#c6538c', Python: '#3572A5',
  }
  return m[repo.value.language] || '#8250df'
})

function fmtNum(n) {
  if (typeof n !== 'number') return '—'
  if (n >= 10000) return (n / 10000).toFixed(1) + 'k'
  return String(n)
}

function fmtDate(s) {
  if (!s) return ''
  const d = new Date(s)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  try {
    // 公开 API：GitHub REST API（CORS 开放，匿名限流 60 次/小时/IP）
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch('https://api.github.com/repos/pinestu/my-docs', { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    repo.value = await res.json()
  } catch (e) {
    // 接口失败时展示静态默认信息，不影响页面
  }
})
</script>
