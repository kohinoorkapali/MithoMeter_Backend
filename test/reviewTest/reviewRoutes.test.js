// test/reviewTest/reviewRoutes.test.js
import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// create dummy app
const app = express();
app.use(express.json());

// mock review controller
const reviewController = {
  addReview: jest.fn((req, res) =>
    res.status(201).json({
      success: true,
      data: req.body,
    })
  ),

  getReviewsByRestaurant: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      data: [
        {
          reviewId: 1,
          restaurantId: Number(req.params.restaurantId),
          title: "Great place",
        },
      ],
    })
  ),

  getReviewsByUser: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      data: [
        {
          reviewId: 1,
          userId: Number(req.params.userId),
          title: "Nice food",
        },
      ],
    })
  ),
};

// attach routes
app.post("/api/reviews", reviewController.addReview);
app.get(
  "/api/reviews/restaurant/:restaurantId",
  reviewController.getReviewsByRestaurant
);
app.get("/api/reviews/user/:userId", reviewController.getReviewsByUser);

// tests
describe("Basic Review Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add a review", async () => {
    const dummyReview = {
      restaurantId: 1,
      userId: 2,
      username: "tester",
      title: "Great place",
      text: "Really enjoyed it",
      ratings: { taste: 5, service: 4 },
      totalRating: 4.5,
    };

    const res = await request(app).post("/api/reviews").send(dummyReview);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject(dummyReview);
    expect(reviewController.addReview).toHaveBeenCalled();
  });

  it("should get reviews by restaurant", async () => {
    const res = await request(app).get("/api/reviews/restaurant/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0]).toHaveProperty("restaurantId", 1);
    expect(reviewController.getReviewsByRestaurant).toHaveBeenCalled();
  });

  it("should get reviews by user", async () => {
    const res = await request(app).get("/api/reviews/user/2");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0]).toHaveProperty("userId", 2);
    expect(reviewController.getReviewsByUser).toHaveBeenCalled();
  });
});
