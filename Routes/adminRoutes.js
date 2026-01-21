import express from "express";
import { approveReportedReview, getAnalytics, getReportedReviews } from "../Controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/analytics",getAnalytics);

adminRouter.get("/reported-reviews", getReportedReviews);

adminRouter.patch("/reported-reviews/:id/approve", approveReportedReview);
export default adminRouter;