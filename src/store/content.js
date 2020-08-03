import cloneDeep from 'lodash.clonedeep'
import { getId, defaultServerOption } from '../../server/commonUtils/options'

export default {
  state: {
    draft: [],
    currentDraft: null,
    unnamedDraft: new Set()
  },
  mutations: {
    ADD_DRAFT (state, draft) {
      state.draft.push(draft)
    },
    MODIFY_DRAFT (state, draft) {
      const { id } = draft
      const index = state.draft.findIndex(item => item.id === id)
      state.draft[index] = draft
      draft.modified = true
    },
    DELETE_DRAFT (state, id) {
      const draftIndex = state.draft.findIndex(draft => draft.id === id)
      if (draftIndex !== -1) {
        state.draft.splice(draftIndex, 1)
      }
    },
    SET_CURRENT_DRAFT (state, id) {
      state.currentDraft = id
    },
    SET_UNNAMED_DRAFT (state, id) {
      state.unnamedDraft.add(id)
    },
    DELETE_UNNAMED_DRAFT_FROM_LIST (state, id) {
      state.unnamedDraft.delete(id)
    },
    // 在删除当前active的tab时需要指定一个新的active
    RESET_CURRENT_DRAFT (state) {
      const currentDraft = state.draft.find(draft => draft.id === state.currentDraft)
      console.log(currentDraft, state.draft, state.currentDraft)
      if (!currentDraft) {
        if (state.draft.length) {
          state.currentDraft = state.draft[state.draft.length - 1].id
        } else {
          state.currentDraft = null
        }
      }
    }
  },
  actions: {
    deleteDraft ({ commit }, id) {
      commit('DELETE_DRAFT', id)
      console.log('deleteDraft')
      commit('RESET_CURRENT_DRAFT')
    },
    setCurrentDraft ({ commit, state, getters, rootState }, id) {
      console.log(getters)
      const serverItem = getters.getServerList.find(server => server.id === id)
      if (!state.draft.find(draft => draft.id === id) && serverItem) {
        commit('ADD_DRAFT', cloneDeep(serverItem))
      }
      commit('SET_CURRENT_DRAFT', id)
      // $router().push({
      //   path: '/server'
      // })
    },
    addNewDraft ({ commit, state }) {
      const id = getId('server-from-draft')
      const config = defaultServerOption({
        name: 'New Tab',
        id
      })
      commit('SET_UNNAMED_DRAFT', id)
      commit('ADD_DRAFT', config)
      commit('SET_CURRENT_DRAFT', id)
    },
    modifyDraft ({ commit, state }, draft) {
      commit('MODIFY_DRAFT', draft)
    }
  },
  getters: {
    getDraftList (state) {
      return state.draft
    },
    getCurrentDraftId (state) {
      return state.currentDraft
    },
    getCurrentDraft (state) {
      return state.draft.find(draft => draft.id === state.currentDraft)
    }
  }
}
