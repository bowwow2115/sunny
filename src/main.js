// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import 'remixicon/fonts/remixicon.css'

import VueClipboard from 'vue-clipboard3'

import constants from './Constants'
import Utils from '@/utils/utils'
import lodash from 'lodash'

// 커스텀 플러그인들
import LoadingPlugin from '@/plugins/loadingPlugin'
import {
  DialogPlugin,
  ErrorDialogPlugin,
  MessageDialogPlugin,
  ConfirmPlugin,
} from '@/plugins/dialogPlugin'

// ─────────────────────────────────────────────
// 🌐 전역 변수 등록
// ─────────────────────────────────────────────
window.$ = window.jQuery = require('jquery')
window.moment = require('moment')
window.constants = constants
window.vuetify = vuetify
window.Utils = Utils

// ─────────────────────────────────────────────
// 🚫 프로덕션에서 console.log 비활성화
// ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  window._consolelog = console.log
  console.log = () => {}
}

// ─────────────────────────────────────────────
// 🎯 Vue 3 앱 생성
// ─────────────────────────────────────────────
const app = createApp(App)

// ─────────────────────────────────────────────
// ⚙️ 글로벌 프로퍼티 (Vue 2 Vue.prototype 대체)
// ─────────────────────────────────────────────
app.config.globalProperties.$constants = constants
app.config.globalProperties.$lodash = lodash
app.config.globalProperties.$utils = Utils

// ✅ Vue 2 호환용 $set 레이어 (점진적 제거 권장)
app.config.globalProperties.$set = (target, key, value) => {
  if (Array.isArray(target) && typeof key === 'number') {
    target[key] = value
  } else if (target && typeof target === 'object') {
    target[key] = value
  }
  return value
}

// ─────────────────────────────────────────────
// 🔌 플러그인 등록 (순서 중요!)
// ─────────────────────────────────────────────
app.use(store) // Vuex 4+
app.use(router) // Vue Router 4+
app.use(vuetify) // Vuetify 3+
app.use(VueClipboard) // vue-clipboard3

// 커스텀 플러그인들
app.use(LoadingPlugin)
app.use(DialogPlugin)
app.use(ErrorDialogPlugin)
app.use(MessageDialogPlugin)
app.use(ConfirmPlugin)

// ─────────────────────────────────────────────
// 🚀 마운트
// ─────────────────────────────────────────────
const vue = app.mount('#app')

// ─────────────────────────────────────────────
// 🔧 개발용 전역 노출 (옵션)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  window.vue = vue
  window.$app = app
  window.$router = router
  window.$store = store
  window.$vuetify = vuetify
}

window.$app = app
