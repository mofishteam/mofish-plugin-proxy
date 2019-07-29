import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ServerContent from './views/ServerContent/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: {
        name: 'server'
      },
      children: [{
        path: '/server',
        name: 'server',
        component: ServerContent
      }]
    }
  ]
})
