// @ts-nocheck
import Stripe from "stripe";
import config from "../../config";
import { ERRORS } from "../../utils/errors";
import { updateSellerAccounts } from "./onSellerBoarding.service";

// Set the secret key. Remember to switch to your live secret key in production.
// TO-DO- Getting the stripe secret_key from env variable.
const secretkey = config.get("stripeSecretKey");
const stripe = new Stripe(secretkey, {
  apiVersion: "2020-03-02"
});
// TO-DO- Getting the stripe webhook sign-key from env variable.
const endpointSecret = config.get("stripeConnectWebhookSignKey");

export const acknowledgeWebhookStripeConnect = async (request): Promise<any[]> => {
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
        console.log("================error", err)
      return [{ [ERRORS.BAD_REQUEST]: `Webhook Error: ${err.message}` }, null];
    }

    // Handle the event
    switch (event.type) {
      case "account.updated":
        const account = event.data.object;
        // Occurs whenever a change occured in connected account (i.e Seller Account)
        await updateSellerAccounts(account);
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