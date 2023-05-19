import { model, Schema, Model } from "mongoose";
import {IBuyableProduct } from "../types/product";
const BuyableProductSchema: Schema<IBuyableProduct> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    productId: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    userId:{ type: String, trim: true },
    userName:{ type: String, trim: true},
    category: { type: String, trim: true },
    taxCode: { type: String, trim: true },
    brand: { type: String, trim: true },
    collegeName: { type: String, trim: true },
    condition: { type: String, trim: true },
    saleprice: { type: Number, trim: true, required: true },
    shippingcoststandard: { type: Number, trim: true},
    shippingcostexpedited: { type: Number, trim: true },
    shippinglength: { type: String, trim: true },
    shippingwidth: { type: String, trim: true },
    shippingheight: { type: String, trim: true },
    shippingweight: { type: String, trim: true },
    productgroupimageurl: { type: [String], trim: true, default: [] }, // Array of strings eg: ["https://imageurlindex1", "https:"imageurlindex2"]
    videourl: { type: [String], trim: true, default: [] }, // Array of strings
    material: { type: String, trim: true }, // Array of strings
    lengthUnit: { type: String, trim: true }, // Array of strings
    widthunit: { type: String, trim: true }, // Array of strings
    price: { type: Number, trim: true, required: true}, // Array of float value  eg: [20.90, 21.30, 33.00 ...]
    color: { type: String}, // Array of strings eg: ["Red", "Blue", "Black"]
    size: {type: String, trim: true},
    Quantity: { type: Number, required: true }, // Array of Numbers eg: [25, 35, 45...]
    ListingStatus: { type: String, required: true}, // Array of strings eg: ["Live", "Live"]
  },
  {
    timestamps: true,
  }
);

const BuyableProduct: Model<IBuyableProduct> = model(
  "BuyableProduct",
  BuyableProductSchema
);

module.exports = { BuyableProduct };

// export default BuyableProduct;
