import { getConfig, setConfig } from '@/api/config'
import { reload } from '@/api/reload'
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
    SET_CONFIG (state, config) {
      console.log(state)
      state.config = config
    },
    SET_SERVER (state, server) {
      const index = state.config.findIndex(item => item.id === server.id)
      state.config[index] = server
    }
  },
  actions: {
    async saveConfig ({ state, dispatch }, { type, id, isReload = true, isSave = true }) {
      if (isSave) {
        await setConfig(state.config)
      }
      if (isReload) {
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
        sum[cur.id] = cur
        return sum
      }, {})
    }
  }
}
