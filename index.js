import express from "express";
import cors from "cors";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRoutes.js"; 
import restaurantRouter from "./Routes/restaurantRoutes.js";

import { createAdminIfNotExists } from "./Model/createAdmin.js";

import "./Model/restaurantModel.js";
import "./Model/userModel.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(express.json());

connection()
  .then(async () => {
    console.log("Database connected");

    // Ensure admin exists
    await createAdminIfNotExists();
  })
  .catch((err) => console.error("DB connection failed:", err));


// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);

app.get("/", (req, res) => {
  res.send("User API is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
