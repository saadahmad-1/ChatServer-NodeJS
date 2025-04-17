"use strict";
const { Model, DataTypes } = require("sequelize");
import sequelize from "../config/db";

module.exports = (sequelize, DataTypes) => {
  class User extends Model { }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );
  return User;
};
