import { model, Schema, Model } from "mongoose";
import { IPayment } from "../types/payment";
import { IPaymentIntent } from "../types/paymentIntent";
import { IPaypalOrderIntent } from "../types/paypalOrderIntent";

const PaayPalOrderIntentSchema: Schema<IPaypalOrderIntent> = new Schema(
  {
    orderIntentID: { type: String, required: true, trim: true },
    orderIntentStatus: {
      type: String,
      enum: [
        "CREATED",
        "SAVED",
        "APPROVED",
        "VOIDED",
        "COMPLETED",
        "PAYER_ACTION_REQUIRED",
      ],
      default: "CREATED",
      required: true,
    },
    captureID: { type: String },
    purchase_units: {
      type: Array,
      required: true,
    },
    meta: { type: Array },
  },
  {
    timestamps: true,
  }
);

const PaypalOrderIntent: Model<IPaypalOrderIntent> = model(
  "PayPalOrderIntent",
  PaayPalOrderIntentSchema
);

export default PaypalOrderIntent;
