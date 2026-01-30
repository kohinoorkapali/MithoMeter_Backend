import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { User } from "./userModel.js";

export const PasswordResetToken = sequelize.define("PasswordResetToken", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(PasswordResetToken, { foreignKey: "userId" });
PasswordResetToken.belongsTo(User, { foreignKey: "userId" });
