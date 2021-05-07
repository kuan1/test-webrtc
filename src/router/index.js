import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/video/index.vue'),
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
    {
      name: 'test',
      path: '/test',
      component: () => import('@/views/test/index.vue'),
    },
  ],
})

export default router
