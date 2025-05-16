import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('auth_token', token)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
    }
  }
})
