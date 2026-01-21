import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js"; 

const Notification = sequelize.define("Notification", {
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
}, {
  tableName: "Notifications",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

export default Notification;
