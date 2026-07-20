import dotenv from "dotenv";

dotenv.config();

export const PORT =
  process.env.PORT || 5000;

export const JWT_SECRET =
  process.env.JWT_SECRET!;

export const MONGODB_URI =
  process.env.MONGODB_URI!;

export const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME!;

export const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY!;

export const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET!;

export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID!;

export const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET!;

  export const EMAIL_USER =
  process.env.EMAIL_USER!;

export const EMAIL_PASSWORD =
  process.env.EMAIL_PASSWORD!;

export const MAIL_HOST =
  process.env.MAIL_HOST!;

export const MAIL_PORT =
  Number(process.env.MAIL_PORT);

export const MAIL_SECURE =
  process.env.MAIL_SECURE === "true";

export const REDIS_URL =
process.env.REDIS_URL!;