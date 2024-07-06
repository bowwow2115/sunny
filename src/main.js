import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import 'remixicon/fonts/remixicon.css' //remixicon 아이콘
import './assets/css/comm.css' //css 파일분리 테스트
import './assets/css/sub.css' //css 파일분리 테스트

import VueClipboard from 'vue-clipboard2'
import constants from './Constants'
import Utils from '@/utils/utils'

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
