import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    isAdmin: false,
    userId: '',
  }),
  actions: {
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
    setAdmin(isAdmin: boolean) {
      this.isAdmin = isAdmin
    },
    setUserId(userId: string) {
      this.userId = userId
    },
    resetState() {
      this.isLoading = false
      this.isAdmin = false
      this.userId = ''
    },
  },
})
