// src/models/reviewLikeModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const ReviewLike = sequelize.define(
  "ReviewLike",
  {
    reviewId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ["reviewId", "userId"] }],
  }
);
