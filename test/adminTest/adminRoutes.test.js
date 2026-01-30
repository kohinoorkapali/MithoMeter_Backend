import { jest } from "@jest/globals";

/* =======================
   MOCKS (ESM WAY)
======================= */

await jest.unstable_mockModule("../../Model/associations.js", () => ({
  User: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },

  Review: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    sum: jest.fn(),
  },

  Restaurant: {
    count: jest.fn(),
  },

  Favorite: {
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },

  Notification: {
    findOrCreate: jest.fn(),
  },

  ReviewLike: {},

  sequelize: {
    sync: jest.fn(),
    close: jest.fn(),
  },
}));

/* =======================
   IMPORTS AFTER MOCK
======================= */

const request = (await import("supertest")).default;
const app = (await import("../../index.js")).default;

const { Review, User, Restaurant, Notification } =
  await import("../../Model/associations.js");

/* =======================
   TESTS
======================= */

describe("Admin Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return dashboard analytics", async () => {
    User.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(7);

    Restaurant.count.mockResolvedValue(5);

    Review.sum.mockResolvedValue(20);

    const res = await request(app).get("/api/admin/analytics");

    expect(res.statusCode).toBe(200);
  });

  it("should get reported reviews", async () => {
    Review.findAll.mockResolvedValue([]);

    const res = await request(app).get("/api/admin/reported-reviews");

    expect(res.statusCode).toBe(200);
  });
});
