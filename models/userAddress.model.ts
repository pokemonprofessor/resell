import { model, Schema, Model } from "mongoose";
import { IOrder } from "../types/order";
import { IAddress } from "../types/address";

const AddressSchema: Schema<IAddress> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    EmailAddress: { type: String, required: true, trim: true },
    FirstName: { type: String, required: true, trim: true },
    LastName: { type: String, required: true, trim: true },
    AddressLine1: { type: String, required: true, trim: true },
    City: { type: String, required: true, trim: true },
    Country: { type: String, required: true, trim: true },
    PostalCode: { type: String, required: true, trim: true },
    StateOrProvince: { type: String, required: true },
    AddressLine2: { type: String },
    CompanyName: { type: String },
    DaytimePhone: { type: String },
    EveningPhone: { type: String },
    NameSuffix: { type: String },
    AddressType: {
      type: String,
      enum: ["home", "office"],
      default: "home",
      required: true,
    },
    Default: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Address: Model<IAddress> = model("Address", AddressSchema);

export default Address;
