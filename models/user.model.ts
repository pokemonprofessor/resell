import { model, Schema, Model } from "mongoose";
import { IUser } from "../types/user";

const UserSchema: Schema<IUser> = new Schema(
  {
    sellerid: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },
    countryCode: { type: String, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    collegeName: { type: String, trim: true },
    bannerImages: { type: [String], trim: true, default: [] }, // Array of strings
    profileImage: { type: String, trim: true },
    description: { type: String, trim: true },
    nickName: { type: String, trim: true },
    storeName: { type: String, trim: true },
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
    country: { type: String },
    city: { type: String },
    state: { type: String },
    postCode: { type: String },
    governmentId: { type: String },
    sellerId: { type: Number, trim: true },
    stripeAccountId: { type: String, trim: true },
    companyName: { type: String },
    websiteUrl: { type: String },
    termsAndCondition: { type: Boolean },
    role: {
      type: String,
      enum: ["BUYER", "SELLER", "AFFILIATE"],
      default: "BUYER",
    },
    is2FA: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    noOfListings : { type: Number, trim: true , default:0},

  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = model("User", UserSchema);

const subscribeUser: Schema<any> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
export const SubscribeUser: Model<any> = model("subscribeUser", subscribeUser);

export default User;
