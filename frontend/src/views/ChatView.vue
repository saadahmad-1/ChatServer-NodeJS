<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
      <!-- User Profile Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span class="text-white font-medium">
                {{ userInitials }}
              </span>
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h3>
            <p class="text-sm text-green-600">Online</p>
          </div>
          <div class="flex space-x-1">
            <button
              @click="showCreateRoomModal = true"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Create Room"
            >
              <Plus class="w-5 h-5" />
            </button>
            <button
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="p-4 border-b border-gray-200">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search rooms..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Rooms List -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-900">Chat Rooms</h3>
            <span class="text-sm text-gray-500">{{ filteredRooms.length }}</span>
          </div>
          
          <div v-if="chatStore.isLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="flex items-center space-x-3 p-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="filteredRooms.length === 0" class="text-center py-8">
            <MessageCircle class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 mb-4">No rooms found</p>
            <button
              @click="showCreateRoomModal = true"
              class="btn-primary"
            >
              Create Your First Room
            </button>
          </div>
          
          <div v-else class="space-y-2">
            <TransitionGroup name="room" tag="div">
              <div
                v-for="room in filteredRooms"
                :key="room.id"
                @click="selectRoom(room)"
                class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors"
                :class="{
                  'bg-primary-50 border border-primary-200': chatStore.currentRoom?.id === room.id,
                  'hover:bg-gray-50': chatStore.currentRoom?.id !== room.id
                }"
              >
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 font-medium">
                    {{ getRoomInitial(room.room?.name || room.name) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">
                    {{ room.room?.name || room.name }}
                  </h4>
                  <p class="text-sm text-gray-500 truncate">
                    {{ room.room?.description || 'No description' }}
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <div v-if="room.room?.isPrivate" class="w-2 h-2 bg-yellow-400 rounded-full mb-1" title="Private Room"></div>
                  <span class="text-xs text-gray-400">{{ formatRole(room.role) }}</span>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Welcome Screen -->
      <div v-if="!chatStore.currentRoom" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle class="w-10 h-10 text-primary-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome to ChatBase</h2>
          <p class="text-gray-600 mb-6">Select a room to start chatting or create a new one</p>
          <button
            @click="showCreateRoomModal = true"
            class="btn-primary flex items-center space-x-2"
          >
            <Plus class="w-5 h-5" />
            <span>Create Your First Room</span>
          </button>
        </div>
      </div>

      <!-- Chat Interface -->
      <div v-else class="flex-1 flex flex-col">
        <!-- Chat Header -->
        <div class="bg-white border-b border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-gray-600 font-medium">
                  {{ getRoomInitial(chatStore.currentRoom.room?.name || chatStore.currentRoom.name) }}
                </span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  {{ chatStore.currentRoom.room?.name || chatStore.currentRoom.name }}
                </h3>
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <Users class="w-4 h-4" />
                  <span>{{ getRoomMemberCount(chatStore.currentRoom) }} members</span>
                  <span>•</span>
                  <span class="text-green-600">{{ getOnlineCount() }} online</span>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button
                @click="showAddMemberModal = true"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Add Member"
              >
                <UserPlus class="w-5 h-5" />
              </button>
              <button
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Room Info"
              >
                <Info class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4" ref="messagesContainer">
          <div v-if="chatStore.currentRoomMessages.length === 0" class="text-center py-8">
            <MessageCircle class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
          
          <TransitionGroup name="message" tag="div" class="space-y-4">
            <div
              v-for="message in chatStore.currentRoomMessages"
              :key="message.id"
              class="flex space-x-3"
              :class="{
                'flex-row-reverse space-x-reverse': message.senderId === authStore.user?.id
              }"
            >
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs text-gray-600 font-medium">
                  {{ getMessageSenderInitials(message) }}
                </span>
              </div>
              
              <div class="flex-1 max-w-xs lg:max-w-md">
                <div
                  class="px-4 py-2 rounded-2xl"
                  :class="{
                    'bg-primary-600 text-white': message.senderId === authStore.user?.id,
                    'bg-gray-100 text-gray-900': message.senderId !== authStore.user?.id
                  }"
                >
                  <p class="text-sm">{{ message.content }}</p>
                </div>
                <div class="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                  <span>{{ formatMessageTime(message.createdAt) }}</span>
                  <span v-if="message.senderId === authStore.user?.id && message.isRead" class="text-primary-600">
                    ✓ Read
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
          
          <!-- Typing Indicator -->
          <div v-if="socketStore.typingUsers.size > 0" class="flex items-center space-x-2 text-sm text-gray-500">
            <div class="typing-dots flex space-x-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
            <span>Someone is typing...</span>
          </div>
        </div>

        <!-- Message Input -->
        <div class="bg-white border-t border-gray-200 p-4">
          <div class="flex items-end space-x-3">
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Paperclip class="w-5 h-5" />
            </button>
            
            <div class="flex-1">
              <textarea
                v-model="messageText"
                @keydown="handleKeyDown"
                @input="handleTyping"
                placeholder="Type a message..."
                rows="1"
                class="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                style="max-height: 120px;"
              ></textarea>
              <div class="flex justify-between items-center mt-1">
                <span class="text-xs text-gray-400">{{ messageText.length }}/1000</span>
              </div>
            </div>
            
            <button
              @click="sendMessage"
              :disabled="!messageText.trim()"
              class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Room Modal -->
    <CreateRoomModal
      v-if="showCreateRoomModal"
      @close="showCreateRoomModal = false"
      @created="handleRoomCreated"
    />

    <!-- Add Member Modal -->
    <AddMemberModal
      v-if="showAddMemberModal"
      :room="chatStore.currentRoom"
      @close="showAddMemberModal = false"
      @added="handleMemberAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  MessageCircle,
  Plus,
  Search,
  Users,
  UserPlus,
  Info,
  Send,
  Paperclip,
  LogOut
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { useSocketStore } from '@/stores/socket'
import { useNotificationStore } from '@/stores/notifications'

