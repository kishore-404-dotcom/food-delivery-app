import dotenv from "dotenv";

dotenv.config({ quiet: true });

const readRequired = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = Number(process.env.PORT || 5000);
export const JWT_SECRET = process.env.JWT_SECRET?.trim() || "";
export const MONGODB_URI = process.env.MONGODB_URI?.trim() || "";
export const FRONTEND_URL = process.env.FRONTEND_URL?.trim() || "";
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY?.trim() || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim() || "";
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID?.trim() || "";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
export const EMAIL_USER = process.env.EMAIL_USER?.trim() || "";
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD?.trim() || "";
export const MAIL_HOST = process.env.MAIL_HOST?.trim() || "";
export const MAIL_PORT = Number(process.env.MAIL_PORT || 587);
export const MAIL_SECURE = process.env.MAIL_SECURE === "true";
export const REDIS_URL = process.env.REDIS_URL?.trim() || "";

export const validateEnvironment = (): void => {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  readRequired("MONGODB_URI");
  readRequired("JWT_SECRET");

  if (JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }

  if (NODE_ENV === "production") {
    [
      "FRONTEND_URL",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
      "RAZORPAY_KEY_ID",
      "RAZORPAY_KEY_SECRET",
      "MAIL_HOST",
      "MAIL_PORT",
      "EMAIL_USER",
      "EMAIL_PASSWORD",
    ].forEach(readRequired);

    const frontend = new URL(FRONTEND_URL);
    if (frontend.protocol !== "https:") {
      throw new Error("FRONTEND_URL must use HTTPS in production");
    }
  }
};
