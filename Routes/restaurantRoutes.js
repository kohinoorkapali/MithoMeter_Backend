import { deleteById, getAllRestaurants, saveRestaurant } from "../Controller/restaurantController.js";
import express from "express";
import multer from "multer";

const restaurantRouter = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Route: handle text fields + images
restaurantRouter.post(
  "/",
  upload.array("photos", 5), // field name MUST be "photos"
  saveRestaurant
);


restaurantRouter.get("/", getAllRestaurants);


restaurantRouter.delete("/:id", deleteById);

export default restaurantRouter;
