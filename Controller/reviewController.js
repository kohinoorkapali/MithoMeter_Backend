// src/controllers/reviewController.js
import { Review } from "../Model/reviewModel.js";

export const getReviewsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await Review.findAll({
      where: { restaurantId },
      order: [["date", "DESC"]],
    });

    // Ensure photos is always an array
    const normalizedReviews = reviews.map((r) => {
      const review = r.toJSON();
      review.photos = Array.isArray(review.photos)
        ? review.photos
        : JSON.parse(review.photos || "[]");
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
