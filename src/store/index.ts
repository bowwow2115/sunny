import { createStore, Store, useStore as baseUseStore } from 'vuex'
import type { InjectionKey } from 'vue'
import type { RootState } from '@/types'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const state: RootState = {
  isLoading: false,
  isAdmin: false,
  userId: '',
}

export const key: InjectionKey<Store<RootState>> = Symbol('vuex-store-key')

const store = createStore<RootState>({
  strict: import.meta.env.DEV,
  state,
  mutations,
  actions,
  getters,
})

export function useStore(): Store<RootState> {
  return baseUseStore(key)
}

export default store
