import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import 'remixicon/fonts/remixicon.css' //remixicon 아이콘
import './assets/css/comm.css' //css 파일분리 테스트
import './assets/css/sub.css' //css 파일분리 테스트

// import ErrorDialog from "@/components/custom/dialog/ErrorDialog";
import VueClipboard from 'vue-clipboard2'
import constants from './Constants'
import Utils from '@/utils/utils'
import GlobalModal from './plugins/globalModal.js'

import lodash from 'lodash'

window.$ = require('jquery')
window.jQuery = require('jquery')
window.store = store
window.moment = require('moment')

window.constants = constants
Vue.prototype.$Constants = constants
Vue.config.productionTip = false

VueClipboard.config.autoSetContainer = true

Vue.prototype.$lodash = lodash
Vue.prototype.$Utils = Utils
window.Utils = Utils
Vue.use(VueClipboard)
Vue.use(GlobalModal)

Vue.prototype.$showError = function (error = null, title = null) {
  let message = ''
  if (error && error.status && error.error) {
    message = error.status + ' ' + error.error
  }
  if (!error)
    message = '처리가 실패하였습니다. \n오류 내용은 관리자에게 전달되었습니다.'

  if (error && error.code) {
    message = `${error.message} (${error.code})`
  }

  console.log(message)

  if (!title) title = '오류'

  this.$notify.error({
    position: 'bottom-right',
    duration: 2000,
    title: title,
    message: message,
  })
}
Vue.prototype.$showOk = function (message = null) {
  if (!message) message = '처리가 완료되었습니다.'

  this.$notify.success({
    position: 'bottom-right',
    duration: 1000,
    title: '성공',
    message: message,
    offset: 60,
  })
}

if (process.env.NODE_ENV === 'production') {
  window._consolelog = console.log
  console.log = function () {}
}
window.console = console

let vue = new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app')

window.vue = vue
