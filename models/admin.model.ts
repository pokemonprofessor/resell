import { model, Schema, Model } from "mongoose";
import { IAdmin } from "../types/admin";

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN"],
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

const Admin: Model<IAdmin> = model("Admin", AdminSchema);

export default Admin;
