import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  baseURL:
    process.env.NODE_ENV !== 'production'
      ? ''
      : document.querySelector('meta[name="webbase"]').getAttribute('content'),
  // Auth
  info: null,
  user: {
    locale: 'ko',
    isFirstLogin: true,
  },
  ticket: '',
  // material theme
  // theme: {
  //   background: '#192227',
  //   text: '#fff',
  //   accent: '#4285f4',
  // },

  // dark and purple
  // theme: {
  //   background: '#313131',
  //   text: '#fff',
  //   accent: '#6200ee',
  // },

  // white and blue
  theme: {
    background: '#ffffff',
    text: '#212121',
    accent: '#4285f4',
  },

  // blue theme
  // theme: {
  //   background: '#2a314c',
  //   text: '#fff',
  //   accent: '#ba6774',
  // },

  asideCollapse: false,
  subMenuActive: false,
  currentPage: {},
  currentPGM: null,
  mainPGMType: null,
  PGMLayoutType: null,
  policyApplyYN: null,
  currentPolicy: null,
  currentSub: null,
  currentSubItem: {},
  menuList: [],
  loading: false,
  idPath: '',
  secureClass: [],
  selectServer: {},
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  getters,
})

;(async () => {
  await store.dispatch('browserInit')
  console.log('Browser has been initialized')
  await import('../main')
})()

export default store
