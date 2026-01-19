// src/Model/reviewLikeModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Review } from "./reviewModel.js";
import { User } from "./userModel.js";

export const ReviewLike = sequelize.define(
  "ReviewLike",
  {
    reviewId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["reviewId", "userId"], // prevents duplicate likes
      },
    ],
  }
);

// Relations
Review.hasMany(ReviewLike, { foreignKey: "reviewId", onDelete: "CASCADE" });
ReviewLike.belongsTo(Review, { foreignKey: "reviewId" });

User.hasMany(ReviewLike, { foreignKey: "userId", onDelete: "CASCADE" });
ReviewLike.belongsTo(User, { foreignKey: "userId" });
