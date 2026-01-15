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

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: { restaurantId: id },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      data: restaurant,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateRestaurantById = async (req, res) => {
  console.log(" PATCH HIT");
  console.log(" BODY:", req.body);
  console.log(" FILES:", req.files);

  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Not found" });
    }
        
    // Existing photos
    let existingPhotos = [];
    if (req.body.existingPhotos) {
      existingPhotos = JSON.parse(req.body.existingPhotos).map(p =>
        p.replace(/\\/g, "/").replace(/^.*\/uploads\//, "uploads/")
      );
    }

    // New uploads
    let newPhotos = [];
    if (req.files?.length) {
      newPhotos = req.files.map(file =>
        file.path
          .replace(/\\/g, "/")
          .replace(/^.*\/uploads\//, "uploads/")
      );
    }

    // Merge photos
    restaurant.photos = [...existingPhotos, ...newPhotos];

    // Update other fields
    restaurant.name = req.body.name;
    restaurant.location = req.body.location;
    restaurant.openTime = req.body.openTime;
    restaurant.closeTime = req.body.closeTime;
    restaurant.description = req.body.description;
    restaurant.websiteLink = req.body.websiteLink;
    restaurant.menuLink = req.body.menuLink;

    restaurant.cuisines = JSON.parse(req.body.cuisines);
    restaurant.priceRange = JSON.parse(req.body.priceRange);
    restaurant.moods = JSON.parse(req.body.moods);
    restaurant.features = JSON.parse(req.body.features);

    console.log("FINAL PHOTOS TO SAVE:", restaurant.photos);

    await restaurant.save();

    res.json({ message: "Restaurant updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
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