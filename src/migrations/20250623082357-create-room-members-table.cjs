"use strict";

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('RoomMembers', {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roomId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'ChatRooms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // Add unique index for userId and roomId combination
    await queryInterface.addIndex('RoomMembers', ['userId', 'roomId'], {
      unique: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RoomMembers');
  }
};
