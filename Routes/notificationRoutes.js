import express from "express";
import { getUserNotifications } from "../Controller/notificationController";

const notficationRouter = express.Router();

notficationRouter.get("/",getUserNotifications);

export default notficationRouter;