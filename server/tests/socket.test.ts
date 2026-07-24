import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { FRONTEND_URL, JWT_SECRET } from "../src/config/env";
import { isAllowedFrontendOrigin } from "../src/config/cors";
import User from "../src/models/user";
import {
  authenticateSocketToken,
  getSocketRooms,
} from "../src/socket";

describe("Socket.IO authentication and room authorization", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects a connection without a JWT", async () => {
    await expect(authenticateSocketToken()).rejects.toMatchObject({
      message: "Authentication required",
      data: { code: "AUTH_REQUIRED" },
    });
  });

  it("rejects an expired JWT", async () => {
    const token = jwt.sign({ id: new mongoose.Types.ObjectId().toString() }, JWT_SECRET, {
      expiresIn: -1,
    });

    await expect(authenticateSocketToken(token)).rejects.toMatchObject({
      data: { code: "TOKEN_EXPIRED" },
    });
  });

  it("uses the database role and only returns the authenticated user's room", async () => {
    const userId = new mongoose.Types.ObjectId();
    jest.spyOn(User, "findById").mockResolvedValue({
      _id: userId,
      role: "customer",
    } as never);
    const token = jwt.sign({ id: userId.toString() }, JWT_SECRET);

    const auth = await authenticateSocketToken(token);

    expect(getSocketRooms(auth)).toEqual([`user:${userId.toString()}`]);
    expect(getSocketRooms(auth)).not.toContain("admin");
  });

  it("adds the admin room only when the database role is admin", async () => {
    const userId = new mongoose.Types.ObjectId();
    jest.spyOn(User, "findById").mockResolvedValue({
      _id: userId,
      role: "admin",
    } as never);
    const token = jwt.sign({ id: userId.toString() }, JWT_SECRET);

    const auth = await authenticateSocketToken(token);

    expect(getSocketRooms(auth)).toEqual([
      `user:${userId.toString()}`,
      "admin",
    ]);
  });

  it("accepts local development and only the configured production origin", () => {
    expect(isAllowedFrontendOrigin("http://localhost:5173")).toBe(true);
    if (FRONTEND_URL) expect(isAllowedFrontendOrigin(FRONTEND_URL)).toBe(true);
    expect(isAllowedFrontendOrigin("https://unconfigured-preview.vercel.app")).toBe(false);
    expect(isAllowedFrontendOrigin("http://foodie.vercel.app")).toBe(false);
    expect(isAllowedFrontendOrigin("https://vercel.app.attacker.example")).toBe(false);
  });
});
