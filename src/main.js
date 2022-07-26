import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入样式文件
import "@/assets/sass/index.scss"

createApp(App).use(store).use(router).mount('#app')
