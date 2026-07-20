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
      <h1>Reset Password</h1>

      <p>
      Click the link below.
      </p>

      <a href="${resetLink}">
      Reset Password
      </a>
    `;
};