import { describe, expect, it } from "@jest/globals";

import { emailVerificationOtpTemplate } from "../src/templates/authTemplates";

describe("email verification template", () => {
  it("includes the email OTP and states that it is not sent by SMS", () => {
    const html = emailVerificationOtpTemplate("123456");

    expect(html).toContain("123456");
    expect(html).toContain("expires in 10 minutes");
    expect(html).toContain("never ask you to send this OTP by phone or text message");
  });
});
