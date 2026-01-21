import express from "express";
import { getUserNotifications, markNotificationsAsRead } from "../Controller/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/",getUserNotifications);

notificationRouter.patch("/read",markNotificationsAsRead);

export default notificationRouter;