import { model, Schema, Model } from "mongoose";
import { IVerificationEmail } from "../types/verificationEmail";

const VerificationEmailSchema : Schema<IVerificationEmail> = new Schema ({
  email : { type : String, required : true, unique: true, trim: true },
  otp : { type : Number, required : true, unique: true, trim: true },
  },
  {
    timestamps : true
  }
);

const VerificationEmail: Model<IVerificationEmail> = model('VerificationEmail', VerificationEmailSchema);

export default VerificationEmail;
