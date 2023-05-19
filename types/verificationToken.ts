import moment from "moment";

export interface IVerificationToken extends Document {
  userId : string;
  token : string;
  expiryTime : moment.Moment;
}
