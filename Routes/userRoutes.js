import express from "express";
import {
  getAll,
  save,
  getById,
  updateById,
  deleteById,
  toggleUserStatus,
} from "../Controller/userController.js";

export const userRouter = express.Router(); 

userRouter.get("/", getAll);
userRouter.get("/:id/status", toggleUserStatus);
userRouter.post("/", save);
userRouter.get("/:id", getById);
userRouter.patch("/:id", updateById);
userRouter.delete("/:id", deleteById);

export default userRouter;
