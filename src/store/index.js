import Vue from 'vue'
import Vuex from 'vuex'
import Menu from './menu'
import Config from './config'
import Content from './content'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: [
    Menu,
    Config,
    Content
  ]
})
