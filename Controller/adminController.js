import { User } from "../Model/userModel.js";
import { Restaurant } from "../Model/restaurantModel.js";
import { Review } from "../Model/reviewModel.js";
import { Notification } from "../Model/notificationModel.js";
import { Op } from "sequelize";

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
  try {
    const reviews = await Review.findAll({
      where: {
        [Op.or]: [
          { isReported: true },   // Pending
          { isHidden: true },     // Hidden
          { wasReported: true },  // Approved after report
        ],
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "profile_image"],
        },
      ],

      order: [["reportedAt", "DESC"]],
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveReportedReview = async (req, res) => {
  const { id } = req.params;

  const [updated] = await Review.update(
    {
      isReported: false,
      isHidden: false,
      // wasReported stays true
    },
    { where: { reviewId: id } }
  );
  

  if (!updated) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({ message: "Review approved" });
};

export const deleteReportedReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findOne({ where: { reviewId: id } });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Soft delete (hide)
  await Review.update(
    { isHidden: true,
      isReported: false,
     },
    { where: { reviewId: id } }
  );

  // Create notification (ONLY ONCE)
  await Notification.findOrCreate({
    where: {
      userId: review.userId,
      reviewId: review.reviewId,
      message: "One of your reviews was removed by the admin for violating guidelines.",
    },
    defaults: {
      isRead: false,
    },
  });

  res.json({ message: "Review hidden and user notified" });
};
