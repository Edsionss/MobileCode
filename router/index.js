const staticRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  }
]
export default staticRoutes
