import Vue from 'vue'
import store from '../store'

const LoadingPlugin = {
  install(Vue) {
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
