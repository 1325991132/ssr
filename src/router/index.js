// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('@/components/index.vue') },
      { path: '/detail', component: () => import('@/components/detail.vue') }
    ]
  })
}