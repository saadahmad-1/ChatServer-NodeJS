import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './auth'
import { useChatStore } from './chat'
import { useNotificationStore } from './notifications'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const typingUsers = ref(new Set())

  const authStore = useAuthStore()
  const chatStore = useChatStore()
  const notificationStore = useNotificationStore()

  const connect = () => {
    if (socket.value) return

    socket.value = io('http://localhost:3002', {
      transports: ['websocket']
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('Connected to server')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from server')
    })

    socket.value.on('newMessage', (message) => {
      chatStore.addMessage(message)
      
      // Show notification if message is not from current user
      if (message.senderId !== authStore.user?.id) {
        notificationStore.addNotification({
          type: 'info',
          title: 'New Message',
          message: `${message.sender?.firstName}: ${message.content.substring(0, 50)}...`
        })
      }
    })

    socket.value.on('userJoined', (data) => {
      notificationStore.addNotification({
        type: 'success',
        title: 'User Joined',
        message: `User joined the room`
      })
    })

    socket.value.on('userLeft', (data) => {
      notificationStore.addNotification({
        type: 'info',
        title: 'User Left',
        message: `User left the room`
      })
    })

    socket.value.on('userTyping', (data) => {
      if (data.isTyping) {
        typingUsers.value.add(data.userId)
      } else {
        typingUsers.value.delete(data.userId)
      }
    })

    socket.value.on('messageRead', (data) => {
      // Update message read status
      const message = chatStore.messages.find(msg => msg.id === data.messageId)
      if (message) {
        message.isRead = true
      }
    })

    socket.value.on('error', (error) => {
      notificationStore.addNotification({
        type: 'error',
        title: 'Socket Error',
        message: error.message
      })
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const joinRoom = (roomId) => {
    if (socket.value && authStore.user) {
      socket.value.emit('joinRoom', {
        userId: authStore.user.id,
        roomId
      })
    }
  }

  const leaveRoom = (roomId) => {
    if (socket.value && authStore.user) {
      socket.value.emit('leaveRoom', {
        userId: authStore.user.id,
        roomId
      })
    }
  }

  const sendMessage = (roomId, content, messageType = 'text') => {
    if (socket.value && authStore.user) {
      socket.value.emit('sendMessage', {
        userId: authStore.user.id,
        roomId,
        content,
        messageType
      })
    }
  }

  const sendTyping = (roomId, isTyping) => {
    if (socket.value && authStore.user) {
      socket.value.emit('typing', {
        userId: authStore.user.id,
        roomId,
        isTyping
      })
    }
  }

  const markAsRead = (messageId) => {
    if (socket.value && authStore.user) {
      socket.value.emit('markAsRead', {
        messageId,
        userId: authStore.user.id
      })
    }
  }

  return {
    socket,
    isConnected,
    typingUsers,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    markAsRead
  }
})