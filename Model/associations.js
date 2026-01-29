import { sequelize } from "../Database/db.js";
import { Restaurant } from "./restaurantModel.js";
import { Favorite } from "./FavoriteModel.js";
import { Review } from "./reviewModel.js";
import { User } from "./userModel.js";
import { ReviewLike } from "./reviewLikeModel.js";
import { Notification } from "./notificationModel.js";

/* ============================
   ALL ASSOCIATIONS
============================ */


  // FAVORITE ↔ RESTAURANT
  Restaurant.hasMany(Favorite, {
    foreignKey: "restaurantId",
    onDelete: "CASCADE",
  });

  Favorite.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
  });


  // FAVORITE ↔ USER
  User.hasMany(Favorite, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  Favorite.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });


  // REVIEW ↔ RESTAURANT
  Restaurant.hasMany(Review, {
    foreignKey: "restaurantId",
    onDelete: "CASCADE",
  });

  Review.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    onDelete: "CASCADE",
  });


  // REVIEW ↔ USER
  User.hasMany(Review, {
    foreignKey: "userId",
    as: "reviews",
    onDelete: "CASCADE",
  });

  Review.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
  });


  // REVIEW ↔ REVIEWLIKE
  Review.hasMany(ReviewLike, {
    foreignKey: "reviewId",
    onDelete: "CASCADE",
  });

  ReviewLike.belongsTo(Review, {
    foreignKey: "reviewId",
    onDelete: "CASCADE",
  });


  // NOTIFICATION ↔ USER
  User.hasMany(Notification, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  Notification.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });


  // NOTIFICATION ↔ REVIEW
  Review.hasMany(Notification, {
    foreignKey: "reviewId",
    onDelete: "CASCADE",
  });

  Notification.belongsTo(Review, {
    foreignKey: "reviewId",
    onDelete: "CASCADE",
  });


export {
  sequelize,
  Restaurant,
  Favorite,
  Review,
  User,
  ReviewLike,
  Notification,
};
