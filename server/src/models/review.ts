import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;

  food: mongoose.Types.ObjectId;

  order: mongoose.Types.ObjectId;

  rating: number;

  comment: string;

  isEdited: boolean;
}

const reviewSchema =
  new Schema<IReview>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      food: {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },

      order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },

      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },

      comment: {
        type: String,
        required: true,
        trim: true,
      },

      isEdited: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

// One review per user per food
reviewSchema.index(
  {
    user: 1,
    food: 1,
  },
  {
    unique: true,
  }
);

// Indexes
reviewSchema.index({
  food: 1,
});

reviewSchema.index({
  user: 1,
});

reviewSchema.index({
  order: 1,
});

reviewSchema.index({
  rating: -1,
});

reviewSchema.index({
  createdAt: -1,
});

export default mongoose.model<IReview>(
  "Review",
  reviewSchema
);