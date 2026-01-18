import { Restaurant } from "../Model/restaurantModel.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";
import { Op } from "sequelize"; 

const parseJSONField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  const str = field.trim();

  // If it's a JSON array, parse it
  if (str.startsWith("[")) {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error("JSON parse error:", field);
      return [];
    }
  }

  // Otherwise, treat it as comma-separated string
  return str.split(",").map(s => s.trim());
};

export const saveRestaurant = async (req, res) => {
  try {
    const {
      name,
      location,
      cuisines,
      priceRange,
      openTime,
      closeTime,
      description,
      websiteLink,
      menuLink,
      moods,
      features,
    } = req.body;

    if (!name || !location || !openTime || !closeTime || !description) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    console.log("REQ BODY:", req.body);
console.log("REQ FILES:", req.files);


    const restaurant = await Restaurant.create({
      name,
      location,
      cuisines: parseJSONField(cuisines),
      priceRange: parseJSONField(priceRange),
      openTime,
      closeTime,
      description,
      websiteLink,
      menuLink,
      moods: parseJSONField(moods),
      features: parseJSONField(features),
      photos: req.files?.map((file) => file.path) || [],
    });

    res.status(201).json({
      data: restaurant,
      message: "Restaurant saved successfully",
    });
  } catch (e) {
    console.error("🔥 SAVE RESTAURANT ERROR:", e);
    res.status(500).json({ message: e.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();

    const updatedRestaurants = restaurants.map(r => {
      const restaurant = r.toJSON(); // Sequelize instance → plain object

      return {
        ...restaurant,
        isOpen: isRestaurantOpen(
          restaurant.openTime,
          restaurant.closeTime
        )
      };
    });

    res.status(200).send({
      data: updatedRestaurants,
      message: "Restaurants retrieved successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({ where: { restaurantId: id } });

    if (!restaurant) {
      return res.status(404).send({
        message: "Restaurant not found",
      });
    }

    await restaurant.destroy();

    res.status(200).send({
      message: "Restaurant deleted successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};


export const filterRestaurants = async (req, res) => {
  const { cuisine = [], ratings = [], price = [], mood = [], amenities = [], open = [] } = req.body;

  try {
    // Step 1: fetch all restaurants (or filter normal columns like rating/status)
    let where = {};

    if (ratings.length) where.rating = ratings; // normal column
    if (open.length) where.status = open;      // normal column

    const restaurants = await Restaurant.findAll({ where });

    // Step 2: filter JSON/text fields in JS
    const filtered = restaurants.filter(r => {
      // parse the JSON strings safely
      const rCuisines = parseJSONField(r.cuisines);
const rMoods = parseJSONField(r.moods);
const rFeatures = parseJSONField(r.features);
const rPrice = parseJSONField(r.priceRange);


      // check if any of the filter values exist in the restaurant fields
      const cuisineMatch = cuisine.length === 0 || cuisine.some(c => rCuisines.includes(c));
      const moodMatch = mood.length === 0 || mood.some(m => rMoods.includes(m));
      const featuresMatch = amenities.length === 0 || amenities.some(a => rFeatures.includes(a));
      const priceMatch = price.length === 0 || price.some(p => rPrice.includes(p));

      return cuisineMatch && moodMatch && featuresMatch && priceMatch;
    });

    res.status(200).json({ data: filtered });
  } catch (error) {
    console.error("FILTER RESTAURANTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

