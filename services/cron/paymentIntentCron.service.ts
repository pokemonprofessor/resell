// @ts-nocheck
import Stripe from "stripe";
import config from "../../config";
import PaymentIntent from "../../models/paymentIntent.model";
import { PaymentIntentStatus, PaymentType } from "../../utils/enums";
import { createOrderService } from "../orders/createOrder.service";
import {
  updateOrderStatusFailed,
  updateOrderStatusSuccess,
} from "../payment/createPayment.service";
const { Order } = require("../../models/order.model");
const secretkey = config.get("stripeSecretKey");
const stripe = new Stripe(secretkey, {
  apiVersion: "2020-03-02"
});

export const paymentIntentCron = async () => {
  try {
    const paymentIntents = await PaymentIntent.find({
      paymentIntentStatus:
        PaymentIntentStatus.requires_payment_method ||
        PaymentIntentStatus.requires_action ||
        PaymentIntentStatus.processing,
    });
    if (paymentIntents.length > 0) {
      for (const each of paymentIntents) {
        try {
          const { id, status } = await stripe.paymentIntents.retrieve(
            each.paymentIntentID
          );
          await PaymentIntent.findOneAndUpdate(
            { paymentIntentID: id },
            {
              paymentIntentStatus: PaymentIntentStatus[status],
            }
          );
          await handlePaymentIntentStatus(id, status, PaymentType.STRIPE);
        } catch (e) {
          continue;
        }
      }
    }
  } catch (e) {}
};

const handlePaymentIntentStatus = async (
  paymentIntentID: string,
  paymentIntentStatus: string,
  paymentType: string
) => {
  try {
    const order = await Order.findOne({
      PaymentIntentID: paymentIntentID,
    });
    switch (paymentIntentStatus) {
      case PaymentIntentStatus.processing:
        if (!order) createOrderService(paymentIntentID, paymentType);
        break;
      case PaymentIntentStatus.succeeded:
        if (order) await updateOrderStatusSuccess(paymentIntentID);
        else await createOrderService(paymentIntentID, paymentType);
        break;
      case PaymentIntentStatus.canceled:
        if (order) await updateOrderStatusFailed(paymentIntentID);
        break;
      default:
    }
  } catch (e) {
    return [];
  }
};
