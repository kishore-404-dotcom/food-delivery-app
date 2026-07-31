import rateLimit from "express-rate-limit";



// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});



// Login limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});



// Payment limiter
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    success: false,
    message:
      "Too many payment requests.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
