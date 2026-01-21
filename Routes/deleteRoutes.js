import express from "express";
import { Review } from "../Model/reviewModel.js"; // Use braces if import fails without them

const router = express.Router();

// Using standard function syntax inside the route handler
router.delete("/:reviewId", async function(req, res) {
  const { reviewId } = req.params;
  const { userId } = req.body;

  try {
    // Sequelize uses 'findByPk' to find by ID
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Security check using the ID found in your console logs
    if (review.userId !== parseInt(userId)) {
      return res.status(403).json({ message: "Unauthorized: Not your review" });
    }

    // Sequelize 'destroy' actually deletes the row from the database
    await review.destroy();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;