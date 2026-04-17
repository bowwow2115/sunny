import type { MutationTree } from 'vuex'
import type { RootState } from '@/types'

const mutations: MutationTree<RootState> = {
  SET_LOADING(state, isLoading: boolean) {
    state.isLoading = isLoading
  },
  SET_ADMIN(state, isAdmin: boolean) {
    state.isAdmin = isAdmin
  },
  SET_USERID(state, userId: string) {
    state.userId = userId
  },
  RESET_STATE(state) {
    state.isLoading = false
    state.isAdmin = false
    state.userId = ''
  },
}

export default mutations
