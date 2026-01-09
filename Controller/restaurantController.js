import { Restaurant } from "../Model/restaurantModel.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";

export const saveRestaurant = async (req, res) => {
  console.log("➡️ saveRestaurant controller hit");
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
      return res.status(400).send({
        message: "Required fields are missing",
      });
    }

    console.log("BODY:", req.body);

    console.log("CREATE PAYLOAD:", {
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
    });

    const restaurant = await Restaurant.create({
      name,
      location,
      cuisines: cuisines || [],
      priceRange: priceRange || [],
      openTime,
      closeTime,
      description,
      websiteLink,
      menuLink,
      moods: moods || [],
      features: features || [],
      photos: req.files ? req.files.map((file) => file.path) : [],
      //adminId: req.user.id, // admin who created it
    });

    res.status(201).send({
      data: restaurant,
      message: "Restaurant saved successfully",
    });
  } catch (e) {
    res.status(500).send({
      message: e.message,
    });
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
