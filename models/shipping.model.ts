import { model, Schema, Model, Mongoose } from "mongoose";
import { IShipping } from "../types/shipping";
//import { model, Schema, Model, Mongoose } from "mongoose";

const ShippingSchema: Schema<IShipping> = new Schema(
  {
    userId: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
    },
    companyName: { type: String, trim: true },
    buyerUserId: { type: String, trim: true },
    buyerFirstName: { type: String, trim: true },
    buyerLastName: { type: String, trim: true },
    buyerAddressLine1: { type: String, trim: true },
    buyerAddressLine2: { type: String, trim: true },
    buyerCountry: { type: String, trim: true },
    buyerCity: { type: String, trim: true },
    buyerState: { type: String, trim: true },
    buyerZipCode: { type: String, trim: true },
    buyerCompanyName: { type: String, trim: true },
    buyerPhoneNumber: { type: String, trim: true },
    buyerEmail: {
      type: String,
      trim: true,
    },
    imageType: { data: Buffer, contentType: String },
    length: { type: Number, trim: true },
    height: { type: Number, trim: true },
    width: { type: Number, trim: true },
    dimensionsUOM: { type: String, trim: true },
    weight: { type: Number, trim: true },
    weightUOM: { type: Number, required: false },
    mailingDate: { type: Date, required: false },
    trackingNumber: { type: String, trim: true },
    isLabelGenerated: { type: Boolean, trim: true, default:false},
    orderId: { type: String, trim: true },

  },
  {
    timestamps: true,
  }
);

const Shipping: Model<IShipping> = model("Shipping", ShippingSchema);

export default Shipping;
