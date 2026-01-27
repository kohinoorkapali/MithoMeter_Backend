import { Favorite, Restaurant } from "../Model/associations.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";
import fs from "fs";
import path from "path";

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

/* ============================================================
 UPDATE
============================================================ */
const normalizePath = (p) => {
  if (!p) return "";

  let path = p.replace(/\\/g, "/");

  // Keep only from first /uploads
  const index = path.indexOf("/uploads/");
  if (index !== -1) {
    path = path.substring(index);
  }

  // Remove repeated /uploads
  path = path.replace(/(\/uploads\/)+/g, "/uploads/");

  // Remove double slashes
  path = path.replace(/\/{2,}/g, "/");

  return path;
};

export const updateRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    // Existing photos
    let existingPhotos = [];

    if (req.body.existingPhotos) {
      existingPhotos = parseJSONField(req.body.existingPhotos).map(normalizePath);
    }

    // New uploads
    const newPhotos =
  req.files?.map((file) => file.filename) || [];

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

/* ============================================================
 DELETE
============================================================ */
export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant)
      return res.status(404).json({ message: "Not found" });

    // Delete favorites first
    await Favorite.destroy({
      where: { restaurantId: id },
    });

    // Delete images
    (restaurant.photos || []).forEach((filename) => {
      const filePath = path.join("uploads", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Now delete restaurant
    await restaurant.destroy();

    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};