import Vue from 'vue'
import Vuex from 'vuex'
import { getServers, saveServer, addServer, deleteServer, getServerSortList, saveServerSortList } from '@/api/service/servers'
import { setServerStatus, getCloseList } from '@/api/service/closeStatus'
import { Message, MessageBox } from 'element-ui'
import { defaultServerOption } from '../server/commonUtils/options'
import cloneDeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    servers: [],
    closeList: [],
    currentServer: '',
    currentServerIsAdd: false,
    currentServerTabList: [],
    currentServerDraftList: {},
    serverSortList: []
  },
  mutations: {
    SET_DRAFT_ID_LIST (state, val) {
      Vue.set(state, 'currentServerTabList', val)
    },
    REMOVE_DRAFT_ID (state, id) {
      const result = state.currentServerTabList.find(item => item.id === id)
      if (result) {
        state.currentServerTabList.splice(state.currentServerTabList.indexOf(result), 1)
      }
    },
    ADD_DRAFT_ID (state, id) {
      if (!state.currentServerTabList.find(item => item.id === id)) {
        state.currentServerTabList.push({ id })
      }
    },
    ADD_DRAFT_CONTENT (state, { id, val }) {
      Vue.set(state.currentServerDraftList, id, val)
    },
    REMOVE_DRAFT_CONTENT (state, id) {
      delete state.currentServerDraftList[id]
    },
    EDIT_DRAFT_CONTENT (state, { id, val }) {
      Vue.set(state.currentServerDraftList, id, val)
    },
    SET_DRAFT_EDITED (state, id) {
      const result = state.currentServerTabList.find(item => item.id === id)
      if (result) {
        Vue.set(result, 'edited', true)
      }
    },
    SET_CURRENT_SERVER_IS_ADD (state, val) {
      state.currentServerIsAdd = val
    },
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
      state.currentServer = id
      for (const server of state.servers) {
        if (server.id === id) {
          if (!state.currentServerTabList.find(item => item.id === id)) {
            state.currentServerTabList.push({ id })
            Vue.set(state.currentServerDraftList, id, cloneDeep(server))
          }
          break
        }
      }
    },
    SET_CURRENT_SERVER_BY_OBJECT (state, server) {
      if (!state.currentServerTabList.find(item => item.id === server.id)) {
        state.currentServerTabList.push({ id: server.id })
        Vue.set(state.currentServerDraftList, server.id, cloneDeep(server))
      }
      state.currentServer = server.id
    },
    CLEAR_CURRENT_SERVER (state) {
      state.currentServer = ''
    },
    DELETE_SERVER_SORT_ITEM (state, id) {
      const traverseDelete = (children) => {
        for (const childIndex in children) {
          const child = children[childIndex]
          if (child.id === id) {
            children.splice(childIndex, 1)
            return true
          } else if (child.isDir) {
            const result = traverseDelete(child.children || [])
            if (result) {
              return true
            }
          }
        }
      }
      traverseDelete(state.serverSortList)
    }
  },
  actions: {
    setDraftIdList ({ commit }, val) {
      commit('SET_DRAFT_ID_LIST', val)
    },
    editDraftContent ({ commit }, val) {
      commit('EDIT_DRAFT_CONTENT', val)
    },
    addDraftId ({ commit }, id) {
      commit('ADD_DRAFT_ID', id)
    },
    addDraftContent ({ commit }, val) {
      commit('ADD_DRAFT_CONTENT', val)
    },
    removeDraftContent ({ commit }, val) {
      commit('REMOVE_DRAFT_CONTENT', val)
    },
    removeDraft ({ commit, state, dispatch }, id) {
      commit('REMOVE_DRAFT_ID', id)
      commit('REMOVE_DRAFT_CONTENT', id)
      if (state.currentServer === id) {
        commit('CLEAR_CURRENT_SERVER')
        if (state.currentServerTabList && state.currentServerTabList.length) {
          dispatch('setActiveServer', state.currentServerTabList[state.currentServerTabList.length - 1])
        }
      }
    },
    setDraftEdited ({ commit }, id) {
      commit('SET_DRAFT_EDITED', id)
    },
    refreshServers ({ commit, dispatch, state }) {
      return getServers().then(res => {
        if (!res.result) {
          commit('SET_SERVERS', res.data)
          if (state.currentServer) {
            commit('SET_CURRENT_SERVER_BY_ID', state.currentServer)
          }
          // dispatch('refreshServerSortList')
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
    addTempServer ({ commit, dispatch }) {
      const tempServer = defaultServerOption()
      commit('ADD_DRAFT_CONTENT', { id: tempServer.id, val: tempServer })
      commit('ADD_DRAFT_ID', tempServer.id)
      console.log('tempServer.id', tempServer.id)
      dispatch('setActiveServer', tempServer.id)
    },
    setActiveServer ({ commit }, val) {
      console.log('id: ', val)
      commit('SET_CURRENT_SERVER_IS_ADD', false)
      if (typeof val === 'string') {
        commit('SET_CURRENT_SERVER_BY_ID', val)
      } else {
        console.log('id: ', val)
        commit('SET_CURRENT_SERVER_BY_OBJECT', val)
      }
    },
    setCurrentServerIsAdd ({ commit }) {
      commit('SET_CURRENT_SERVER_IS_ADD', true)
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
      await dispatch('refreshServerSortList')
    },
    async deleteServer ({ commit, dispatch, state }, id) {
      await deleteServer(id).then(res => {
        if (!res.result) {
          Message.success('Delete server successful.')
        }
      })
      commit('REMOVE_DRAFT_ID', id)
      commit('CLEAR_CURRENT_SERVER')
      await dispatch('refreshServers')
      await dispatch('refreshServerSortList')
      commit('REMOVE_DRAFT_CONTENT', id)
      if (state.currentServerTabList && state.currentServerTabList.length) {
        dispatch('setActiveServer', state.currentServerTabList[state.currentServerTabList.length - 1].id)
      }
    },
    deleteServerConfirm ({ commit, dispatch }, id) {
      MessageBox.confirm('Are you sure to delete this server config?', 'Confirm').then(() => {
        dispatch('deleteServer', id)
      })
    },
    async deleteFolder ({ commit, dispatch, state }, id) {
      const traverseFind = (children, _id) => {
        for (const child of children) {
          if (child.id === _id) {
            return child
          } else if (child.children) {
            const result = traverseFind(child.children, _id)
            if (result) {
              return result
            }
          }
        }
        return null
      }
      // 遍历寻找并写入sum
      const traverseFindServer = (children, sum) => {
        for (const child of children) {
          if (child.isDir) {
            traverseFindServer(child.children || [], sum)
          } else {
            sum.push(child.id)
          }
        }
      }
      if (id) {
        // 先找在sort中到folder
        const sortFolder = traverseFind(state.serverSortList, id)
        if (sortFolder) {
          const serverList = []
          traverseFindServer(sortFolder.children, serverList)
          // serverList就是所有需要删除的项
          for (const serverId of serverList) {
            await dispatch('deleteServer', serverId)
          }
          commit('DELETE_SERVER_SORT_ITEM', id)
          await saveServerSortList({
            list: state.serverSortList
          })
        }
      }
      // await deleteServer(id).then(res => {
      //   if (!res.result) {
      //     Message.success('Delete server successful.')
      //   }
      // })
      // await dispatch('refreshServers')
      // await dispatch('refreshServerSortList')
      // commit('CLEAR_CURRENT_SERVER')
    },
    deleteFolderConfirm ({ commit, dispatch }, id) {
      MessageBox.confirm('Are you sure to delete this folder?', 'Confirm').then(() => {
        dispatch('deleteFolder', id)
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
    },
    getCurrentServerIsAdd (state) {
      return state.currentServerIsAdd
    },
    getCurrentServerDraft (state) {
      return {
        draftList: state.currentServerDraftList,
        tabList: state.currentServerTabList
      }
    },
    getCurrentServerDraftList (state) {
      return state.currentServerDraftList
    },
    getDraftEditedList (state) {
      const result = []
      console.log('get draft edited list')
      for (const item of state.currentServerTabList) {
        const draft = state.currentServerDraftList[item.id]
        let server = state.servers.find(val => val.id === item.id)
        if (server) {
          // console.log({ ...draft, id: '' }, { ...server, id: '' })
          if (!isEqual(draft, server)) {
            result.push(item.id)
          }
        } else {
          server = defaultServerOption()
          console.log({ ...draft, id: '', name: '' }, { ...server, id: '', name: '' })
          if (!isEqual({ ...draft, id: '', name: '' }, { ...server, id: '', name: '' })) {
            result.push(item.id)
          }
        }
      }
      return result
    }
  }
})
