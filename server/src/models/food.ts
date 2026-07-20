import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  restaurant: mongoose.Types.ObjectId;

  averageRating: number;
  totalReviews: number;
}

const foodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Restaurant reference
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // Review Statistics
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
foodSchema.index({ name: "text" });

foodSchema.index({ category: 1 });

foodSchema.index({ restaurant: 1 });

foodSchema.index({ averageRating: -1 });

foodSchema.index({ price: 1 });

foodSchema.index({ createdAt: -1 });

export default mongoose.model<IFood>(
  "Food",
  foodSchema
);