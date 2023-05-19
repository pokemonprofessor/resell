import { model, Schema, Model } from "mongoose";
import { ICheckout } from "../types/checkout";


const CheckoutSchema: Schema<ICheckout> = new Schema(
  {
    checkoutId: { type: String, required: true, trim: true },
    paymentStatus: {
      type: String,
      enum: [
        "paid",
        "unpaid",
        "no_payment_required"
      ],
      default: "unpaid",
      required: true,
    },
    checkoutStatus: {
      type: String,
      enum: [
        "open",
        "complete",
        "expired"
      ],
      default: "open",
      required: true,
    },
    checkoutMode: {
      type: String,
      enum: [
        "payment",
        "setup",
        "subscription"
      ],
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentIntentID: { type: String, default: null },
    subscriptionId: { type: String, default: null },
    meta: { type: Array },
    totalTaxPrice: { type: Number, default: 0.0 },
  },
  {
    timestamps: true,
  }
);

const Checkout: Model<ICheckout> = model(
  "Checkout",
  CheckoutSchema
);

export default Checkout;
