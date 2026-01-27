import { Review } from "../Model/reviewModel.js";
import { Restaurant } from "../Model/restaurantModel.js";
import { User } from "../Model/userModel.js";
import { ReviewLike } from "../Model/reviewLikeModel.js"; // make sure you have this model

// GET all reviews for a restaurant
export const getReviewsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { userId } = req.query; // send currentUser.id from frontend

    const reviews = await Review.findAll({
      where: { restaurantId, isHidden: false },
      order: [["visitDate", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username", "profile_image"],
        },
        {
          model: ReviewLike,
          attributes: ["userId"],   // needed to check liked
        },
      ],
    });

    const normalizedReviews = reviews.map((r) => {
      const review = r.toJSON();

      review.photos = Array.isArray(review.photos)
        ? review.photos
        : JSON.parse(review.photos || "[]");

      review.username = review.user?.username || review.username;
      review.profile = review.user?.profile_image || null;

      // total likes
      review.likes = review.ReviewLikes.length;

      // whether current user liked it
      review.liked = userId
        ? review.ReviewLikes.some((l) => l.userId === Number(userId))
        : false;

      delete review.user;
      delete review.ReviewLikes;

      return review;
    });

    res.status(200).json({ data: normalizedReviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET all reviews by a user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.findAll({
       where: { userId, isHidden: false },
      order: [["visitDate", "DESC"]],
      include: [
        {
          model: Restaurant,
          attributes: ["restaurantId", "name", "photos"],
        },
      ],
    });

    const normalizedReviews = reviews.map((r) => {
      const review = r.toJSON();

if (typeof review.ratings === "string") {
    try {
      review.ratings = JSON.parse(review.ratings);
    } catch (err) {
      review.ratings = {};
    }
  }

  // Ensure all category ratings exist so frontend can calculate averages
  review.ratings = {
    ambience: review.ratings?.ambience || 0,
    food: review.ratings?.food || 0,
    service: review.ratings?.service || 0,
    location: review.ratings?.location || 0,
    value: review.ratings?.value || 0,
  };

      review.photos = Array.isArray(review.photos)
        ? review.photos
        : JSON.parse(review.photos || "[]");

      review.restaurantPhotos = Array.isArray(review.Restaurant?.photos)
        ? review.Restaurant.photos
        : [];

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

// ADD a review
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
      photos: bodyPhotos = [],
      visitDate = null,
      visitCompany = null,
    } = req.body;

    const uploadedPhotos = req.files ? req.files.map((file) => file.filename) : [];
    const photos = [...bodyPhotos, ...uploadedPhotos];

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
      photos,
      visitDate,
      visitCompany,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// REPORT a review
export const reportReview = async (req, res) => {
  try {
    const { id } = req.params;

    const [rowsUpdated] = await Review.update(
      {
        isReported: true,
        isHidden: false,
      },
      { where: { reviewId: id } }
    );

    if (rowsUpdated === 0) return res.status(404).json({ message: "Review not found" });

    res.json({ message: "Review reported successfully" });
  } catch (error) {
    console.error("Report review error:", error);
    res.status(500).json({ message: error.message });
  }
};


// GET single review (only owner can access)
export const getSingleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId !== Number(userId)) {
      return res.status(403).json({ message: "You are not allowed to edit this review" });
    }

    res.json({ data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE like for a review
export const toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const existing = await ReviewLike.findOne({ where: { reviewId, userId } });
    let liked = false;

    if (existing) {
      await existing.destroy();
    } else {
      await ReviewLike.create({ reviewId, userId });
      liked = true;
    }

    const likes = await ReviewLike.count({ where: { reviewId } });
    await Review.update({ likes }, { where: { reviewId } });

    res.status(200).json({ liked, likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE review
export const updateReview = async (req, res) => {
  console.log("==== UPDATE REVIEW ====");
console.log("req.body:", req.body);
console.log("req.files:", req.files);

  try {
    const { id } = req.params;
    let { title, text, ratings, visitDate, visitCompany, photos: bodyPhotos = [] } = req.body;

    // Get uploaded files
    const uploadedPhotos = req.files ? req.files.map(f => f.filename) : [];

    // Parse existing photos from body (FormData always sends strings)
    let existingPhotos = [];
    try {
      existingPhotos = typeof bodyPhotos === "string" ? JSON.parse(bodyPhotos) : bodyPhotos;
    } catch (err) {
      console.error("Failed to parse bodyPhotos:", err);
    }

    // Merge old + new
    const photos = [...existingPhotos, ...uploadedPhotos];

    // Parse ratings if string
    if (typeof ratings === "string") ratings = JSON.parse(ratings);

    const totalRating = Object.values(ratings).reduce((sum, r) => sum + Number(r || 0), 0) / Object.keys(ratings).length;

    visitDate = visitDate ? new Date(visitDate) : null;

    const [rowsUpdated] = await Review.update(
      { title, text, ratings, totalRating, visitDate, visitCompany, photos },
      { where: { reviewId: id } }
    );

    if (rowsUpdated === 0) return res.status(404).json({ message: "Review not found" });

    const updatedReview = await Review.findByPk(id);
    res.json({ success: true, message: "Review updated", data: updatedReview });
  } catch (err) {
    console.error("updateReview error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




export const getReviewById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  console.log("Get review request:", id, "userId:", userId);

  try {
    const review = await Review.findOne({ where: { reviewId: id } });
    console.log("Fetched review:", review ? review.toJSON() : null);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (userId && review.userId != Number(userId))
      return res.status(403).json({ message: "Not authorized" });

    res.json({ success: true, data: review });
  } catch (err) {
    console.error("getReviewById server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
