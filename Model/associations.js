// src/models/associations.js
import { Review } from "./reviewModel.js";
import { ReviewLike } from "./reviewLikeModel.js";
import { User } from "./userModel.js";

// Review ↔ ReviewLike
Review.hasMany(ReviewLike, { foreignKey: "reviewId", onDelete: "CASCADE" });
ReviewLike.belongsTo(Review, { foreignKey: "reviewId" });

// User ↔ ReviewLike
User.hasMany(ReviewLike, { foreignKey: "userId", onDelete: "CASCADE" });
ReviewLike.belongsTo(User, { foreignKey: "userId" });
