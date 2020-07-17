import { getMenu, setMenu } from '@/api/menu'
import md5 from 'md5'
let count = 0
const randomId = () => {
  return md5(new Date().valueOf() + count++)
}

export default {
  state: {
    menu: []
  },
  mutations: {
    // 向磁盘保存config
    SAVE_CONFIG (state) {
      setMenu(state.menu)
    },
    ADD_FOLDER (state, item) {
      state.menu.push(item)
      // commit('SAVE_CONFIG')
    },
    MODIFY_FOLDER (state, item) {},
    DELETE_FOLDER () {},
    ORDER_FOLDER () {},
    ADD_SERVER () {},
    MODIFY_SERVER () {},
    DELETE_SERVER () {},
    ORDER_SERVER () {},
    MOVE_SERVER () {},
    SET_CONFIG (state, config) {
      console.log(state)
      state.menu = config
    }
  },
  actions: {
    setMenu ({ commit }, menu) {
      commit('SET_CONFIG', menu)
    },
    refreshMenu ({ commit }) {
      getMenu().then(res => {
        if (res && res.length) {
          commit('SET_CONFIG', res)
        } else {
          const newMenu = [{
            name: 'Recently',
            id: randomId(),
            isFolder: true,
            canModify: false,
            children: []
          }, {
            id: randomId(),
            name: 'Default',
            isFolder: true,
            canModify: false,
            children: []
          }]
          commit('SET_CONFIG', newMenu)
          commit('SAVE_CONFIG', newMenu)
        }
      })
    }
  },
  getters: {
    getMenu (state) {
      return state.menu
    }
  }
}
