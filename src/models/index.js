import User from './User.js';
import ChatRoom from './ChatRoom.js';
import Message from './Message.js';
import RoomMember from './RoomMember.js';

// User relationships
User.hasMany(ChatRoom, { foreignKey: 'createdBy', as: 'createdRooms' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });
User.hasMany(RoomMember, { foreignKey: 'userId', as: 'roomMemberships' });

// ChatRoom relationships
ChatRoom.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
ChatRoom.hasMany(Message, { foreignKey: 'roomId', as: 'messages' });
ChatRoom.hasMany(RoomMember, { foreignKey: 'roomId', as: 'members' });

// Message relationships
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(ChatRoom, { foreignKey: 'roomId', as: 'room' });

// RoomMember relationships
RoomMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
RoomMember.belongsTo(ChatRoom, { foreignKey: 'roomId', as: 'room' });

export {
  User,
  ChatRoom,
  Message,
  RoomMember
};