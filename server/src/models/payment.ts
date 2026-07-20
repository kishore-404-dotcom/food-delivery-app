import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number;
  paymentId: string;
  paymentMethod: "DUMMY" | "RAZORPAY";
  status: "PENDING" | "SUCCESS" | "FAILED";
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

    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["DUMMY", "RAZORPAY"],
      default: "DUMMY",
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
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