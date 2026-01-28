import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
// Define the Favorite model
export const Favorite = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "restaurantId"], // Prevent duplicate favorites per user
      },
    ],
  }
);
