import type { ActionTree } from 'vuex'
import type { RootState } from '@/types'

const actions: ActionTree<RootState, RootState> = {
  setLoading({ commit }, isLoading: boolean) {
    commit('SET_LOADING', isLoading)
  },
  setAdmin({ commit }, isAdmin: boolean) {
    commit('SET_ADMIN', isAdmin)
  },
  setUserId({ commit }, userId: string) {
    commit('SET_USERID', userId)
  },
  resetState({ commit }) {
    commit('RESET_STATE')
  },
}

export default actions
