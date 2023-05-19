import moment from "moment";

export interface IVerificationEmail extends Document {
  email : string;
  otp : number;
}
