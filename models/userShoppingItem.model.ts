import { model, Schema, Model } from "mongoose";
import { IUserItem } from "../types/userItem";

const UserShoppingItemSchema: Schema<IUserItem> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "BuyableProduct",
      required: true,
    },
    quantity: { type: Number, default: 1, required: true },
    total: { type: Number },
    type: {
      type: String,
      enum: ["cart", "wishlist"],
      default: "cart",
      required: true,
    },
    wishListType: { type: String },
    saveForLater: { type: Boolean, default: false },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserShoppingItem: Model<IUserItem> = model(
  "UserShoppingItem",
  UserShoppingItemSchema
);

export default UserShoppingItem;
