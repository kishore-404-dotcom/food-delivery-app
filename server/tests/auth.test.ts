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

});