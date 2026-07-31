import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../src/config/env", () => ({
  JWT_SECRET: "test-jwt-secret-that-is-at-least-32-characters",
  FRONTEND_URL: "https://foodie.example.com",
}));

jest.mock("../src/services/notificationService", () => ({
  sendForgotPasswordEmail: jest.fn(),
}));

jest.mock("../src/models/user", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

import User from "../src/models/user";
import { sendForgotPasswordEmail } from "../src/services/notificationService";
import {
  requestPasswordResetService,
  resetPasswordService,
} from "../src/services/authService";

const findOneMock = User.findOne as unknown as jest.MockedFunction<
  (...args: unknown[]) => unknown
>;
const findOneAndUpdateMock =
  User.findOneAndUpdate as unknown as jest.MockedFunction<
    (...args: unknown[]) => Promise<unknown>
  >;
const sendResetEmailMock =
  sendForgotPasswordEmail as jest.MockedFunction<
    typeof sendForgotPasswordEmail
  >;

describe("Password reset service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not reveal whether an unknown email exists", async () => {
    findOneMock.mockReturnValue({
      select: jest.fn<() => Promise<null>>().mockResolvedValue(null),
    });

    await expect(
      requestPasswordResetService("missing@example.com")
    ).resolves.toBeUndefined();
    expect(sendResetEmailMock).not.toHaveBeenCalled();
  });

  it("stores only a token hash and emails the raw short-lived token", async () => {
    const user = {
      email: "owner@example.com",
      resetPasswordToken: undefined as string | undefined,
      resetPasswordExpires: undefined as Date | undefined,
      save: jest.fn<() => Promise<void>>().mockResolvedValue(),
    };
    findOneMock.mockReturnValue({
      select: jest.fn<() => Promise<typeof user>>().mockResolvedValue(user),
    });
    sendResetEmailMock.mockResolvedValue(undefined);

    await requestPasswordResetService(user.email);

    expect(user.resetPasswordToken).toMatch(/^[a-f0-9]{64}$/);
    expect(user.resetPasswordExpires?.getTime()).toBeGreaterThan(Date.now());
    expect(sendResetEmailMock).toHaveBeenCalledTimes(1);

    const emailedLink = String(sendResetEmailMock.mock.calls[0][1]);
    const rawToken = new URL(emailedLink).searchParams.get("token");
    expect(rawToken).toMatch(/^[a-f0-9]{64}$/);
    expect(rawToken).not.toBe(user.resetPasswordToken);
  });

  it("rejects an expired or already-used reset token", async () => {
    findOneAndUpdateMock.mockResolvedValue(null);

    await expect(
      resetPasswordService("a".repeat(64), "new-password-123")
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Password reset link is invalid or has expired",
    });
  });

  it("atomically consumes a valid token and invalidates existing sessions", async () => {
    findOneAndUpdateMock.mockResolvedValue({ _id: "user-id" });

    await resetPasswordService("b".repeat(64), "new-password-123");

    expect(findOneAndUpdateMock).toHaveBeenCalledTimes(1);
    const update = findOneAndUpdateMock.mock.calls[0][1] as {
      $inc: { authVersion: number };
      $unset: Record<string, number>;
    };
    expect(update.$inc.authVersion).toBe(1);
    expect(update.$unset).toEqual({
      resetPasswordToken: 1,
      resetPasswordExpires: 1,
    });
  });
});
