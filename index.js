import express from "express";
import cors from "cors";
import { connection } from "./Database/db.js";
import { userRouter } from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRoutes.js"; 

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));


connection();

app.use(express.json());


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("User API is running");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
