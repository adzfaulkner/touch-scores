import { createRouter, createWebHistory } from 'vue-router'
import ApplicationView from '../views/ApplicationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'spa',
      component: ApplicationView
    }
  ]
})

export default router
