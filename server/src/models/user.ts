import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "customer" | "restaurant_owner" | "admin";
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  emailVerificationOtpHash?: string;
  emailVerificationOtpExpires?: Date;
  emailVerificationAttempts: number;
  emailVerificationLastSentAt?: Date;
  restaurantStatus?: "pending" | "approved" | "rejected";
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  passwordChangedAt?: Date;
  authVersion: number;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "restaurant_owner", "admin"],
      default: "customer",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
    },

    emailVerificationOtpHash: {
      type: String,
      select: false,
    },

    emailVerificationOtpExpires: {
      type: Date,
      select: false,
    },

    emailVerificationAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    emailVerificationLastSentAt: {
      type: Date,
      select: false,
    },

    restaurantStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: function () {
        return this.role === "restaurant_owner";
      },
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },

    authVersion: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
