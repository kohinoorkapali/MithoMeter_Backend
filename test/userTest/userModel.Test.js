import SequelizeMock from "sequelize-mock";
const dbMock = new SequelizeMock();

const UserMock = dbMock.define("User", {
  id: 1,
  fullname: "Menuka",
  username: "menuka01",
  email: "menuka@gmail.com",
  password: "Menuka@123",
  role: "user",
  status: "active",
});

describe("User Mock Model", () => {

  it("should create user", async () => {

    const user = await UserMock.create({
      fullname: "Menuka",
      username: "menuka01",
      email: "menuka@gmail.com",
      password: "Menuka@123",
    });

    expect(user.fullname).toBe("Menuka");
    expect(user.username).toBe("menuka01");
    expect(user.email).toBe("menuka@gmail.com");
    expect(user.password).toBe("Menuka@123");
    expect(user.role).toBe("user");
    expect(user.status).toBe("active");
  });

});
