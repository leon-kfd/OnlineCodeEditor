import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: process.env.ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory(process.env.BASE_URL),
  routes
})

export default router
