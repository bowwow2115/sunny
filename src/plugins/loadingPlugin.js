import store from '../store'

const LoadingPlugin = {
  install(app) {
    app.config.globalProperties.$withLoading = async function (promise) {
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
