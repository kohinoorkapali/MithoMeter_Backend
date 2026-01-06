import express from "express";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";


import "./Model/restaurantModel.js";
import "./Model/userModel.js";
import restaurantRouter from "./Routes/restaurantRoutes.js";

const app = express();

connection();

app.use(express.json());


app.use("/api/users", userRouter);

app.use ("/api/restaurants", restaurantRouter)

app.get("/", (req, res) => {
  res.send("User API is running");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
