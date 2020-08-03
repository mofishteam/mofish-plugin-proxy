import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/assets/style/reset.scss'
import '@/assets/style/common.scss'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store/index'
import eventBus from './store/eventBus'
import Icon from '@/components/global/Icon'
import { sync } from 'vuex-router-sync'

Vue.use(ElementUI)
Vue.component('Icon', Icon)
Vue.prototype.$loading = ElementUI.Loading

Vue.prototype.$bus = eventBus

Vue.config.productionTip = false

sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
