const userController = require("../../Controller/userController.js");
const { User } = require("../../Model/associations.js");

// ===============================
// MOCKS
// ===============================

jest.mock("../../Model/associations.js", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

// ===============================
// HELPER: MOCK RESPONSE
// ===============================

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

// ===============================
// TESTS
// ===============================

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================
  // SAVE USER
  // ===========================

  it("should save a new user", async () => {
    const req = {
      body: {
        fullname: "Menuka Rai",
        username: "menuka01",
        email: "menuka@gmail.com",
        password: "12345",
      },
    };

    const res = mockResponse();

    User.create.mockResolvedValue(req.body);

    await userController.save(req, res);

    expect(User.create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User saved successfully",
      })
    );
  });

  it("should fail if fields are missing", async () => {
    const req = {
      body: {
        fullname: "Menuka",
      },
    };

    const res = mockResponse();

    await userController.save(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.send).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  // ===========================
  // GET BY ID
  // ===========================

  it("should get user by id", async () => {
    const req = {
      params: { id: 1 },
    };

    const res = mockResponse();

    User.findOne.mockResolvedValue({
      id: 1,
      username: "menuka01",
    });

    await userController.getById(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if user not found", async () => {
    const req = {
      params: { id: 10 },
    };

    const res = mockResponse();

    User.findOne.mockResolvedValue(null);

    await userController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.send).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  // ===========================
  // UPDATE BY ID
  // ===========================

  it("should update username", async () => {
    const req = {
      params: { id: 1 },
      body: { username: "newname" },
    };

    const res = mockResponse();

    const mockUser = {
      id: 1,
      username: "oldname",
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);

    await userController.updateById(req, res);

    expect(mockUser.username).toBe("newname");

    expect(mockUser.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ===========================
  // DELETE BY ID
  // ===========================

  it("should delete user", async () => {
    const req = {
      params: { id: 1 },
    };

    const res = mockResponse();

    const mockUser = {
      destroy: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);

    await userController.deleteById(req, res);

    expect(mockUser.destroy).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ===========================
  // UPDATE PROFILE WITH IMAGE
  // ===========================

  it("should update username and image", async () => {
    const req = {
      params: { id: 1 },
      body: { username: "updatedName" },
      file: { filename: "profile.png" },
    };

    const res = mockResponse();

    const mockUser = {
      username: "old",
      profile_image: null,
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);

    await userController.updateProfileWithImage(req, res);

    expect(mockUser.username).toBe("updatedName");

    expect(mockUser.profile_image).toBe("profile.png");

    expect(mockUser.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if user not found (image update)", async () => {
    const req = {
      params: { id: 5 },
    };

    const res = mockResponse();

    User.findOne.mockResolvedValue(null);

    await userController.updateProfileWithImage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.send).toHaveBeenCalledWith({
      message: "User not found",
    });
  });
});
