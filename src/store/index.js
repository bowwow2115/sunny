import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  isLoading: false,
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  getters,
})

// ;(async () => {
//   await store.dispatch('browserInit')
//   console.log('Browser has been initialized')
//   await import('../main')
// })()

export default store
