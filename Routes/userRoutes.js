import express from "express";
import {
  save,
  getById,
  updateById,
  deleteById,
  updateProfileWithImage,
} from "../Controller/userController.js";

import { profileUploader } from "../middleware/uploads.js";

export const userRouter = express.Router();

userRouter.post("/", save);
userRouter.get("/:id", getById);
userRouter.patch("/:id", updateById);               // username only
userRouter.delete("/:id", deleteById);

// Single route that accepts both POST and PATCH for profile image + username
userRouter.route("/upload/:id")
  .post(profileUploader.single("profile"), updateProfileWithImage)
  .patch(profileUploader.single("profile"), updateProfileWithImage);