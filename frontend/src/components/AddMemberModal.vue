<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Add Member</h3>
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
          <label for="memberId" class="block text-sm font-medium text-gray-700 mb-2">
            User ID
          </label>
          <input
            id="memberId"
            v-model="form.newMemberId"
            type="number"
            required
            class="input-field"
            placeholder="Enter user ID"
            :disabled="isLoading"
          />
          <p class="text-xs text-gray-500 mt-1">Enter the ID of the user you want to add</p>
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            id="role"
            v-model="form.role"
            class="input-field"
            :disabled="isLoading"
          >
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

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
            <span v-if="!isLoading">Add Member</span>
            <span v-else class="flex items-center space-x-2">
              <div class="spinner"></div>
              <span>Adding...</span>
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

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'added'])

const chatStore = useChatStore()

const form = ref({
  newMemberId: '',
  role: 'member'
})

const isLoading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await chatStore.addMember(
      props.room.roomId || props.room.id,
      parseInt(form.value.newMemberId),
      form.value.role
    )
    
    if (result.success) {
      emit('added')
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