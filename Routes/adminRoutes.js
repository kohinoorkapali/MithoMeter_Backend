import express from "express";
import { approveReportedReview,
     deleteById,
     deleteReportedReview,
     getAll, getAnalytics, 
     getReportedReviews, 
     toggleUserStatus, 
     updateRestaurantById} from "../Controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/analytics",getAnalytics);

adminRouter.get("/reported-reviews", getReportedReviews);

adminRouter.patch("/reported-reviews/:id/", approveReportedReview);

adminRouter.delete("/reported-reviews/:id/", deleteReportedReview);

adminRouter.get("/", getAll);

adminRouter.patch("/:id/status", toggleUserStatus);

adminRouter.patch(
    "/:id",
    upload.array("photos", 5),
    updateRestaurantById
  );

adminRouter.delete("/:id", deleteById);

export default adminRouter;