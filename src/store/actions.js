const actions = {
  showError({ commit }, payload) {
    commit('showError', payload)
  },
  closeError({ commit }) {
    commit('closeError')
  },
}

export default actions
