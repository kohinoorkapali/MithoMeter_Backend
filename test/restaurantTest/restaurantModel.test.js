import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

// Mock Restaurant model
const RestaurantMock = dbMock.define("Restaurant", {
  restaurantId: 1,
  name: "Default Name",
  location: "Default Location",
  cuisines: [],
  priceRange: [],
  openTime: "10:00",
  closeTime: "22:00",
  description: "Default description",
  moods: [],
  features: [],
  photos: [],
  websiteLink: null,
  menuLink: null,
});

describe("Restaurant Mock Model", () => {
  it("should create restaurant", async () => {
    const restaurant = await RestaurantMock.create({
      name: "Test Restaurant",
      location: "Kathmandu",
      cuisines: ["Nepali", "Indian"],
      priceRange: ["$", "$$"],
      openTime: "10:00",
      closeTime: "22:00",
      description: "A cozy place",
      websiteLink: "https://test.com",
      menuLink: "https://test.com/menu",
      moods: ["Family", "Romantic"],
      features: ["WiFi", "Parking"],
      photos: ["img1.jpg", "img2.jpg"],
    });

    expect(restaurant.name).toBe("Test Restaurant");
    expect(restaurant.location).toBe("Kathmandu");
    expect(restaurant.cuisines).toEqual(["Nepali", "Indian"]);
    expect(restaurant.photos).toEqual(["img1.jpg", "img2.jpg"]);
    expect(restaurant.websiteLink).toBe("https://test.com");
    expect(restaurant.menuLink).toBe("https://test.com/menu");
  });
});
