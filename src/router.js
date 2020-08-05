import Vue from 'vue'
import Router from 'vue-router'
import IndexView from '@/views/Index'
import ServerView from '@/views/Server'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: IndexView
  }, {
    path: '/server',
    name: 'server',
    component: ServerView
  }]
})
