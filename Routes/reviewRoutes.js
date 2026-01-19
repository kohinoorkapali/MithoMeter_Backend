import express from "express";
import {
  getReviewsByRestaurant,
  getReviewsByUser,
  addReview
} from "../Controller/reviewController.js";
import { reviewPhotoUploader } from "../middleware/uploads.js";

const router = express.Router();

router.get("/restaurant/:restaurantId", getReviewsByRestaurant);
router.get("/user/:userId", getReviewsByUser); 
router.post("/", reviewPhotoUploader.array("photos", 5), addReview);

export default router;
