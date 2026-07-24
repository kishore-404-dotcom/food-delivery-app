import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod: "RAZORPAY";
  status: "PENDING" | "SUCCESS" | "FAILED" | "ABANDONED";
  failureReason?: string;
  verifiedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    paymentId: {
      type: String,
      sparse: true,
    },

    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      sparse: true,
      unique: true,
    },

    paymentMethod: {
      type: String,
      enum: ["RAZORPAY"],
      default: "RAZORPAY",
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "ABANDONED"],
      default: "PENDING",
    },

    failureReason: {
      type: String,
      maxlength: 500,
    },

    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

paymentSchema.index({ user: 1 });

paymentSchema.index({ order: 1 });

paymentSchema.index({ status: 1 });

paymentSchema.index({ paymentMethod: 1 });

paymentSchema.index({ createdAt: -1 });

export default mongoose.model<IPayment>(
  "Payment",
  paymentSchema
);
