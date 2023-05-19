// @ts-nocheck
import Stripe from "stripe";
import config from "../../config";
import { ERRORS } from "../../utils/errors";
import { webhookPayoutStatusUpdate } from "../payout/payoutStatusUpdate.service";
import { webhookRefundService } from "../refund/webhookRefund.service";
import {
  CheckoutCompleted,
  invoicePaid,
  webhookPaymentIntentProcessing,
  webhookPaymentIntentStatusUpdate,
} from "./createPayment.service";
import { updateSellerAccounts } from "./onSellerBoarding.service";

// Set the secret key. Remember to switch to your live secret key in production.
// TO-DO- Getting the stripe secret_key from env variable.
const secretkey = config.get("stripeSecretKey");
const stripe = new Stripe(secretkey, {
  apiVersion: "2020-03-02"
});
// TO-DO- Getting the stripe webhook sign-key from env variable.
const endpointSecret = config.get("stripeWebhookSignKey");

export const acknowledgeWebhookStripe = async (request): Promise<any[]> => {
  try {
    const sig = request.headers["stripe-signature"];

    let event;
    console.log("==================================>success", request.body);

    try {
      event = await stripe.webhooks.constructEvent(
        request.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      return [{ [ERRORS.BAD_REQUEST]: `Webhook Error: ${err.message}` }, null];
    }

    // Handle the event
    switch (event.type) {
      case "account.updated":
        const account = event.data.object;
        // Occurs whenever a change occured in connected account (i.e Seller Account)
        await updateSellerAccounts(account);
        break;
      case "charge.refunded":
        const charge = event.data.object;
        // Occurs whenever a charge is refunded, including partial refunds.
        break;
      case "charge.dispute.funds_reinstated":
        const dispute = event.data.object;
        // Occurs when funds are reinstated to your account after a dispute is closed
        break;
      case "charge.refund.updated":
        const refund = event.data.object;
        // Occurs whenever a refund is updated, on selected payment methods.
        await webhookRefundService(refund);
        break;
      case "payment_intent.payment_failed":
        const paymentIntentFailed = event.data.object;
        // Occurs when a PaymentIntent is canceled.
        break;
      case "payment_intent.requires_payment_method":
      case "payment_intent.requires_action":
        const paymentIntentInitial = event.data.object;
        await webhookPaymentIntentStatusUpdate(paymentIntentInitial);
        break;
      case "payment_intent.processing":
        const paymentIntent = event.data.object;
        await webhookPaymentIntentProcessing(paymentIntent);
        // create order object (after 10 sec delay)
        // Occurs when a PaymentIntent is in processing.
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceed = event.data.object;
        await webhookPaymentIntentStatusUpdate(paymentIntentSucceed);
        // update order object SUCCESS
        // Occurs when a PaymentIntent has successfully completed payment.
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        await webhookPaymentIntentStatusUpdate(paymentIntentCanceled);
        // update order object FAILURE
        // Occurs when a PaymentIntent has successfully completed payment.
        break;
      case "review.closed":
        const review = event.data.object;
        // Occurs whenever a review is closed. The review's reason field indicates why: approved, disputed, refunded, or refunded_as_fraud.
        break;
      case "payout.updated":
      case "payout.paid":
      case "payout.failed":
      case "payout.created":
        const payout = event.data.object;
        await webhookPayoutStatusUpdate(payout);
        break;
      // subscription event
      case "invoice.paid":
        const invoicePaidObj = event.data.object;
        invoicePaid(invoicePaidObj);
        break;
      case "checkout.session.completed":
        const checkoutObj = event.data.object;
        CheckoutCompleted(checkoutObj);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event

    return [null, { received: true }];
  } catch (error) {
    return [];
  }
};
