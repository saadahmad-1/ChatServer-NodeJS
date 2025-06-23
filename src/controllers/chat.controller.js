import ChatService from "../services/chatService.js";

const chatService = new ChatService();

// Create a new chat room
export const createChatRoom = async (req, res, next) => {
  try {
    // In a real app, you'd get userId from JWT token
    const userId = req.body.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.createChatRoom(req.body, userId);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Get user's chat rooms
export const getUserChatRooms = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.getUserChatRooms(userId);
    console.log(resp);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Send a message
export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.sendMessage(req.body, userId);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Get room messages
export const getRoomMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { limit, offset } = req.query;
    const userId = req.query.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.getRoomMessages(roomId, userId, limit, offset);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Add member to room
export const addRoomMember = async (req, res, next) => {
  try {
    const { roomId, newMemberId, role } = req.body;
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.addRoomMember(roomId, userId, newMemberId, role);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Remove member from room
export const removeRoomMember = async (req, res, next) => {
  try {
    const { roomId, memberIdToRemove } = req.body;
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.removeRoomMember(roomId, userId, memberIdToRemove);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Update user presence
export const updateUserPresence = async (req, res, next) => {
  try {
    const { isOnline } = req.body;
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.updateUserPresence(userId, isOnline);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.body.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const resp = await chatService.markMessageAsRead(messageId, userId);
    return res.status(200).json(resp);
  } catch (err) {
    console.log("Error:", err);
    next(err);
  }
}; 