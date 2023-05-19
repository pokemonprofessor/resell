import { ObjectId } from "mongoose";

export interface IEmailOtp extends Document {
  userId: ObjectId;
  email: string;
  otp: number;
  createdAt?: Date;
}
