"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordTemplate = exports.welcomeTemplate = void 0;
const welcomeTemplate = (name) => {
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
exports.welcomeTemplate = welcomeTemplate;
const forgotPasswordTemplate = (resetLink) => {
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
exports.forgotPasswordTemplate = forgotPasswordTemplate;
