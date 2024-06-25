import Constants from '@/Constants'
import Utils from '@/utils/utils'

const mutations = {
  showError(state, payload) {
    state.errorMsg.show = true
    state.errorMsg.code = payload.code || '정의되지 않은 에러입니다.'
    state.errorMsg.message = payload.message || '관리자에게 문의하세요'
  },
  closeError(state) {
    state.errorMsg.show = false
    state.errorMsg.code = ''
    state.errorMsg.message = ''
  },
}

export default mutations
