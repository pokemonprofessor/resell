import { model, Schema, Model } from "mongoose";
import { IPaypalPayment } from "../types/paypalPayment";

const PaypalPaymentSchema: Schema<IPaypalPayment> = new Schema(
  {
    UUID: { type: String, require: true },
    orderIntentID: { type: String, require: true },
    captureID: { type: String, require: true }, // The PayPal-generated ID for the captured payment.
    OrderID: { type: String },
    UserID: { type: String, require: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    create_time: { type: String }, // The date and time when the transaction occurred
    update_time: { type: String }, // The date and time when the transaction was last updated
    status: {
      type: String,
      enum: [
        "COMPLETED",
        "DECLINED",
        "PENDING",
        "FAILED",
        "PARTIALLY_REFUNDED",
        "REFUNDED",
      ],
      default: "COMPLETED",
    }, // The status of the captured payment
    status_details: { type: String }, // The details of the captured payment status.
  },
  {
    timestamps: true,
  }
);

const PaypalPayment: Model<IPaypalPayment> = model(
  "PaypalPayment",
  PaypalPaymentSchema
);

export default PaypalPayment;
