import { getConfig, setConfig as saveConfig } from '@/api/config'
import { reload } from '@/api/reload'
import cloneDeep from 'lodash.clonedeep'
// import merge from 'lodash.merge'
// import md5 from 'md5'
// let count = 0
// const randomId = () => {
//   return md5(new Date().valueOf() + count++)
// }

export default {
  state: {
    config: []
  },
  mutations: {
    // 向磁盘保存config
    // SAVE_CONFIG (state) {
    //
    // },
    // 单重启SERVER
    // RELOAD_SERVER (state, { type, id }) {
    //
    // },
    ADD_SERVER (state, { server }) {
      const findServer = state.config.find(item => item && (item.id === server.id))
      if (!findServer) {
        state.config.push(cloneDeep(server))
      }
    },
    SET_CONFIG (state, config) {
      console.log(state)
      state.config = config
    },
    SET_SERVER (state, server) {
      const serverConfig = state.config.find(item => item.id === server.id)
      if (serverConfig) {
        const clonedServer = cloneDeep(server)
        for (const serverKey in clonedServer) {
          if (clonedServer.hasOwnProperty(serverKey)) {
            serverConfig[serverKey] = clonedServer[serverKey]
          }
        }
      }
    }
  },
  actions: {
    async saveConfig ({ state, dispatch, commit, getters }, { type, id, isReload = true, isSave = true }) {
      if (isSave && type) {
        switch (type) {
          case 'server':
            const serverDraft = getters.getDraftList.find(item => item.id === id)
            const server = getters.getIdOrderedServerList[id]
            if (!server) {
              await dispatch('addServer', { server: serverDraft })
            } else {
              await dispatch('setServer', serverDraft)
            }
            console.log('serverDraft', serverDraft)
            await saveConfig({
              id: serverDraft.id,
              name: type,
              change: serverDraft
            })
            break
          case 'config':
            await dispatch('setConfig', state.config)
            await saveConfig({
              name: type,
              change: state.config
            })
            break
        }
      }
      if (isReload && type && id) {
        await dispatch('reload', { type, id })
      }
    },
    async reload ({ state }, { type, id }) {
      return reload({
        name: type,
        id
      })
    },
    setConfig ({ commit }, data) {
      commit('SET_CONFIG', data)
    },
    setServer ({ commit }, data) {
      commit('SET_SERVER', data)
    },
    addServer ({ commit }, data) {
      commit('ADD_SERVER', data)
    },
    refreshConfig ({ commit }) {
      console.log('refreshConfig')
      getConfig().then(res => {
        console.log('getConfig', res)
        commit('SET_CONFIG', res.data)
      })
    }
  },
  getters: {
    getServerList (state) {
      return state.config
    },
    getIdOrderedServerList (state) {
      return state.config.reduce((sum, cur) => {
        if (cur) {
          sum[cur.id] = cur
        }
        return sum
      }, {})
    }
  }
}
