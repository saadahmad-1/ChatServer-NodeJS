import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().required(),
  firebaseUid: Joi.string().required(),
  profilePicture: Joi.string().optional(),
  isOnline: Joi.boolean().default(false),
  lastSeen: Joi.date().optional()
});

export const createChatRoomSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  isPrivate: Joi.boolean().default(false),
  userId: Joi.number().integer().positive().required()
});

export const sendMessageSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(1000).required(),
  messageType: Joi.string().valid('text', 'image', 'file', 'audio', 'video').default('text'),
  metadata: Joi.object().optional(),
  userId: Joi.number().integer().positive().required()
});

export const addRoomMemberSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  newMemberId: Joi.number().integer().positive().required(),
  role: Joi.string().valid('admin', 'moderator', 'member').default('member'),
  userId: Joi.number().integer().positive().required()
});

export const removeRoomMemberSchema = Joi.object({
  roomId: Joi.string().uuid().required(),
  memberIdToRemove: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required()
});

export const updatePresenceSchema = Joi.object({
  isOnline: Joi.boolean().required(),
  userId: Joi.number().integer().positive().required()
});