import { model, Schema, Model } from "mongoose";
import { IPayment } from "../types/payment";
import { IPaymentIntent } from "../types/paymentIntent";

const PaymentIntentSchema: Schema<IPaymentIntent> = new Schema(
  {
    paymentIntentID: { type: String, required: true, trim: true },
    paymentIntentStatus: {
      type: String,
      enum: [
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "processing",
        "succeeded",
        "canceled",
        "payment_failed", // webhook
      ],
      default: "requires_payment_method",
      required: true,
    },
    clientSecretKey: { type: String, required: true, trim: true },
    ChargeID: { type: String },
    subscriptionId: { type: String, default:null },
    meta: { type: Array },
  },
  {
    timestamps: true,
  }
);

const PaymentIntent: Model<IPaymentIntent> = model(
  "PaymentIntent",
  PaymentIntentSchema
);

export default PaymentIntent;
