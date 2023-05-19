import { model, Schema, Model } from "mongoose";
import { IProductPrices } from "../types/productPrices";

const ProductPricesSchema: Schema<IProductPrices> = new Schema(
  {
    StripeProductId: { type: String, require: true },
    StripePriceId: { type: String, require: true },
    price: { type: String },
    interval: {
      type: String,
      enum: ["monthly", "yearly", "quarterly", "biweekly", "weekly"]
    },
    currency: { type: String }
  },

);


const ProductPrices: Model<any> = model("productPrices", ProductPricesSchema);

export default ProductPrices;
