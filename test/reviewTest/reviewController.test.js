// test/reviewTest/reviewController.test.js
import { jest } from "@jest/globals";

// Mock Review, User, Restaurant, ReviewLike
jest.unstable_mockModule("../../Model/associations.js", () => ({
  Review: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  User: {},
  Restaurant: {},
  ReviewLike: {
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
}));

const { Review } = await import("../../Model/associations.js");
const reviewController = await import("../../Controller/reviewController.js");

// Mock Express response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Review Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should add a review", async () => {
    const req = {
      body: {
        restaurantId: 1,
        userId: 2,
        username: "tester",
        title: "Great place",
        text: "Really enjoyed it",
        ratings: { taste: 5, service: 4 },
        totalRating: 4.5,
      },
      files: [],
    };
    const res = mockResponse();

    Review.create.mockResolvedValue(req.body);

    await reviewController.addReview(req, res);

    expect(Review.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: req.body })
    );
  });

  it("should get all reviews by restaurant", async () => {
    const req = { params: { restaurantId: 1 }, query: {} };
    const res = mockResponse();

    const mockReviews = [
      {
        toJSON: () => ({
          reviewId: 1,
          restaurantId: 1,
          userId: 2,
          title: "Great",
          text: "Loved it",
          photos: [],
          ReviewLikes: [],
          user: { username: "tester", profile_image: null },
        }),
      },
    ];

    Review.findAll.mockResolvedValue(mockReviews);

    await reviewController.getReviewsByRestaurant(req, res);

    expect(Review.findAll).toHaveBeenCalledWith(
      expect.objectContaining({ where: { restaurantId: 1, isHidden: false } })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ restaurantId: 1, title: "Great" }),
        ]),
      })
    );
  });

  it("should get review by ID", async () => {
    const req = { params: { id: 1 }, query: { userId: 2 } };
    const res = mockResponse();

    const mockReview = { reviewId: 1, userId: 2, toJSON: () => ({ reviewId: 1 }) };
    Review.findOne.mockResolvedValue(mockReview);

    await reviewController.getReviewById(req, res);

    expect(Review.findOne).toHaveBeenCalledWith({ where: { reviewId: 1 } });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: mockReview }));
  });

  it("should update a review", async () => {
    const req = {
      params: { id: 1 },
      body: { title: "Updated", text: "Updated text", ratings: { taste: 5 }, photos: [] },
      files: [],
    };
    const res = mockResponse();

    Review.update.mockResolvedValue([1]); // rows updated
    Review.findByPk.mockResolvedValue({ reviewId: 1, title: "Updated" });

    await reviewController.updateReview(req, res);

    expect(Review.update).toHaveBeenCalled();
    expect(Review.findByPk).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: "Review updated",
      data: { reviewId: 1, title: "Updated" },
    }));
  });

  it("should report a review", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    Review.update.mockResolvedValue([1]); // rows updated

    await reviewController.reportReview(req, res);

    expect(Review.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Review reported successfully ✅",
    }));
  });
});
