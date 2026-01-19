import { Review } from "../Model/reviewModel.js";
import { Restaurant } from "../Model/restaurantModel.js";
import { User } from "../Model/userModel.js"; // import User


export const getReviewsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await Review.findAll({
      where: { restaurantId },
      order: [["date", "DESC"]],
      include: [
        {
          model: User,
          as: "user",                 // <-- make sure you have Review.belongsTo(User, { as: 'user', ... })
          attributes: ["username", "profile_image"], // fetch only username + profile
        },
      ],
    });

    // Normalize photos and attach user profile
    const normalizedReviews = reviews.map((r) => {
      const review = r.toJSON();

      // Ensure photos is always an array
      review.photos = Array.isArray(review.photos)
        ? review.photos
        : JSON.parse(review.photos || "[]");

      // Attach username & profile from User table
      review.username = review.user?.username || review.username;
      review.profile = review.user?.profile_image || null;

      delete review.user; // optional, cleanup

      return review;
    });

    res.status(200).json({ data: normalizedReviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addReview = async (req, res) => {
  try {
    const {
      restaurantId,
      userId,
      username,
      title,
      text,
      ratings,
      totalRating,
      photos: bodyPhotos = [], // photos from JSON body
      visitDate = null,
      visitCompany = null,
    } = req.body;

    // Merge optional uploaded files (req.files) with bodyPhotos
    const uploadedPhotos = req.files ? req.files.map(file => file.filename) : [];
    const photos = [...bodyPhotos, ...uploadedPhotos]; // array of all photos

    // Validate required fields
    if (!restaurantId || !userId || !username || !title || !text || !ratings || totalRating == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = await Review.create({
      restaurantId,
      userId,
      username,
      title,
      text,
      ratings,
      totalRating,
      photos, // array of photo filenames
      visitDate,
      visitCompany,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      include: [
        {
          model: Restaurant,
          attributes: ["restaurantId", "name", "photos"], // include restaurantId, name, photos
        },
      ],
    });

    const normalizedReviews = reviews.map((r) => {
      const review = r.toJSON();

      // Ensure review photos array
      review.photos = Array.isArray(review.photos)
        ? review.photos
        : JSON.parse(review.photos || "[]");

      // Ensure restaurant photos array
      review.restaurantPhotos = Array.isArray(review.Restaurant?.photos)
        ? review.Restaurant.photos
        : [];

      // Attach restaurant info
      review.restaurantName = review.Restaurant?.name || "Unknown Restaurant";
      review.restaurantId = review.Restaurant?.restaurantId || review.restaurantId;

      delete review.Restaurant;
      return review;
    });

    res.status(200).json({ data: normalizedReviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body; // send userId from frontend

    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const existing = await ReviewLike.findOne({ where: { reviewId, userId } });
    let liked = false;

    if (existing) {
      // User already liked → remove like
      await existing.destroy();
    } else {
      // User hasn't liked yet → add like
      await ReviewLike.create({ reviewId, userId });
      liked = true;
    }

    // Update total likes in Review table
    const likes = await ReviewLike.count({ where: { reviewId } });
    await Review.update({ likes }, { where: { reviewId } });

    res.status(200).json({ liked, likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
