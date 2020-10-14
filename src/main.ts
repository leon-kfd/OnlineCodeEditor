import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/base.css'
import resizeDirective from 'howdyjs/lib/resize'
import sizeObserver from 'howdyjs/lib/size-observer'

const app = createApp(App).use(store).use(router)
app.directive('resize', {
  mounted: resizeDirective.inserted,
  unmounted: resizeDirective.unbind
})
app.directive('size-observer', {
  mounted: sizeObserver.inserted,
  unmounted: sizeObserver.unbind
})
app.mount('#app')
