import express from "express";
import { approveReportedReview,
     deleteReportedReview,
     getAll, getAnalytics, 
     getReportedReviews, 
     toggleUserStatus, } from "../Controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/analytics",getAnalytics);

adminRouter.get("/reported-reviews", getReportedReviews);

adminRouter.patch("/reported-reviews/:id/", approveReportedReview);

adminRouter.delete("/reported-reviews/:id/", deleteReportedReview);

adminRouter.get("/", getAll);

adminRouter.patch("/:id/status", toggleUserStatus);

export default adminRouter;