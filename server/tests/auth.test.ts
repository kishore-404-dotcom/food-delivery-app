import request from "supertest";
import app from "../src/app";
import { describe, it, expect } from '@jest/globals';


describe("Auth API", () => {

  it("Should return 200", async () => {

    const response = await request(app)
      .get("/");

    expect(response.statusCode)
      .toBe(200);

  });

  it("rejects public attempts to register an admin account", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Unsafe Admin",
        email: "unsafe-admin@example.com",
        phone: "9999999999",
        password: "password123",
        role: "admin",
      });

    expect(response.statusCode).toBe(400);
  });

  it("rejects unauthenticated restaurant owner management", async () => {
    const response = await request(app).get("/api/restaurants/mine");
    expect(response.statusCode).toBe(401);
  });

});
