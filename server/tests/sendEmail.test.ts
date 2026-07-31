import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const sendMailMock = jest.fn<() => Promise<void>>();

jest.mock("../src/config/mail", () => ({
  __esModule: true,
  default: { sendMail: sendMailMock },
}));

jest.mock("../src/config/env", () => ({
  BREVO_API_KEY: "brevo-test-key",
  EMAIL_FROM: "Foodie <noreply@example.com>",
  EMAIL_USER: "local@example.com",
}));

import sendEmail from "../src/utils/sendEmail";

describe("sendEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the HTTPS email provider when an API key is configured", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ id: "email-id" }), {
        status: 200,
      }));
    global.fetch = fetchMock;

    await sendEmail({
      to: "customer@example.com",
      subject: "Reset Password",
      html: "<p>Reset</p>",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({ method: "POST" })
    );
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("throws when the HTTPS email provider rejects the request", async () => {
    global.fetch = jest
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 401 }));

    await expect(
      sendEmail({
        to: "customer@example.com",
        subject: "Reset Password",
        html: "<p>Reset</p>",
      })
    ).rejects.toThrow("Email provider rejected the request (401)");
  });
});
