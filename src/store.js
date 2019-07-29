import Vue from 'vue'
import Vuex from 'vuex'
import { getServers } from '@/api/service/servers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    currentServer: {}
  },
  mutations: {
    SET_SERVERS (state, val) {
      state.servers = val
    },
    SET_CURRENT_SERVER_BY_ID (state, id) {
      for (const server of state.servers) {
        if (server.id === id) {
          state.currentServer = server
          break
        }
      }
    },
    SET_CURRENT_SERVER_BY_OBJECT (state, server) {
      state.currentServer = server
    },
    CLEAR_CURRENT_SERVER (state) {
      state.currentServer = {}
    }
  },
  actions: {
    refreshServers ({ commit }) {
      getServers().then(res => {
        if (!res.result) {
          commit('SET_SERVERS', res.data)
        }
      })
    },
    clearCurrentServer ({ commit }) {
      commit('CLEAR_CURRENT_SERVER')
    },
    setCurrentServer ({ commit }, val) {
      if (typeof val === 'string') {
        commit('SET_CURRENT_SERVER_BY_ID', val)
      } else {
        commit('SET_CURRENT_SERVER_BY_OBJECT', val)
      }
    }
  },
  getters: {
    getServers (state) {
      return state.servers
    },
    getCurrentServer (state) {
      return state.currentServer
    }
  }
})
