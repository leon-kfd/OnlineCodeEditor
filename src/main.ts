import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import '@/assets/base.css'
import { ResizeDirective } from '@howdyjs/resize'
import { SizeObserverDirective } from '@howdyjs/size-observer'

const app = createApp(App).use(store).use(ResizeDirective).use(SizeObserverDirective)
app.mount('#app')
