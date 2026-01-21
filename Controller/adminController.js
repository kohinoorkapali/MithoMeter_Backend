import { User } from "../Model/userModel.js";
import { Restaurant } from "../Model/restaurantModel.js";
import { Review } from "../Model/reviewModel.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: {role: "user"}
    });

    const totalRestaurants = await Restaurant.count();

    const activeUsers = await User.count({
      where: { status: "active",
        role: "user"
       } 
    });

    const helpfulChecks = (await Review.sum("likes")) || 0;

    //return ONLY numbers
    return res.status(200).json({
      totalUsers,
      totalRestaurants,
      activeUsers,
      helpfulChecks
    });

  } catch (error) {
    console.error(error.message); 
    return res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message 
    });
  }
};

export const getReportedReviews = async (req, res) => {
  const reviews = await Review.findAll({
    where: { isReported: true },
    order: [["reportedAt", "DESC"]]
  });

  res.json(reviews);
};

export const approveReportedReview = async (req, res) => {
  const { id } = req.params;

  const [updated] = await Review.update(
    {
      isReported: false,
      reportedAt: null,
    },
    { where: { reviewId: id } }
  );

  if (updated === 0) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({ message: "Review approved" });
};
