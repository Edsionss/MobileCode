//导入组件
import design from '@design/index.js'
import preview from '@preview/index.js'
const staticRoutes = [
  {
    path: '/',
    redirect: '/preview'
  },
  {
    path: '/design',
    name: 'design',
    component: design
  },
  {
    path: '/preview',
    name: 'preview',
    component: preview
  }
]
Vue.use(VueRouter)
const router = new VueRouter({
  routes: staticRoutes // (缩写) 相当于 routes: routes
})
export default router
