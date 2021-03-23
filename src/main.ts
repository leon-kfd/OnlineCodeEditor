import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/base.css'
import '@/assets/variable.scss'
import { ResizeDirective } from '@howdyjs/resize'
import { SizeObserverDirective } from '@howdyjs/size-observer'

const app = createApp(App).use(store).use(router).use(ResizeDirective).use(SizeObserverDirective)
app.mount('#app')
