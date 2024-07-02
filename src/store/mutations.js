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
  showAlert(state, payload) {
    state.alertMsgBox.show = true
    state.alertMsgBox.type = payload.type
    state.alertMsgBox.message = payload.message
  },
  closeAlert(state) {
    state.alertMsgBox.show = false
    state.alertMsgBox.type = ''
    state.alertMsgBox.message = ''
  },
}

export default mutations
