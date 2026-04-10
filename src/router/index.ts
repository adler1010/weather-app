import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/Weather'
      },
      {
        path: 'Weather',
        component: () => import('@/views/WeatherPage.vue')
      },
      {
        path: 'Pollination',
        component: () => import('@/views/PollinationPage.vue')
      },
      {
        path: 'Settings',
        component: () => import('@/views/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
