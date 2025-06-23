import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const initializeAuth = async () => {
    const savedUser = localStorage.getItem('chatbase_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        localStorage.removeItem('chatbase_user')
      }
    }
  }

  const login = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authAPI.createUser(userData)
      
      if (response.success) {
        user.value = response.data
        localStorage.setItem('chatbase_user', JSON.stringify(response.data))
        return { success: true }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || 'Login failed'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('chatbase_user')
  }

  const updatePresence = async (isOnline) => {
    if (!user.value) return
    
    try {
      await authAPI.updatePresence({
        userId: user.value.id,
        isOnline
      })
      
      user.value.isOnline = isOnline
      user.value.lastSeen = isOnline ? null : new Date().toISOString()
      localStorage.setItem('chatbase_user', JSON.stringify(user.value))
    } catch (err) {
      console.error('Failed to update presence:', err)
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    initializeAuth,
    login,
    logout,
    updatePresence
  }
})