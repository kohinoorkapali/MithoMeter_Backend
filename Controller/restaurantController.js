// Controller/restaurantController.js
import { Restaurant } from "../Model/restaurantModel.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";

// Helper: safely parse JSON fields
const parseJSONField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch {
    return [];
  }
};

/* ============================================================
   CREATE RESTAURANT
============================================================ */
export const saveRestaurant = async (req, res) => {
  try {
    const { name, location, openTime, closeTime, description } = req.body;
    if (!name || !location || !openTime || !closeTime || !description) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const photos = req.files?.map((file) => file.filename) || [];

    const newRestaurant = await Restaurant.create({
      name,
      location,
      openTime,
      closeTime,
      description,
      websiteLink: req.body.websiteLink || null,
      menuLink: req.body.menuLink || null,
      cuisines: parseJSONField(req.body.cuisines),
      priceRange: parseJSONField(req.body.priceRange),
      moods: parseJSONField(req.body.moods),
      features: parseJSONField(req.body.features),
      photos,
    });

    res.status(201).json({
      message: "Restaurant saved successfully",
      restaurant: newRestaurant,
    });
  } catch (err) {
    console.error("SAVE RESTAURANT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   GET ALL RESTAURANTS
============================================================ */
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();

    const normalizedRestaurants = restaurants.map((r) => {
      const plain = r.toJSON();
      let photos = plain.photos;
      if (typeof photos === "string") {
        try {
          photos = JSON.parse(photos);
        } catch {
          photos = [];
        }
      }
      if (!Array.isArray(photos)) photos = [];
      plain.photos = photos.map((filename) => `/uploads/restaurants/${filename}`);
      plain.isOpen = isRestaurantOpen(plain.openTime, plain.closeTime);
      return plain;
    });

    res.status(200).json({ data: normalizedRestaurants });
  } catch (err) {
    console.error("GET ALL RESTAURANTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   GET SINGLE RESTAURANT
============================================================ */
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { restaurantId: id } });

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const plain = restaurant.toJSON();
    plain.photos = (plain.photos || []).map((filename) => `/uploads/restaurants/${filename}`);
    plain.isOpen = isRestaurantOpen(plain.openTime, plain.closeTime);

    res.status(200).json({ data: plain });
  } catch (err) {
    console.error("GET SINGLE RESTAURANT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
