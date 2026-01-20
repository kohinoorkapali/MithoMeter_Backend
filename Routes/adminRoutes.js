import express from "express";
import { getAnalytics, getReportedReviews } from "../Controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/analytics",getAnalytics);

adminRouter.get("/reported-reviews", getReportedReviews)
export default adminRouter;