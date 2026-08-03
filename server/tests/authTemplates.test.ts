import { describe, expect, it } from "@jest/globals";

import { forgotPasswordTemplate } from "../src/templates/authTemplates";

describe("forgot password template", () => {
  it("includes the reset URL and expiry information", () => {
    const resetUrl = "https://foodie.example/reset-password?token=test";
    const html = forgotPasswordTemplate(resetUrl);

    expect(html).toContain(resetUrl);
    expect(html).toContain("expires in 15 minutes");
  });
});
