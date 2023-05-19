import { model, Schema, Model } from "mongoose";
import { IPayment } from "../types/payment";

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    PaymentIntentID: { type: String, require: true },
    ChargeID: { type: String },
    UUID: { type: String, require: true },
    OrderID: { type: String },
    UserID: { type: String, require: true },
    amount: { type: Number, required: true },
    application_fee_amount: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "REFUNDED", "FAILED"],
      default: "COMPLETED",
    },
    Norms: { type: String },
  },
  {
    timestamps: true,
  }
);

const Payment: Model<IPayment> = model("Payment", PaymentSchema);

export default Payment;
