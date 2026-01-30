import express from "express";
import { requestPasswordReset, resetPassword } from "../Controller/forgotController.js";

export const forgotRouter = express.Router();

forgotRouter.post("/forgot-password", requestPasswordReset);
forgotRouter.post("/reset-password", resetPassword);
