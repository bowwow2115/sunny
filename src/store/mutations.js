const mutations = {
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading
  },
  SET_ADMIN(state, isAdmin) {
    state.isAdmin = isAdmin // 어드민 상태를 설정하는 뮤테이션입니다.
  },
}

export default mutations
