import Constants from '@/Constants'
import Utils from '@/utils/utils'

const mutations = {
  setAsideCollapse(state, value) {
    if (value != null) {
      state.asideCollapse = value
    } else {
      state.asideCollapse = !state.asideCollapse
    }
  },
  setSubMenuActive(state, value) {
    if (value != null) {
      state.subMenuActive = value
    } else {
      state.subMenuActive = !state.subMenuActive
    }
  },
  setCurrentPage(state, value) {
    state.currentPage = value
  },
  setCurrentPGM(state, value) {
    state.currentPGM = value
  },

  setCurrentSub(state, value) {
    state.currentSub = value
  },

  setPolicyApplyYN(state, value) {
    state.policyApplyYN = value
  },
  setCurrentPolicy(state, value) {
    state.currentPolicy = value
  },

  setSecureClass(state, value) {
    state.secureClass = value
  },

  // Auth
  FETCH_INFO: (state, value) => {
    state.info = value.info
    console.log('Browser has been initialized')
  },
  setUser: (state, value) => {
    state.user = value
  },
  setTicket: (state, value) => (state.ticket = value),
  setMenuList: (state, value) => {
    state.menuList = value
  },
  setLang: (state, value) => {
    state.user.locale = value
  },
  setLoading: (state, value) => {
    state.user.loading = value
  },
  setCustomSaveBtn: (state, value) => {
    state.customSaveBtn = value
  },

  setSelectServer(state, value) {
    state.selectServer = value
  },
}

export default mutations
