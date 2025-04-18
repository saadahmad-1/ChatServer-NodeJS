"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

sequelize.sync({ force: true });

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


export default User;