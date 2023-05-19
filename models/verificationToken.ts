import { model, Schema, Model } from "mongoose";
import { IVerificationToken } from "../types/verificationToken";

const VerificationTokenSchema : Schema<IVerificationToken> = new Schema ({
  userId : { type : String, required : true, unique: true, trim: true },
  token : { type : String, required : true, unique: true, trim: true },
  expiryTime : { type : Date, required : true, trim: true},
  },
  {
    timestamps : true
  }
);

const VerificationToken: Model<IVerificationToken> = model('VerificationToken', VerificationTokenSchema);

export default VerificationToken;
