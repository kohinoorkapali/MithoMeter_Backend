import express from "express";
import { getUserNotifications, markNotificationsAsRead } from "../Controller/notificationController.js";
import { verifyToken } from "../middleware/auth.js";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyToken,getUserNotifications);

notificationRouter.patch("/read", verifyToken,markNotificationsAsRead);

export default notificationRouter;
