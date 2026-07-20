import request from "supertest";
import app from "../src/app";


describe("Auth API", () => {

  it("Should return 200", async () => {

    const response = await request(app)
      .get("/");

    expect(response.statusCode)
      .toBe(200);

  });

});