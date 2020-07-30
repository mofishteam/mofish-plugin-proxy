import { getConfig, setConfig } from '@/api/config'
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
    SAVE_CONFIG (state) {
      setConfig(state.config)
    },
    SET_CONFIG (state, config) {
      console.log(state)
      state.config = config
    }
  },
  actions: {
    setConfig ({ commit }, data) {
      commit('SET_CONFIG', data)
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
