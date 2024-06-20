import axios from 'axios'
import * as api from '@/api/api'

const actions = {
  resetState({ commit }) {
    commit('setCurrentPGM', null)
    commit('setTicket', null)
    commit('setUser', null)
    commit('setMenuList', null)
  },
}

export default actions
