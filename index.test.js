const request = require("supertest");
// express app
const app = require("./index");

// db setup
const { sequelize, Dog } = require("./db");
const seed = require("./db/seedFn");
const { dogs } = require("./db/seedData");

describe("Endpoints", () => {
  // to be used in POST test
  const testDogData = {
    breed: "Poodle",
    name: "Sasha",
    color: "black",
    description:
      "Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
  };

  beforeAll(async () => {
    // rebuild db before the test suite runs
    await seed();
  });

  describe("GET /dogs", () => {
    it("should return list of dogs with correct data", async () => {
      // make a request
      const response = await request(app).get("/dogs");
      // assert a response code
      expect(response.status).toBe(200);
      // expect a response
      expect(response.body).toBeDefined();
      // toEqual checks deep equality in objects
      expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
    });
  });

  describe("POST /dogs", () => {
    it("should create a new dog entry with data sent", async () => {
      const response = await request(app)
        .post("/dogs")
        .send(testDogData)
        .expect(200);
      // partial object checkign using expect.objectContaining
      expect(response.body).toEqual(expect.objectContaining(testDogData));
    });
  });

  describe("DELETE /dogs/:id", () => {
    it("should return with not found message when id is not found", async () => {
      const response = await request(app).delete("/dogs/-1").expect(404);
      expect(response.text).toBe("Dog with id -1 not found");
    });

    it("should return with success message when deletion is successful", async () => {
      const response = await request(app).delete("/dogs/1").expect(200);
      expect(response.text).toBe("deleted dog with id 1");
    });
  });
});
