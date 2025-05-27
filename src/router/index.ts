import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: () => import('../views/Home/index.vue'),
//   },
// ]

const modules: any = import.meta.glob('./modules/*.ts', {
  eager: true,
})

const routes: Array<RouteRecordRaw> = []
Object.keys(modules).forEach((key) => {
  console.log('module', modules[key])
  const module = modules[key].default
  routes.push(module)
})
console.log('routes', routes)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
