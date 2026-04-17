import type { GetterTree } from 'vuex'
import type { RootState } from '@/types'

const getters: GetterTree<RootState, RootState> = {
  isAdmin: (state) => state.isAdmin,
  userId: (state) => state.userId,
  isLoading: (state) => state.isLoading,
}

export default getters
