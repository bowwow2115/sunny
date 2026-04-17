import type { App } from 'vue'
import store from '@/store'

const LoadingPlugin = {
  install(app: App) {
    app.config.globalProperties.$withLoading = async function <T>(
      promise: Promise<T>
    ): Promise<T | void> {
      store.dispatch('setLoading', true)
      try {
        return await promise
      } finally {
        store.dispatch('setLoading', false)
      }
    }
  },
}

export default LoadingPlugin
