import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/base.css'
import resizeDirective from 'howdyjs/lib/resize'
import sizeObserverDirective from 'howdyjs/lib/size-observer'

const app = createApp(App).use(store).use(router).use(resizeDirective).use(sizeObserverDirective)
app.mount('#app')
