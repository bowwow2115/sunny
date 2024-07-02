const actions = {
  showError({ commit }, payload) {
    commit('showError', payload)
  },
  closeError({ commit }) {
    commit('closeError')
  },
  showAlert({ commit }, payload) {
    commit('showAlert', payload)
    setTimeout(() => commit('closeAlert'), 2000)
  },
  closeAlert({ commit }) {
    commit('closeAlert')
  },
}

export default actions
