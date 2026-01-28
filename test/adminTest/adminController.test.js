import { jest } from "@jest/globals";

/* ===============================
   MOCKS (BEFORE IMPORTS)
================================ */

jest.unstable_mockModule("../../Model/associations.js", () => ({
  Review: {
    count: jest.fn(),
    sum: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  },

  User: {
    count: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  },

  Restaurant: {
    count: jest.fn(),
  },
}));

jest.unstable_mockModule("../../Model/notificationModel.js", () => ({
  Notification: {
    findOrCreate: jest.fn(),
  },
}));

jest.unstable_mockModule("sequelize", () => ({
  Op: {
    or: Symbol("or"),
  },
}));

/* ===============================
   IMPORTS (AFTER MOCKS)
================================ */

const { Review, User, Restaurant } = await import(
  "../../Model/associations.js"
);

const { Notification } = await import(
  "../../Model/notificationModel.js"
);

const adminController = await import(
  "../../Controller/adminController.js"
);

/* ===============================
   HELPER
================================ */

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return res;
};

/* ===============================
   TESTS
================================ */

describe("Admin Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ===========================
     DASHBOARD
  ============================ */

  it("should return analytics", async () => {
    const req = {};
    const res = mockResponse();

    User.count
      .mockResolvedValueOnce(10) // totalUsers
      .mockResolvedValueOnce(7); // activeUsers

    Restaurant.count.mockResolvedValue(5);

    Review.sum.mockResolvedValue(20);

    await adminController.getAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      totalUsers: 10,
      totalRestaurants: 5,
      activeUsers: 7,
      helpfulChecks: 20,
    });
  });

  /* ===========================
     REPORTS
  ============================ */

  it("should get reported reviews", async () => {
    const req = {};
    const res = mockResponse();

    Review.findAll.mockResolvedValue([
      { reviewId: 1 },
      { reviewId: 2 },
    ]);

    await adminController.getReportedReviews(req, res);

    expect(Review.findAll).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith([
      { reviewId: 1 },
      { reviewId: 2 },
    ]);
  });

  it("should approve reported review", async () => {
    const req = {
      params: { id: 1 },
    };

    const res = mockResponse();

    Review.update.mockResolvedValue([1]);

    await adminController.approveReportedReview(req, res);

    expect(Review.update).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: "Review approved",
    });
  });

  it("should return 404 if review not found (approve)", async () => {
    const req = {
      params: { id: 99 },
    };

    const res = mockResponse();

    Review.update.mockResolvedValue([0]);

    await adminController.approveReportedReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete reported review", async () => {
    const req = {
      params: { id: 1 },
    };

    const res = mockResponse();

    Review.findOne.mockResolvedValue({
      reviewId: 1,
      userId: 5,
    });

    Review.update.mockResolvedValue([1]);

    Notification.findOrCreate.mockResolvedValue([{}, true]);

    await adminController.deleteReportedReview(req, res);

    expect(Review.findOne).toHaveBeenCalled();

    expect(Review.update).toHaveBeenCalled();

    expect(Notification.findOrCreate).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: "Review hidden and user notified",
    });
  });

  it("should return 404 if review not found (delete)", async () => {
    const req = {
      params: { id: 10 },
    };

    const res = mockResponse();

    Review.findOne.mockResolvedValue(null);

    await adminController.deleteReportedReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  /* ===========================
     USERS
  ============================ */

  it("should get all users", async () => {
    const req = {};
    const res = mockResponse();

    User.findAll.mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]);

    await adminController.getAll(req, res);

    expect(User.findAll).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should toggle user status", async () => {
    const req = {
      params: { id: 1 },
    };

    const res = mockResponse();

    const mockUser = {
      status: "active",
      update: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);

    await adminController.toggleUserStatus(req, res);

    expect(mockUser.update).toHaveBeenCalledWith({
      status: "banned",
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if user not found (toggle)", async () => {
    const req = {
      params: { id: 10 },
    };

    const res = mockResponse();

    User.findOne.mockResolvedValue(null);

    await adminController.toggleUserStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
