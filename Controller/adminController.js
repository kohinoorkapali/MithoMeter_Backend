import { User } from "../Model/userModel.js";
import { Restaurant } from "../Model/restaurantModel.js";
import { Review } from "../Model/reviewModel.js";
import { Notification } from "../Model/notificationModel.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

/* ============================================================
 DASHBOARD
============================================================ */
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

/* ============================================================
 REPORTS
============================================================ */
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

/* ============================================================
 RESTAURANT
============================================================ */
export const updateRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    // Existing photos
    let existingPhotos = [];
    if (req.body.existingPhotos) {
      existingPhotos = parseJSONField(req.body.existingPhotos).map((p) =>
        p.replace(/\\/g, "/").replace(/^.*\/uploads\//, "uploads/")
      );
    }

    // New uploads
    const newPhotos = req.files?.map((file) =>
      file.path.replace(/\\/g, "/").replace(/^.*\/uploads\//, "uploads/")
    ) || [];

    restaurant.photos = [...existingPhotos, ...newPhotos];

    // Update other fields
    restaurant.name = req.body.name;
    restaurant.location = req.body.location;
    restaurant.openTime = req.body.openTime;
    restaurant.closeTime = req.body.closeTime;
    restaurant.description = req.body.description;
    restaurant.websiteLink = req.body.websiteLink || null;
    restaurant.menuLink = req.body.menuLink || null;
    restaurant.cuisines = parseJSONField(req.body.cuisines);
    restaurant.priceRange = parseJSONField(req.body.priceRange);
    restaurant.moods = parseJSONField(req.body.moods);
    restaurant.features = parseJSONField(req.body.features);

    await restaurant.save();

    res.json({ message: "Restaurant updated successfully" });
  } catch (err) {
    console.error("UPDATE RESTAURANT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    // Delete images
    (restaurant.photos || []).forEach((filename) => {
      const filePath = path.join("uploads", "restaurants", filename);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete image:", filePath, err);
      }
    });

    await restaurant.destroy();
    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("DELETE RESTAURANT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
 USER
============================================================ */
export const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {role: "user"},
      attributes: [
        "id",
        "username",
        "email",
        "profile_image",
        "createdAt",
        "status"
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ data: users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {id, role: "user"},
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = user.status === "banned" ? "active" : "banned";
    await user.update({status :newStatus});

    res.status(200).json({
      status: newStatus,
      message: `User ${
        newStatus === "banned" ? "banned" : "unbanned"
      } successfully`,
    });
    
  } catch (err) {
    console.error("TOGGLE USER STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
