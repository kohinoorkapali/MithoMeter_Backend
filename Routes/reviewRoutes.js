// src/routes/reviewRoutes.js
import express from "express";
import { getReviewsByRestaurant, addReview } from "../Controller/reviewController.js";
import { reviewPhotoUploader } from "../middleware/uploads.js"; // optional photos

const router = express.Router();

// Get all reviews for a restaurant
router.get("/:restaurantId", getReviewsByRestaurant);

// Add a review (photos optional)
router.post("/", reviewPhotoUploader.array("photos", 5), addReview);

export default router;
