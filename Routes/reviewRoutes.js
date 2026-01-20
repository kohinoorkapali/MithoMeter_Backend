// src/routes/reviewRoutes.js
import express from "express";
import { getReviewsByRestaurant, addReview, reportReview } from "../Controller/reviewController.js";
import { reviewPhotoUploader } from "../middleware/uploads.js"; // optional photos

const reviewRouter = express.Router();

// Get all reviews for a restaurant
reviewRouter.get("/:restaurantId", getReviewsByRestaurant);

// Add a review (photos optional)
reviewRouter.post("/", reviewPhotoUploader.array("photos", 5), addReview);

reviewRouter.post("/:id/report", reportReview)

export default reviewRouter;
