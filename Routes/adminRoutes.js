import express from "express";
import { getAnalytics } from "../Controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/analytics",getAnalytics);

export default adminRouter;