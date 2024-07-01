const mutations = {
  showError(state, payload) {
    state.errorMsgBox.show = true
    state.errorMsgBox.code = payload.code || '정의되지 않은 에러입니다.'
    state.errorMsgBox.message = payload.message || '관리자에게 문의하세요'
  },
  closeError(state) {
    state.errorMsgBox.show = false
    state.errorMsgBox.code = ''
    state.errorMsgBox.message = ''
  },
}

export default mutations
