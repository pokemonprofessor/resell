import { model, Schema, Model, SchemaTypes } from "mongoose";
import { IEmailOtp } from "../types/emailOtp";

const EmailOtpSchema: Schema<IEmailOtp> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const EmailOtp: Model<IEmailOtp> = model("EmailOtp", EmailOtpSchema);

export default EmailOtp;
