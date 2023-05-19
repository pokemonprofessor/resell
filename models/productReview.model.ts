import { model, Schema, Model } from "mongoose";
import { IProductReview } from "../types/productReview";

const ProductReviewSchema: Schema<IProductReview> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "BuyableProduct" },
    title: { type: String, required: true },
    review: { type: String, trim: true },
    rating: { type: Number, required: true },
    img: { type: String, required: false },
    upvote: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const ProductReview: Model<IProductReview> = model(
  "ProductReview",
  ProductReviewSchema
);

export default ProductReview;
