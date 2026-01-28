// test/reviewTest/reviewRoutes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Dummy Express app
const app = express();
app.use(express.json());

// Mock controller functions for Review
const reviewController = {
  saveReview: jest.fn((req, res) =>
    res.status(201).json({ message: "Review saved successfully" })
  ),
  getAllReviews: jest.fn((req, res) =>
    res.status(200).json([{ reviewId: 1, title: "Great place!" }])
  ),
  getReviewById: jest.fn((req, res) =>
    res.status(200).json({ reviewId: Number(req.params.id), title: "Great place!" })
  ),
  updateReview: jest.fn((req, res) =>
    res.status(200).json({ message: "Review updated successfully", updated: req.body })
  ),
  deleteReview: jest.fn((req, res) =>
    res.status(200).json({ message: "Review deleted successfully" })
  ),
};

// Routes
app.post("/api/reviews", reviewController.saveReview);
app.get("/api/reviews", reviewController.getAllReviews);
app.get("/api/reviews/:id", reviewController.getReviewById);
app.put("/api/reviews/:id", reviewController.updateReview);
app.delete("/api/reviews/:id", reviewController.deleteReview);

// Tests
describe("Review Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create a review", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({ restaurantId: 1, userId: 1, title: "Awesome!", text: "Loved it" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Review saved successfully");
    expect(reviewController.saveReview).toHaveBeenCalled();
  });

  it("should get all reviews", async () => {
    const res = await request(app).get("/api/reviews");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(reviewController.getAllReviews).toHaveBeenCalled();
  });

  it("should get a review by id", async () => {
    const res = await request(app).get("/api/reviews/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reviewId", 1);
    expect(reviewController.getReviewById).toHaveBeenCalled();
  });

  it("should update a review", async () => {
    const res = await request(app)
      .put("/api/reviews/1")
      .send({ title: "Updated review" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Review updated successfully");
    expect(res.body.updated).toHaveProperty("title", "Updated review");
    expect(reviewController.updateReview).toHaveBeenCalled();
  });

  it("should delete a review", async () => {
    const res = await request(app).delete("/api/reviews/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Review deleted successfully");
    expect(reviewController.deleteReview).toHaveBeenCalled();
  });
});
