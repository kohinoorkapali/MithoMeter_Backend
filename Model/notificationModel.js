import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { User } from "./associations.js";
import { Review } from "./reviewModel.js"; // ✅ import Review

export const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },

  // ✅ ADD THIS
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: true, // important (old notifications may not have it)
    references: {
      model: Review,
      key: "reviewId",
    },
    onDelete: "CASCADE",
  },

  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

}, {
  timestamps: true,
});
