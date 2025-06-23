import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatAPI } from '@/services/api'
import { useAuthStore } from './auth'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  
  const rooms = ref([])
  const currentRoom = ref(null)
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const currentRoomMessages = computed(() => 
    messages.value.filter(msg => msg.roomId === currentRoom.value?.id)
  )

  const loadUserRooms = async () => {
    if (!authStore.user) return
    
    isLoading.value = true
    try {
      const response = await chatAPI.getUserRooms(authStore.user.id)
      if (response.success) {
        rooms.value = response.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const createRoom = async (roomData) => {
    if (!authStore.user) return { success: false }
    
    try {
      const response = await chatAPI.createRoom({
        ...roomData,
        userId: authStore.user.id
      })
      
      if (response.success) {
        await loadUserRooms() // Refresh rooms list
        return { success: true, data: response.data }
      }
      
      return { success: false, message: response.message }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const selectRoom = async (room) => {
    currentRoom.value = room
    await loadRoomMessages(room.roomId || room.id)
  }

  const loadRoomMessages = async (roomId) => {
    if (!authStore.user) return
    
    try {
      const response = await chatAPI.getRoomMessages(roomId, {
        userId: authStore.user.id,
        limit: 50,
        offset: 0
      })
      
      if (response.success) {
        // Filter messages for current room and update
        messages.value = messages.value.filter(msg => msg.roomId !== roomId)
        messages.value.push(...response.data)
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const sendMessage = async (content, messageType = 'text') => {
    if (!authStore.user || !currentRoom.value) return { success: false }
    
    try {
      const response = await chatAPI.sendMessage({
        roomId: currentRoom.value.roomId || currentRoom.value.id,
        content,
        messageType,
        userId: authStore.user.id
      })
      
      if (response.success) {
        // Message will be added via socket event
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const addMessage = (message) => {
    // Add message if it doesn't already exist
    const exists = messages.value.find(msg => msg.id === message.id)
    if (!exists) {
      messages.value.push(message)
    }
  }

  const markMessageAsRead = async (messageId) => {
    if (!authStore.user) return
    
    try {
      await chatAPI.markMessageAsRead(messageId, {
        userId: authStore.user.id
      })
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  const addMember = async (roomId, newMemberId, role = 'member') => {
    if (!authStore.user) return { success: false }
    
    try {
      const response = await chatAPI.addMember({
        roomId,
        newMemberId,
        role,
        userId: authStore.user.id
      })
      
      return response
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  return {
    rooms,
    currentRoom,
    messages,
    currentRoomMessages,
    isLoading,
    error,
    loadUserRooms,
    createRoom,
    selectRoom,
    loadRoomMessages,
    sendMessage,
    addMessage,
    markMessageAsRead,
    addMember
  }
})