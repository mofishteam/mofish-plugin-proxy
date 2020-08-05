import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/assets/style/reset.scss'
import '@/assets/style/common.scss'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import router from './router'
import store from './store/index'
import eventBus from './store/eventBus'
import Icon from '@/components/global/Icon'
import Card from '@/components/global/Card'
import { sync } from 'vuex-router-sync'

Vue.use(ElementUI)
Vue.component('Icon', Icon)
Vue.component('Card', Card)
Vue.prototype.$loading = ElementUI.Loading

Vue.prototype.$bus = eventBus

Vue.config.productionTip = false

sync(store, router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
