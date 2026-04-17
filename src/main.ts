import { createApp } from 'vue'
import $ from 'jquery'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store, { key as storeKey } from './store'
import 'remixicon/fonts/remixicon.css'

import VueClipboard from 'vue-clipboard3'

import constants from './Constants'
import Utils from '@/utils/utils'
import lodash from 'lodash'

import LoadingPlugin from '@/plugins/loadingPlugin'
import {
  DialogPlugin,
  ErrorDialogPlugin,
  MessageDialogPlugin,
  ConfirmPlugin,
} from '@/plugins/dialogPlugin'

window.$ = window.jQuery = $
window.moment = moment
window.constants = constants
window.vuetify = vuetify
window.Utils = Utils

if (import.meta.env.PROD) {
  window._consolelog = console.log
  console.log = () => {}
}

const app = createApp(App)

app.config.globalProperties.$constants = constants
app.config.globalProperties.$lodash = lodash
app.config.globalProperties.$utils = Utils

app.use(store, storeKey)
app.use(router)
app.use(vuetify)
app.use(VueClipboard as any)

app.use(LoadingPlugin)
app.use(DialogPlugin)
app.use(ErrorDialogPlugin)
app.use(MessageDialogPlugin)
app.use(ConfirmPlugin)

app.config.errorHandler = (err: any, instance, info) => {
  console.error('Router View Error:', {
    error: err?.message || err,
    component: (instance as any)?.$options?.name || 'Unknown',
    info,
    route: router.currentRoute.value?.fullPath,
    stack: err?.stack,
  })

  if (import.meta.env?.DEV) {
    const msg = `페이지 로딩 오류: ${err?.message || '알 수 없는 오류'}`
    if (app.config.globalProperties.$showError) {
      app.config.globalProperties.$showError({ message: msg })
    } else {
      alert(msg)
    }
  }
}

app.config.warnHandler = (msg, _instance, trace) => {
  if (
    msg.includes('Failed to resolve component') ||
    msg.includes('router-view')
  ) {
    console.warn('Router View Warning:', msg, trace)
  }
}

const vue = app.mount('#app')

if (import.meta.env.DEV) {
  window.vue = vue
  window.$app = app
  window.$router = router
  window.$store = store
  window.$vuetify = vuetify
}

window.$app = app
