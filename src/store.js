import Vue from 'vue'
import Vuex from 'vuex'
import { getServers, saveServer, addServer, deleteServer, getServerSortList, saveServerSortList } from '@/api/service/servers'
import { setServerStatus, getCloseList } from '@/api/service/closeStatus'
import { Message, MessageBox } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    closeList: [],
    currentServer: {},
    serverSortList: []
  },
  mutations: {
    SET_SERVERS (state, val) {
      state.servers = val
    },
    SET_CLOSE_LIST (state, val) {
      state.closeList = val
    },
    SET_SERVER_SORT_LIST (state, val) {
      state.serverSortList = val
    },
    APPEND_SERVER_SORT (state, val) {
      state.serverSortList.push(val)
    },
    PREPEND_SERVER_SORT (state, val) {
      state.serverSortList.unshift(val)
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
    },
    DELETE_SERVER_SORT_ITEM (state, id) {
      const traverseDelete = (children) => {
        if (children && children.length) {
          for (const childIndex in children) {
            const child = children[childIndex]
            if (child && child.id === id) {
              console.log(childIndex, child)
              children.splice(childIndex, 1)
              return
            } else if (child.children) {
              traverseDelete(child.children)
            }
          }
        }
      }
      traverseDelete(state.serverSortList)
      console.log(JSON.stringify(state.serverSortList, 2))
    }
  },
  actions: {
    refreshServers ({ commit, dispatch, state }) {
      return getServers().then(res => {
        if (!res.result) {
          commit('SET_SERVERS', res.data)
          if (state.currentServer && state.currentServer.id) {
            commit('SET_CURRENT_SERVER_BY_ID', state.currentServer.id)
          }
          dispatch('refreshServerSortList')
        }
      })
    },
    refreshCloseList ({ commit }) {
      return getCloseList().then(res => {
        if (!res.result) {
          commit('SET_CLOSE_LIST', res.data)
        }
      })
    },
    refreshServerSortList ({ commit }) {
      return getServerSortList().then(res => {
        if (!res.result) {
          commit('SET_SERVER_SORT_LIST', res.data)
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
    setServerStatus ({ dispatch, state }, id) {
      setServerStatus({ id, close: !state.closeList.includes(id) }).then(res => {
        if (!res.result) {
          dispatch('refreshCloseList')
        }
      })
    },
    appendServerSort ({ commit, state }, val) {
      commit('APPEND_SERVER_SORT', val)
      return saveServerSortList({
        list: state.serverSortList
      })
    },
    prependServerSort ({ commit, state }, val) {
      commit('PREPEND_SERVER_SORT', val)
      return saveServerSortList({
        list: state.serverSortList
      })
    },
    saveServerSortList ({ commit }, list) {
      commit('SET_SERVER_SORT_LIST', list)
      return saveServerSortList({
        list
      })
    },
    async saveServer ({ commit, state, dispatch }, val) {
      for (const server of state.servers) {
        if (server.id === val.id) {
          await saveServer(val).then(res => {
            if (!res.result) {
              Message.success('Save server successful.')
            }
          })
          await dispatch('refreshServers')
          // dispatch('refreshServerSortList')
          return
        }
      }
      await addServer(val).then(res => {
        if (!res.result) {
          Message.success('Add server successful.')
        }
      })
      await dispatch('refreshServers')
      dispatch('refreshServerSortList')
    },
    async deleteServerSortItem ({ commit, state }, id) {
      commit('DELETE_SERVER_SORT_ITEM', id)
      console.log(state.serverSortList.length)
    },
    async deleteServer ({ commit, dispatch, state }, id) {
      console.log('deleteServer')
      await deleteServer(id).then(res => {
        if (!res.result) {
          Message.success('Delete server successful.')
        }
      })
      await dispatch('deleteServerSortItem', id)
      dispatch('refreshServers')
      commit('CLEAR_CURRENT_SERVER')
    },
    deleteServerConfirm ({ commit, dispatch }, id) {
      MessageBox.confirm('Are you sure to delete this server config?', 'Confirm').then(() => {
        dispatch('deleteServer', id)
      })
    }
  },
  getters: {
    getServers (state) {
      return state.servers
    },
    getCurrentServer (state) {
      return state.currentServer
    },
    getCloseList (state) {
      return state.closeList
    },
    getServerSortList (state) {
      return state.serverSortList
    }
  }
})
