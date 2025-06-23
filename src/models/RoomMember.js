"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

class RoomMember extends Model { }
RoomMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
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
    role: {
      type: DataTypes.ENUM('admin', 'moderator', 'member'),
      defaultValue: 'member'
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "RoomMember",
    tableName: "RoomMembers",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'roomId']
      }
    ]
  }
);

export default RoomMember; 