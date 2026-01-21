import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js"; 
import { Review } from "./reviewModel.js";
import { User } from "./userModel.js";

export const Notification = sequelize.define("Notification", {
  notificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "notification_id",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "user_id",
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: "is_read",
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "review_id",
    references: {
      model: "Reviews",
      key: "reviewId",
    },
    onDelete: "SET NULL",
  },  
  
}, {
  tableName: "Notifications",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

Notification.belongsTo(Review, {
  foreignKey: "reviewId",
  as: "review",
});


User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