import CreateRoomModal from '@/components/CreateRoomModal.vue'
import AddMemberModal from '@/components/AddMemberModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const socketStore = useSocketStore()
const notificationStore = useNotificationStore()

const searchQuery = ref('')
const messageText = ref('')
const showCreateRoomModal = ref(false)
const showAddMemberModal = ref(false)
const messagesContainer = ref(null)
const typingTimeout = ref(null)

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`.toUpperCase()
})

const filteredRooms = computed(() => {
  if (!searchQuery.value) return chatStore.rooms
  
  return chatStore.rooms.filter(room => {
    const roomName = room.room?.name || room.name || ''
    return roomName.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const getRoomInitial = (name) => {
  return name ? name[0].toUpperCase() : 'R'
}

const formatRole = (role) => {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Member'
}

const getRoomMemberCount = (room) => {
  return room.room?.members?.length || 1
}

const getOnlineCount = () => {
  // This would be calculated based on actual online members
  return 1
}

const getMessageSenderInitials = (message) => {
  if (message.sender) {
    return `${message.sender.firstName[0]}${message.sender.lastName[0]}`.toUpperCase()
  }
  return 'U'
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  
  return date.toLocaleDateString()
}

const selectRoom = async (room) => {
  // Leave current room
  if (chatStore.currentRoom) {
    socketStore.leaveRoom(chatStore.currentRoom.roomId || chatStore.currentRoom.id)
  }
  
  // Select new room
  await chatStore.selectRoom(room)
  
  // Join new room via socket
  socketStore.joinRoom(room.roomId || room.id)
  
  // Scroll to bottom
  await nextTick()
  scrollToBottom()
}

const sendMessage = async () => {
  if (!messageText.value.trim()) return
  
  const content = messageText.value.trim()
  messageText.value = ''
  
  // Send via socket for real-time delivery
  if (chatStore.currentRoom) {
    socketStore.sendMessage(
      chatStore.currentRoom.roomId || chatStore.currentRoom.id,
      content
    )
  }
  
  // Also send via API for persistence
  const result = await chatStore.sendMessage(content)
  
  if (!result.success) {
    notificationStore.addNotification({
      type: 'error',
      title: 'Failed to send message',
      message: result.message
    })
  }
  
  // Scroll to bottom
  await nextTick()
  scrollToBottom()
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleTyping = () => {
  if (!chatStore.currentRoom) return
  
  // Send typing indicator
  socketStore.sendTyping(chatStore.currentRoom.roomId || chatStore.currentRoom.id, true)
  
  // Clear previous timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
  
  // Stop typing after 2 seconds
  typingTimeout.value = setTimeout(() => {
    socketStore.sendTyping(chatStore.currentRoom.roomId || chatStore.currentRoom.id, false)
  }, 2000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleRoomCreated = (room) => {
  showCreateRoomModal.value = false
  notificationStore.addNotification({
    type: 'success',
    title: 'Room Created',
    message: `Room "${room.name}" created successfully`
  })
  
  // Refresh rooms list
  chatStore.loadUserRooms()
}

const handleMemberAdded = () => {
  showAddMemberModal.value = false
  notificationStore.addNotification({
    type: 'success',
    title: 'Member Added',
    message: 'Member added successfully'
  })
}

const handleLogout = async () => {
  // Update presence to offline
  await authStore.updatePresence(false)
  
  // Disconnect socket
  socketStore.disconnect()
  
  // Logout
  authStore.logout()
  
  // Redirect to login
  router.push('/login')
}

// Watch for new messages to scroll to bottom
watch(() => chatStore.currentRoomMessages.length, async () => {
  await nextTick()
  scrollToBottom()
})

onMounted(async () => {
  // Load user rooms
  await chatStore.loadUserRooms()
  
  // Update presence to online
  await authStore.updatePresence(true)
})

onUnmounted(() => {
  // Update presence to offline
  authStore.updatePresence(false)
  
  // Clear typing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})
</script>