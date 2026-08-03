export const welcomeTemplate = (
  name: string
) => {
  return `
      <h1>Welcome ${name}!</h1>

      <p>
      Thank you for joining our Food Delivery App.
      </p>

      <p>
      Happy Ordering!
      </p>
    `;
};


export const forgotPasswordTemplate = (
  resetLink: string
) => {
  return `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #f97316;">Reset your Foodie password</h1>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; border-radius: 8px; background: #f97316; color: white; padding: 12px 20px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes and can only be used once.</p>
        <p>If you did not request this change, you can safely ignore this email.</p>
      </div>
    `;
};

export const emailVerificationOtpTemplate = (otp: string) => {
  return `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #f97316;">Verify your Foodie email</h1>
        <p>Enter this one-time password on the Foodie verification page:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">
          ${otp}
        </p>
        <p>This OTP expires in 10 minutes and can only be used once.</p>
        <p>Foodie will never ask you to send this OTP by phone or text message.</p>
        <p>If you did not create this account, you can safely ignore this email.</p>
      </div>
    `;
};
