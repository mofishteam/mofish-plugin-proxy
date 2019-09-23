import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/assets/style/reset.scss'
import '@/assets/style/common.scss'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import ResizeBar from './directives/resizeBar'

Vue.use(ResizeBar)

Vue.use(ElementUI)
Vue.prototype.$loading = ElementUI.Loading

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
