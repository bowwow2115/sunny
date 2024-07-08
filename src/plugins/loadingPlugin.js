import Vue from 'vue'
import store from '../store'
import LoadingBar from '../components/LoadingBar.vue'

const LoadingPlugin = {
  install(Vue) {
    Vue.component('LoadingBar', LoadingBar)

    Vue.prototype.$withLoading = async function (promise) {
      store.dispatch('setLoading', true)
      try {
        await promise
      } finally {
        store.dispatch('setLoading', false)
      }
    }
  },
}

export default LoadingPlugin
