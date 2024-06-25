import axios from 'axios'
import * as api from '@/api/api'

const actions = {
  showError({ commit }, payload) {
    commit('showError', payload)
  },
  closeError({ commit }) {
    commit('closeError')
  },
}

export default actions
