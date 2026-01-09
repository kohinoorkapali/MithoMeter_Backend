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
  origin: "http://localhost:5175",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));

// parse JSON bodies
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));


// DB connection
connection()
  .then(async () => {
    console.log("Database connected");
    await createAdminIfNotExists();
  })
  .catch((err) => console.error("DB connection failed:", err));

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);

// Landing page
app.get("/", (req, res) => res.send("User API is running"));

app.listen(5000, () => console.log("Server running on port 5000"));
