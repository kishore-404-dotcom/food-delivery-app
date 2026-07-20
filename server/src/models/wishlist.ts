import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IWishlistItem {
  food: mongoose.Types.ObjectId;
}

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  items: IWishlistItem[];
}

const wishlistSchema =
  new Schema<IWishlist>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      items: [
        {
          food: {
            type: Schema.Types.ObjectId,
            ref: "Food",
            required: true,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IWishlist>(
  "Wishlist",
  wishlistSchema
);