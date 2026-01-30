import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Restaurant } from "../Model/associations.js";
export const Review = sequelize.define("Review", {
  reviewId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Restaurant, key: "restaurantId" },
    onDelete: "CASCADE",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  ratings: { type: DataTypes.JSON, allowNull: false },
  totalRating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  photos: { type: DataTypes.JSON, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },

  // NEW FIELDS
  visitDate: { type: DataTypes.DATE, allowNull: true },
  visitCompany: { type: DataTypes.STRING, allowNull: true },

  isReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wasReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reportedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }  
});
