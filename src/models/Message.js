"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class Message extends Model { }
Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    messageType: {
      type: DataTypes.ENUM('text', 'image', 'file', 'audio', 'video'),
      defaultValue: 'text'
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ChatRooms',
        key: 'id'
      }
    },
    firebaseMessageId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "Messages",
    timestamps: true,
  }
);

export default Message; 