import type { App } from 'vue'
import { useAppStore } from '@/stores/app'
import { pinia } from '@/pinia'

const LoadingPlugin = {
  install(app: App) {
    app.config.globalProperties.$withLoading = async function <T>(
      promise: Promise<T>
    ): Promise<T | void> {
      const store = useAppStore(pinia)
      store.setLoading(true)
      try {
        return await promise
      } finally {
        store.setLoading(false)
      }
    }
  },
}

export default LoadingPlugin
