import Vue from 'vue'
import Vuex from 'vuex'
import { getServers, saveServer, addServer, deleteServer } from '@/api/service/servers'
import { Message } from 'element-ui'

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
    },
    async saveServer ({ commit, state, dispatch }, val) {
      for (const server of state.servers) {
        if (server.id === val.id) {
          await saveServer(val).then(res => {
            if (!res.result) {
              Message.success('Save server successful.')
            }
          })
          dispatch('refreshServers')
          return
        }
      }
      await addServer(val).then(res => {
        if (!res.result) {
          Message.success('Add server successful.')
        }
      })
      dispatch('refreshServers')
    },
    async deleteServer ({ commit, dispatch }, id) {
      await deleteServer(id).then(res => {
        if (!res.result) {
          Message.success('Delete server successful.')
        }
      })
      dispatch('refreshServers')
      commit('CLEAR_CURRENT_SERVER')
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
