import responses from "../constants/responses.js";
import { ChatRoom, Message, RoomMember, User } from "../models/index.js";
import { getChatRef, getMessagesRef, getPresenceRef, uuidv4 } from "../config/firebase.js";

class ChatService {
  // Create a new chat room
  createChatRoom = async (payload, userId) => {
    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return responses[1]("Invalid user ID provided");
    }

    const { name, description, isPrivate = false } = payload;
    
    const firebaseRoomId = uuidv4();
    
    const newRoom = await ChatRoom.create({
      name,
      description,
      isPrivate,
      createdBy: userId,
      firebaseRoomId
    });

    // Add creator as admin member
    await RoomMember.create({
      userId,
      roomId: newRoom.id,
      role: 'admin'
    });

    // Create Firebase room document
    await getChatRef(firebaseRoomId).set({
      roomId: newRoom.id,
      name,
      description,
      isPrivate,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      memberCount: 1
    });

    return responses[0]("Chat room created successfully", newRoom);
  };

  // Get all chat rooms for a user
  getUserChatRooms = async (userId) => {
    const userRooms = await RoomMember.findAll({
      where: { userId, isActive: true },
      include: [
        {
          model: ChatRoom,
          as: 'room',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'firstName', 'lastName', 'profilePicture']
            },
            {
              model: RoomMember,
              as: 'members',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'isOnline', 'lastSeen']
                }
              ]
            }
          ]
        }
      ]
    });

    return responses[0]("User chat rooms retrieved successfully", userRooms);
  };

  // Send a message
  sendMessage = async (payload, userId) => {
    const { roomId, content, messageType = 'text', metadata = {} } = payload;
    
    // Check if user is member of the room
    const membership = await RoomMember.findOne({
      where: { userId, roomId, isActive: true }
    });

    if (!membership) {
      return responses[102]("You are not a member of this chat room");
    }

    const room = await ChatRoom.findByPk(roomId);
    if (!room) {
      return responses[1]("Chat room not found");
    }

    // Validate firebaseRoomId
    if (!room.firebaseRoomId || typeof room.firebaseRoomId !== 'string' || room.firebaseRoomId.trim() === '') {
      return responses[1]("Invalid Firebase room ID");
    }

    const firebaseMessageId = uuidv4();
    
    const newMessage = await Message.create({
      content,
      messageType,
      senderId: userId,
      roomId,
      firebaseMessageId,
      metadata
    });

    // Send to Firebase
    await getMessagesRef(room.firebaseRoomId).doc(firebaseMessageId).set({
      messageId: newMessage.id,
      content,
      messageType,
      senderId: userId,
      roomId,
      firebaseMessageId,
      metadata,
      createdAt: new Date().toISOString(),
      isRead: false
    });

    return responses[0]("Message sent successfully", newMessage);
  };

  // Get messages for a room
  getRoomMessages = async (roomId, userId, limit = 50, offset = 0) => {
    // Check if user is member of the room
    const membership = await RoomMember.findOne({
      where: { userId, roomId, isActive: true }
    });

    if (!membership) {
      return responses[102]("You are not a member of this chat room");
    }

    const messages = await Message.findAll({
      where: { roomId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'profilePicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return responses[0]("Messages retrieved successfully", messages.reverse());
  };

  // Add member to room
  addRoomMember = async (roomId, userId, newMemberId, role = 'member') => {
    // Check if user is admin of the room
    const membership = await RoomMember.findOne({
      where: { userId, roomId, isActive: true }
    });

    if (!membership || !['admin', 'moderator'].includes(membership.role)) {
      return responses[102]("You don't have permission to add members");
    }

    // Check if new member already exists
    const existingMember = await RoomMember.findOne({
      where: { userId: newMemberId, roomId }
    });

    if (existingMember) {
      return responses[102]("User is already a member of this room");
    }

    const newMember = await RoomMember.create({
      userId: newMemberId,
      roomId,
      role
    });

    return responses[0]("Member added successfully", newMember);
  };

  // Remove member from room
  removeRoomMember = async (roomId, userId, memberIdToRemove) => {
    // Check if user is admin of the room
    const membership = await RoomMember.findOne({
      where: { userId, roomId, isActive: true }
    });

    if (!membership || !['admin', 'moderator'].includes(membership.role)) {
      return responses[102]("You don't have permission to remove members");
    }

    const memberToRemove = await RoomMember.findOne({
      where: { userId: memberIdToRemove, roomId }
    });

    if (!memberToRemove) {
      return responses[1]("Member not found in this room");
    }

    if (memberToRemove.role === 'admin' && membership.role !== 'admin') {
      return responses[102]("Only admins can remove other admins");
    }

    await memberToRemove.update({ isActive: false });

    return responses[0]("Member removed successfully");
  };

  // Update user presence
  updateUserPresence = async (userId, isOnline) => {
    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return responses[1]("Invalid user ID provided");
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

    return responses[0]("Presence updated successfully");
  };

  // Mark message as read
  markMessageAsRead = async (messageId, userId) => {
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return responses[1]("Message not found");
    }

    // Check if user is member of the room
    const membership = await RoomMember.findOne({
      where: { userId, roomId: message.roomId, isActive: true }
    });

    if (!membership) {
      return responses[102]("You are not a member of this chat room");
    }

    await message.update({ isRead: true });

    return responses[0]("Message marked as read");
  };
}

export default ChatService; 