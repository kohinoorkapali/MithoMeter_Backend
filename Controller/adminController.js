import { User } from "../Model/userModel.js";
import { Restaurant } from "../Model/restaurantModel.js";
import { Review } from "../Model/reviewModel.js";

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const totalRestaurants = await Restaurant.count();

    const activeUsers = await User.count({
      where: { status: "active" } 
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
