import { sequelize } from "../Database/db.js";

import { Restaurant } from "./restaurantModel.js";
import { Favorite } from "./FavoriteModel.js";
import { Review } from "./reviewModel.js";
import { User } from "./userModel.js";

/* ============================
   FAVORITE ↔ RESTAURANT
============================ */
Restaurant.hasMany(Favorite, {
  foreignKey: "restaurantId",
  onDelete: "CASCADE",
});

Favorite.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  onDelete: "CASCADE",
});

/* ============================
   FAVORITE ↔ USER
============================ */
User.hasMany(Favorite, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Favorite.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

/* ============================
   REVIEW ↔ RESTAURANT
============================ */
Restaurant.hasMany(Review, {
  foreignKey: "restaurantId",
  onDelete: "CASCADE",
});

Review.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  onDelete: "CASCADE",
});

/* ============================
   REVIEW ↔ USER
============================ */
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

/* ============================
   EXPORT
============================ */
export {
  sequelize,
  Restaurant,
  Favorite,
  Review,
  User,
};
