
import { model, Model, Schema } from "mongoose";
import { IPayout, OrderDetail } from "../types/payout";

const PayoutSchema: Schema<IPayout> = new Schema(
  {
    ID: String,
    payoutID: String,
    transferID: String,
    orderDetails: {
      type: Object,
      required: true,
    },
    currency: String,
    totalAmount: Number,
    PayoutStatus: {
      type: String,
      enum: ["paid", "pending", "in_transit", "canceled", "failed"],
      default: "pending",
    },
    createdAt: Number,
    metadata: Object,
  },
  {
    timestamps: true,
  }
);

const Payout: Model<IPayout> = model("Payout", PayoutSchema);

export { Payout };

