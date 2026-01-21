import express from "express";
import { approveReportedReview, deleteReportedReview, getAnalytics, getReportedReviews } from "../Controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/analytics",getAnalytics);

adminRouter.get("/reported-reviews", getReportedReviews);

adminRouter.patch("/reported-reviews/:id/", approveReportedReview);

adminRouter.delete("/reported-reviews/:id/", deleteReportedReview);
export default adminRouter;