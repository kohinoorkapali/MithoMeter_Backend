import { saveRestaurant } from "../Controller/restaurantController.js";
import express from "express";


const restaurantRouter = express.Router();

restaurantRouter.post("/", saveRestaurant);

export default restaurantRouter;