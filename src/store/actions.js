const actions = {
  setLoading({ commit }, isLoading) {
    commit('SET_LOADING', isLoading)
  },
  setAdmin({ commit }, isAdmin) {
    commit('SET_ADMIN', isAdmin) // 액션에서 뮤테이션을 커밋합니다.
  },
  setUserId({ commit }, userId) {
    commit('SET_USERID', userId) // 액션에서 뮤테이션을 커밋합니다.
  },
}

export default actions
