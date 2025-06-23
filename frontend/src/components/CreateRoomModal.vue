<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Create New Room</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label for="roomName" class="block text-sm font-medium text-gray-700 mb-2">
            Room Name
          </label>
          <input
            id="roomName"
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            class="input-field"
            placeholder="Enter room name"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="roomDescription" class="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="roomDescription"
            v-model="form.description"
            rows="3"
            maxlength="500"
            class="input-field resize-none"
            placeholder="Enter room description"
            :disabled="isLoading"
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            id="isPrivate"
            v-model="form.isPrivate"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            :disabled="isLoading"
          />
          <label for="isPrivate" class="ml-2 block text-sm text-gray-700">
            Private Room
          </label>
        </div>
        <p class="text-xs text-gray-500 ml-6">Private rooms require invitation to join</p>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 btn-secondary"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 btn-primary flex items-center justify-center"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Create Room</span>
            <span v-else class="flex items-center space-x-2">
              <div class="spinner"></div>
              <span>Creating...</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { useChatStore } from '@/stores/chat'

const emit = defineEmits(['close', 'created'])

const chatStore = useChatStore()

const form = ref({
  name: '',
  description: '',
  isPrivate: false
})

const isLoading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await chatStore.createRoom(form.value)
    
    if (result.success) {
      emit('created', result.data)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>