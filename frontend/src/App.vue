<template>
  <div id="app" class="h-screen overflow-hidden">
    <!-- Loading Screen -->
    <LoadingScreen v-if="isLoading" />
    
    <!-- Main Application -->
    <router-view v-else />
    
    <!-- Global Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'
import LoadingScreen from '@/components/LoadingScreen.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'

const authStore = useAuthStore()
const socketStore = useSocketStore()
const isLoading = ref(true)

onMounted(async () => {
  // Initialize app
  await authStore.initializeAuth()
  
  // Connect socket if user is authenticated
  if (authStore.isAuthenticated) {
    socketStore.connect()
  }
  
  // Hide loading screen
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>