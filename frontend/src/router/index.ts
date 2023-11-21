import { createRouter, createWebHistory } from 'vue-router'
import ScheduleView from '@/views/ScheduleView.vue'
import StandingsViews from '@/views/StandingsViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Schedule',
      component: ScheduleView
    },
    {
      path: '/standings',
      name: 'Standings',
      component: StandingsViews
    }
  ]
})

export default router
