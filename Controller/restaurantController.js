import { Restaurant } from "../Model/restaurantModel.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";

const parseJSONField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  try {
    return JSON.parse(field);
  } catch (error) {
    console.error("JSON parse error:", field);
    return [];
  }
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
  const {
    cuisine,
    ratings,
    price,
    mood,
    amenities,
    open
  } = req.body;

  try {
    let where = {};

    if (cuisine?.length) where.cuisine = cuisine;
    if (ratings?.length) where.rating = ratings;
    if (price?.length) where.price = price;
    if (mood?.length) where.mood = mood;
    if (open?.length) where.status = open;

    if (amenities?.length) {
      where.amenities = {
        $in: amenities
      };
    }

    const restaurants = await Restaurant.findAll({
      where
    });

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
