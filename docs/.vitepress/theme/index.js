import DefaultTheme from 'vitepress/theme'
import Hitokoto from './components/Hitokoto.vue'
import GitHubRepo from './components/GitHubRepo.vue'
import ZhihuHot from './components/ZhihuHot.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Hitokoto', Hitokoto)
    app.component('GitHubRepo', GitHubRepo)
    app.component('ZhihuHot', ZhihuHot)
  },
}
