// backend/Model/FavoriteModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { User } from "./userModel.js";
import { Restaurant } from "./restaurantModel.js";

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

// ✅ Associations
// Favorite ↔ Restaurant
Favorite.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Restaurant.hasMany(Favorite, { foreignKey: "restaurantId" });

// Favorite ↔ User
Favorite.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Favorite, { foreignKey: "userId" });
