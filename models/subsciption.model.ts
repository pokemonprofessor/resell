import { model, Schema, Model } from "mongoose";
import { ISubscription } from "../types/subscription";

const SubscriptionSchema: Schema<ISubscription> = new Schema({
  subscriptionId: { type: String, require: true },
  stripeAccountId: { type: String, require: true },
  userId: { type: String, require: true },
  priceId: { type: String },
  quantity: { type: Number },
  currentPeriodStart: { type: Number, require: true },
  currentPeriodEnd: { type: Number, require: true },
  status: {
    type: String,
    enum: [
      "incomplete",
      "incomplete_expired",
      "trialing",
      "active",
      "past_due",
      "canceled",
      "unpaid",
      "all",
      "end",
    ],
    default: "incomplete",
  },
});

const Subscription: Model<ISubscription> = model(
  "Subscription",
  SubscriptionSchema
);

export default Subscription;
