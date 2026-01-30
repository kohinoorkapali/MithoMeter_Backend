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

  Review: {},

  Restaurant: {},

  Favorite: {},

  Notification: {},

  ReviewLike: {},

  sequelize: {
    sync: jest.fn(),
    close: jest.fn(),
  },
}));

await jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../security/jwt-utils.js", () => ({
  generateToken: jest.fn(),
}));

/* =======================
   IMPORTS AFTER MOCKS
======================= */

const request = (await import("supertest")).default;
const app = (await import("../../index.js")).default;

const { User } = await import("../../Model/associations.js");
const bcrypt = (await import("bcryptjs")).default;
const { generateToken } = await import("../../security/jwt-utils.js");

/* =======================
   TESTS
======================= */

describe("Auth Routes (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register user", async () => {
    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-pass");

    User.create.mockResolvedValue({
      id: 1,
      email: "test@gmail.com",
      role: "user",

      toJSON() {
        return this;
      },
    });

    generateToken.mockReturnValue("token");

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        fullname: "Test",
        username: "test",
        email: "test@gmail.com",
        password: "1234",
      });

    expect(res.statusCode).toBe(201);
  });

  it("should login user", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "test@gmail.com",
      password: "hashed-pass",
      role: "user",
      status: "active",

      toJSON() {
        return this;
      },
    });

    bcrypt.compare.mockResolvedValue(true);

    generateToken.mockReturnValue("token");

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@gmail.com",
        password: "1234",
      });

    expect(res.statusCode).toBe(200);
  });
});
