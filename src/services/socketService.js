import { Server } from 'socket.io';
import { getMessagesRef, getPresenceRef } from '../config/firebase.js';
import { ChatRoom, Message, RoomMember, User } from '../models/index.js';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join chat room
      socket.on('joinRoom', async (data) => {
        try {
          const { userId, roomId } = data;
          
          // Validate userId
          if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
          }

          // Verify user is member of the room
          const membership = await RoomMember.findOne({
            where: { userId, roomId, isActive: true }
          });

          if (!membership) {
            socket.emit('error', { message: 'You are not a member of this room' });
            return;
          }

          // Store user connection
          this.connectedUsers.set(userId, socket.id);
          
          // Join socket room
          socket.join(roomId);
          
          // Update user presence
          await this.updateUserPresence(userId, true);
          
          // Notify room members
          socket.to(roomId).emit('userJoined', { userId, roomId });
          
          console.log(`User ${userId} joined room ${roomId}`);
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      // Leave chat room
      socket.on('leaveRoom', async (data) => {
        try {
          const { userId, roomId } = data;
          
          // Validate userId
          if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
          }
          
          socket.leave(roomId);
          this.connectedUsers.delete(userId);
          
          // Update user presence
          await this.updateUserPresence(userId, false);
          
          // Notify room members
          socket.to(roomId).emit('userLeft', { userId, roomId });
          
          console.log(`User ${userId} left room ${roomId}`);
        } catch (error) {
          console.error('Error leaving room:', error);
        }
      });

      // Send message
      socket.on('sendMessage', async (data) => {
        try {
          const { userId, roomId, content, messageType = 'text', metadata = {} } = data;
          
          // Validate userId
          if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
          }
          
          // Verify user is member of the room
          const membership = await RoomMember.findOne({
            where: { userId, roomId, isActive: true }
          });

          if (!membership) {
            socket.emit('error', { message: 'You are not a member of this room' });
            return;
          }

          const room = await ChatRoom.findByPk(roomId);
          if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
          }

          // Validate firebaseRoomId
          if (!room.firebaseRoomId || typeof room.firebaseRoomId !== 'string' || room.firebaseRoomId.trim() === '') {
            socket.emit('error', { message: 'Invalid Firebase room ID' });
            return;
          }

          // Create message in database
          const newMessage = await Message.create({
            content,
            messageType,
            senderId: userId,
            roomId,
            firebaseMessageId: require('uuid').v4(),
            metadata
          });

          // Get sender info
          const sender = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'profilePicture']
          });

          const messageData = {
            ...newMessage.toJSON(),
            sender: sender.toJSON()
          };

          // Send to Firebase
          await getMessagesRef(room.firebaseRoomId).doc(newMessage.firebaseMessageId).set({
            messageId: newMessage.id,
            content,
            messageType,
            senderId: userId,
            roomId,
            firebaseMessageId: newMessage.firebaseMessageId,
            metadata,
            createdAt: new Date().toISOString(),
            isRead: false
          });

          // Broadcast to room
          this.io.to(roomId).emit('newMessage', messageData);
          
          console.log(`Message sent in room ${roomId} by user ${userId}`);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Typing indicator
      socket.on('typing', (data) => {
        const { userId, roomId, isTyping } = data;
        socket.to(roomId).emit('userTyping', { userId, roomId, isTyping });
      });

      // Mark message as read
      socket.on('markAsRead', async (data) => {
        try {
          const { messageId, userId } = data;
          
          // Validate userId
          if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            socket.emit('error', { message: 'Invalid user ID' });
            return;
          }
          
          const message = await Message.findByPk(messageId);
          if (!message) {
            socket.emit('error', { message: 'Message not found' });
            return;
          }

          // Check if user is member of the room
          const membership = await RoomMember.findOne({
            where: { userId, roomId: message.roomId, isActive: true }
          });

          if (!membership) {
            socket.emit('error', { message: 'You are not a member of this room' });
            return;
          }

          await message.update({ isRead: true });
          
          // Notify room
          this.io.to(message.roomId).emit('messageRead', { messageId, userId });
        } catch (error) {
          console.error('Error marking message as read:', error);
          socket.emit('error', { message: 'Failed to mark message as read' });
        }
      });

      // Disconnect
      socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        
        // Find user by socket ID and update presence
        for (const [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            await this.updateUserPresence(userId, false);
            this.connectedUsers.delete(userId);
            break;
          }
        }
      });
    });
  }

  async updateUserPresence(userId, isOnline) {
    try {
      // Validate userId
      if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        console.error('Invalid user ID provided for presence update:', userId);
        return;
      }

      await User.update(
        { 
          isOnline,
          lastSeen: isOnline ? null : new Date()
        },
        { where: { id: userId } }
      );

      // Update Firebase presence
      await getPresenceRef(userId).set({
        userId,
        isOnline,
        lastSeen: isOnline ? null : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  }

  // Get connected users count for a room
  getRoomUserCount(roomId) {
    return this.io.sockets.adapter.rooms.get(roomId)?.size || 0;
  }

  // Broadcast to specific room
  broadcastToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }

  // Send to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

export default new SocketService();