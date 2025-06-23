import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const authAPI = {
  createUser: (userData) => api.post('/users/v1/createUser', userData),
  updatePresence: (data) => api.put('/chat/v1/updatePresence', data)
}

export const chatAPI = {
  getUserRooms: (userId) => api.get(`/chat/v1/userRooms/${userId}`),
  createRoom: (roomData) => api.post('/chat/v1/createRoom', roomData),
  sendMessage: (messageData) => api.post('/chat/v1/sendMessage', messageData),
  getRoomMessages: (roomId, params) => api.get(`/chat/v1/roomMessages/${roomId}`, { params }),
  markMessageAsRead: (messageId, data) => api.put(`/chat/v1/markRead/${messageId}`, data),
  addMember: (data) => api.post('/chat/v1/addMember', data),
  removeMember: (data) => api.delete('/chat/v1/removeMember', { data })
}

export default api