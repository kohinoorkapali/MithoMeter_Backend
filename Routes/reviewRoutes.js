import express from "express";
import { 
  getReviewsByRestaurant, 
  getReviewsByUser, 
  addReview, 
  reportReview ,
  updateReview,
  getReviewById,
  toggleLike           
} from "../Controller/reviewController.js";
import { reviewPhotoUploader } from "../middleware/uploads.js"; // optional photos

const reviewRouter = express.Router();

// Get all reviews for a restaurant
reviewRouter.get("/restaurant/:restaurantId", getReviewsByRestaurant);

// Get all reviews by a user
reviewRouter.get("/user/:userId", getReviewsByUser);

// Add a review (with optional photos)
reviewRouter.post("/", reviewPhotoUploader.array("photos", 5), addReview);

// Report a review
reviewRouter.post("/:id/report", reportReview);

reviewRouter.patch("/:reviewId/like", toggleLike);

reviewRouter.get("/:id", getReviewById);

reviewRouter.put(
  "/:id",
  reviewPhotoUploader.array("photos", 5), // ← handle files
  updateReview
);


export default reviewRouter;
