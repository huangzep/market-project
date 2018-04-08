import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './map/' // 路由映射
import Store from '@/store/store'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
  	return { x: 0, y: 0 }
  }
})

// router.beforeEach((to, from, next) => {
// 	if (/vinfo|vapply|vrank/gi.test(to.path) && JSON.stringify(Store.state.voteInfo) === "{}") {
// 		next({path: '/vote/vhome', query: to.query})
// 	} else {
// 		next()
// 	}
// })

export default router
