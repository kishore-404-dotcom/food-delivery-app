import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;

  fullName: string;

  phone: string;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;

  landmark?: string;

  addressType:
    | "HOME"
    | "WORK"
    | "OTHER";

  isDefault: boolean;
}

const addressSchema =
  new Schema<IAddress>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },

      landmark: {
        type: String,
        default: "",
        trim: true,
      },

      addressType: {
        type: String,
        enum: [
          "HOME",
          "WORK",
          "OTHER",
        ],
        default: "HOME",
      },

      isDefault: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

// Indexes
addressSchema.index({
  user: 1,
});

addressSchema.index({
  city: 1,
});

addressSchema.index({
  state: 1,
});

addressSchema.index({
  postalCode: 1,
});

addressSchema.index({
  isDefault: 1,
});

addressSchema.index({
  createdAt: -1,
});

export default mongoose.model<IAddress>(
  "Address",
  addressSchema
);