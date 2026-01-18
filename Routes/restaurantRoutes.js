import { deleteById, getAllRestaurants, getRestaurantById, saveRestaurant, updateRestaurantById } from "../Controller/restaurantController.js";
// routes/restaurantRouter.js
import express from "express";
import fs from "fs";
import path from "path";
import { Restaurant } from "../Model/restaurantModel.js";
import { restaurantUploader } from "../middleware/uploads.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";

const restaurantRouter = express.Router();

// Helper: safely parse JSON strings sent from FormData
const parseJSONField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch (err) {
    console.error("JSON parse error:", field);
    return [];
  }
};

/* ============================================================
   CREATE RESTAURANT
   ============================================================ */
restaurantRouter.post(
  "/",
  restaurantUploader.array("photos", 5),
  async (req, res) => {
    try {
      const { name, location, openTime, closeTime, description } = req.body;

      if (!name || !location || !openTime || !closeTime || !description) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      console.log("REQ BODY:", req.body);
      console.log("REQ FILES:", req.files);

      // Store only filenames in DB
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

        photos: photos, // JSON column stores array directly
      });

      res.status(201).json({
        message: "Restaurant saved successfully",
        restaurant: newRestaurant,
      });
    } catch (err) {
      console.error("🔥 SAVE RESTAURANT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ============================================================
   GET ALL RESTAURANTS
   ============================================================ */
restaurantRouter.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();

    const normalizedRestaurants = restaurants.map((r) => {
      const plain = r.toJSON();

      // 🔥 make sure photos is always an array
      let photos = plain.photos;
      if (typeof photos === "string") {
        try {
          photos = JSON.parse(photos);
        } catch {
          photos = [];
        }
      }
      if (!Array.isArray(photos)) photos = [];

      plain.photos = photos.map(
        (filename) => `/uploads/restaurants/${filename}`
      );

      plain.isOpen = isRestaurantOpen(plain.openTime, plain.closeTime);

      return plain;
    });

    res.status(200).json({ data: normalizedRestaurants });
  } catch (err) {
    console.error("GET RESTAURANTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
/* ============================================================
   GET SINGLE RESTAURANT
   ============================================================ */
restaurantRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurantId: id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const plain = restaurant.toJSON();

    plain.photos = (plain.photos || []).map(
      (filename) => `/uploads/restaurants/${filename}`
    );

    plain.isOpen = isRestaurantOpen(plain.openTime, plain.closeTime);

    res.status(200).json({ data: plain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   DELETE RESTAURANT
   ============================================================ */
restaurantRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurantId: id },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Delete images from uploads folder
    const photos = restaurant.photos || [];
    photos.forEach((filename) => {
      const filePath = path.join("uploads", "restaurants", filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Failed to delete image:", filePath, err);
      }
    });

    await restaurant.destroy();

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default restaurantRouter;
