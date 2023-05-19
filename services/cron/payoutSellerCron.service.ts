// @ts-nocheck
import Stripe from "stripe";
import config from "../../config";
import {
  payouts,
  CreatePayoutRequestBody,
  PayoutItem,
  core,
} from "@paypal/payouts-sdk";
import moment from "moment";
import { PaypalPayout } from "../../models/paypalPayout";
import { Order } from "../../models/order.model";
import { OrderPaymentStatus, PaymentType } from "../../utils/enums";
import _, { toInteger } from "lodash";
import Seller from "../../models/seller.model";
import { IBuyableProduct } from "../../types/product";
import { Payout } from "../../models/payout.model";
const stripeSecretKey = config.get("stripeSecretKey");
const paypalClientID = config.get("paypalClientID");
const paypalClientSecret = config.get("paypalClientSecret");

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2020-03-02"
});
// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let paypalEnvironment =
  config.get("env") === "production"
    ? new core.LiveEnvironment(paypalClientID, paypalClientSecret)
    : new core.SandboxEnvironment(paypalClientID, paypalClientSecret);

let client = new core.PayPalHttpClient(paypalEnvironment);

export const payoutSellerStripeCron = async () => {
  try {
    // get success orders of last week & create payout for each seller by totalling amount
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(Date.now() - 21 * 60 * 60 * 24 * 1000),
        $lt: new Date(Date.now() - 14 * 60 * 60 * 24 * 1000),
      },
      OrderPaymentStatus: OrderPaymentStatus.COMPLETED
    });

    for (const order of orders) {
      const { ID, UserID, ChargeID, PaymentIntentID, SellerId, Currency } = order;
      const stripeBalanceObj = await stripe.balance.retrieve();
      const stripeBalance = toInteger(stripeBalanceObj.available[0].amount);
      const sellerDetails = await Seller.findOne({ sellerId: SellerId });

      let amount = 0;
      amount += toInteger(order.TotalSellerAmount * 100);

      if (sellerDetails?.stripeAccountId && ChargeID && stripeBalance >= amount) {
        const orderId = ID;
        const transfer = await stripe.transfers.create({
          amount: amount,
          currency: Currency,
          metadata: {
            chargeId: ChargeID,
            orderId: orderId,
            paymentIntentId: PaymentIntentID,
            userId: UserID.toString(),
          },
          description: `Paysfer OrderNo ${orderId}`,
          destination: sellerDetails.stripeAccountId,
        });

        if (transfer) {
          await Payout.create({
            transferID: transfer.id,
            createdAt: transfer.created,
            PayoutStatus: "paid",
            metadata: transfer.metadata,
            totalAmount: transfer.amount,
            currency: transfer.currency,
            orderDetails: {
              sellerID: SellerId,
              amount: amount,
              orderID: [orderId]
            }
          });
        }

      }

    }
  } catch (e) {
  }
};

const calculateSellerPrice = (price) => {
  return (price / 100) * 91;
};


export const payoutSellerPaypalCron = async () => {
  try {
    const orders = await Order.find({
      timestamp: {
        $gte: new Date(Date.now() - 14 * 60 * 60 * 24 * 1000),
        $lt: new Date(Date.now() - 21 * 60 * 60 * 24 * 1000),
      },
      OrderPaymentStatus: OrderPaymentStatus.COMPLETED,
    });

    const payoutBatchSuffix = moment().format("YYYY-MM-DD");

    const payoutItems: Array<PayoutItem> = [];

    for (const order of orders) {
      const { ID, UserID, ChargeID, Items, SellerId, TotalPrice } = order;
      const items = Items;
      // const sellerItems = _.groupBy(items, "SellerId");
      const orderID = ID;
      const currency = order.Currency;
      const index = 0;
      //  for (const seller of _.keysIn(sellerItems)) {
      const { paypalID } = await Seller.findOne({ _id: SellerId });
      let amount = 0;
      amount += calculateSellerPrice(TotalPrice);
      payoutItems.push({
        recipient_type: "PAYPAL_ID",
        amount: { currency: currency, value: String(amount) },
        note: `Amount worth ${currency}${amount} received  for Order ${orderID}`,
        receiver: paypalID, // unique id of the receiver based on recipient_type
        sender_item_id: `${payoutBatchSuffix}_${index}`, // index is iteration number of items to distinguish each sender_item_id
        recipient_wallet: "PAYPAL",
        notification_language: "en",
      });
      //   }
    }

    const payoutRequestBody: CreatePayoutRequestBody = {
      sender_batch_header: {
        sender_batch_id: `Payouts_${payoutBatchSuffix}`,
        recipient_type: "PAYPAL_ID",
        email_subject: "You have a payout!",
        email_message:
          "You have received a payout! Thanks for using our service!",
      },
      items: payoutItems,
    };

    let createPayout = async () => {
      const payoutRequest = new payouts.PayoutsPostRequest();
      payoutRequest.requestBody(payoutRequestBody);

      let response = await client.execute(payoutRequest);

      await PaypalPayout.create({
        ...response.result?.batch_header,
      });

      const payout_batch_id = response.result?.batch_header.payout_batch_id;

      const getPayoutItemsRequest = new payouts.PayoutsGetRequest(
        payout_batch_id
      );
      getPayoutItemsRequest.page(1);

      let getPayoutItemsDetails = await client.execute(getPayoutItemsRequest);

      await PaypalPayout.findOneAndUpdate(
        { payout_batch_id: payout_batch_id },
        {
          items: getPayoutItemsDetails.result?.items,
        }
      );

      // console.log(`Response: ${JSON.stringify(response)}`);
      // If call returns body in response, you can get the deserialized version from the result attribute of the response.
      // console.log(`Order: ${JSON.stringify(response.result)}`);
    };

    createPayout().then((value) => console.log("value", value)).catch(e => e);
  } catch (e) { }
};
