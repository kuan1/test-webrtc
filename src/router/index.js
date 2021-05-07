import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home/index.vue'),
    },
    {
      name: 'data',
      path: '/data',
      component: () => import('@/views/data/index.vue'),
    },
    {
      name: 'video',
      path: '/video',
      component: () => import('@/views/video/index.vue'),
    },
  ],
})

export default router
