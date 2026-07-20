import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ICoupon extends Document {
  code: string;

  discountType:
    | "flat"
    | "percentage";

  discountValue: number;

  minOrderAmount: number;

  expiryDate: Date;

  isActive: boolean;
}

const couponSchema =
  new Schema<ICoupon>(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      discountType: {
        type: String,
        enum: [
          "flat",
          "percentage",
        ],
        required: true,
      },

      discountValue: {
        type: Number,
        required: true,
      },

      minOrderAmount: {
        type: Number,
        default: 0,
      },

      expiryDate: {
        type: Date,
        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ICoupon>(
  "Coupon",
  couponSchema
);