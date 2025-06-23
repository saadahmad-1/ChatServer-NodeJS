<template>
  <div class="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div class="text-center">
      <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-bounce-subtle">
        <MessageCircle class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">ChatBase</h1>
      <div class="flex items-center justify-center space-x-1">
        <div class="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
        <div class="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MessageCircle } from 'lucide-vue-next'
</script>