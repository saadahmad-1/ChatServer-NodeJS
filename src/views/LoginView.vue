<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
          <MessageCircle class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to ChatBase</h1>
        <p class="text-gray-600">Connect with friends and colleagues in real-time</p>
      </div>

      <!-- Login Form -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="input-field"
              placeholder="Enter your first name"
              :disabled="authStore.isLoading"
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="input-field"
              placeholder="Enter your last name"
              :disabled="authStore.isLoading"
            />
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              v-model="form.phoneNumber"
              type="tel"
              required
              class="input-field"
              placeholder="Enter your phone number"
              :disabled="authStore.isLoading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="authStore.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ authStore.error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full btn-primary flex items-center justify-center space-x-2"
            :disabled="authStore.isLoading"
          >
            <span v-if="!authStore.isLoading">Join ChatBase</span>
            <span v-else class="flex items-center space-x-2">
              <div class="spinner"></div>
              <span>Creating account...</span>
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MessageCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const socketStore = useSocketStore()
const notificationStore = useNotificationStore()

const form = ref({
  firstName: '',
  lastName: '',
  phoneNumber: ''
})

const handleLogin = async () => {
  const result = await authStore.login(form.value)
  
  if (result.success) {
    notificationStore.addNotification({
      type: 'success',
      title: 'Welcome!',
      message: 'Account created successfully'
    })
    
    // Connect socket
    socketStore.connect()
    
    // Redirect to chat
    router.push('/chat')
  } else {
    notificationStore.addNotification({
      type: 'error',
      title: 'Login Failed',
      message: result.message
    })
  }
}
</script>