import { createStore } from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const state = {
  isLoading: false,
  isAdmin: false,
  userId: '',
}

const store = createStore({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  getters,
})

export default store
