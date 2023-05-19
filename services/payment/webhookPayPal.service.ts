import axios from "axios";
import paypal from "paypal-rest-sdk";
import config from "../../config";
import QueryString from "qs";
import { ERRORS } from "../../utils/errors";
import {
  webhookCreatePaypalPayment, webhookUpdateOrderIntentStatus,
} from "./createPayment.service";
import {
  webhookCreatePaypalPayout,
  webhookCreatePaypalPayoutPerItem,
} from "../payout/createPaypalPayout.service";
import { webhookSellerOnboardingCompleted } from "./onSellerBoarding.service";

const webhookId = config.get("paypalWebhookID");
const clientId = config.get("paypalClientID");
const clientSecret = config.get("paypalClientSecret");
const PAYPAL_API_URL = config.get("paypalServiceUrl");

paypal.configure({
  client_id: clientId,
  client_secret: clientSecret,
  mode: config.get("env") === "production" ? "live" : "sandbox",
});

export const acknowledgeWebhookPaypal = async (
  request,
  response
): Promise<any[]> => {
  try {
    let webhookEvent;

    try {
      const isWebhookVerified = await verifyWebhookSignature(
        request.headers,
        request.body
      );

      if (isWebhookVerified) {
        // TO-DO - check if this is how webhook is received as notification
        webhookEvent = request.body;
      } else {
        response.sendStatus(200);
        return [null, { response }];
      }
    } catch (err) {
      return [{ [ERRORS.BAD_REQUEST]: `Webhook Error: ${err.message}` }, null];
    }

    // Handle the event
    switch (webhookEvent?.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.PENDING":
      case "PAYMENT.CAPTURE.REFUNDED":
      case "PAYMENT.CAPTURE.REVERSED":
        await webhookCreatePaypalPayment(webhookEvent);
        // TO-DO - Add to payment service and shift orders to right status
        break;
      case "PAYMENT.PAYOUTSBATCH.DENIED":
      case "PAYMENT.PAYOUTSBATCH.PROCESSING":
      case "PAYMENT.PAYOUTSBATCH.SUCCESS":
        await webhookCreatePaypalPayout(webhookEvent);
        // TO-DO - Handle payput batch in DB
        break;
      case "PAYMENT.PAYOUTS-ITEM.BLOCKED":
      case "PAYMENT.PAYOUTS-ITEM.CANCELED":
      case "PAYMENT.PAYOUTS-ITEM.DENIED":
      case "PAYMENT.PAYOUTS-ITEM.FAILED":
      case "PAYMENT.PAYOUTS-ITEM.HELD":
      case "PAYMENT.PAYOUTS-ITEM.REFUNDED":
      case "PAYMENT.PAYOUTS-ITEM.RETURNED":
      case "PAYMENT.PAYOUTS-ITEM.SUCCEEDED":
      case "PAYMENT.PAYOUTS-ITEM.UNCLAIMED":
        // TO-DO - add changes to payout table for specific payout-item based on payout_item_id
        await webhookCreatePaypalPayoutPerItem(webhookEvent);
        break;
      case "MERCHANT.ONBOARDING.COMPLETED":
        // TO-DO - add changes to seller table
        await webhookSellerOnboardingCompleted(webhookEvent);
        break;
      case "CHECKOUT.ORDER.COMPLETED":
      case "CHECKOUT.ORDER.APPROVED":
      case "CHECKOUT.ORDER.PROCESSED":
        await webhookUpdateOrderIntentStatus(webhookEvent)
        break;
      case "PAYMENT.ORDER.CREATED":
      case "PAYMENT.ORDER.CANCELLED":
        break;
      // ... handle other event types

      default:
        console.log(`Unhandled event type ${webhookEvent?.event_type?.name}`);
    }

    // Return a response to acknowledge receipt of the event
    response.sendStatus(200);

    return [null, { response }];
  } catch (error) {
    return [];
  }
};

// function to check if webhook signature is correct / middleware

const getPaypalAuthToken = () => {
  const auth =
    "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64");
  return auth;
};

const getPaypalAccessToken = async () => {
  try {
    const URL = PAYPAL_API_URL;

    const header = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `${getPaypalAuthToken()}`,
    };

    const request = QueryString.stringify({
      grant_type: "client_credentials",
    });

    let response = null;
    await axios
      .post(`${URL}/oauth2/token`, request, {
        headers: header,
      })
      .then((res) => (response = res.data));

    if (response) return response;
  } catch (e) {
    return null;
  }
};

const verifyWebhookSignature = async (headers, webhookEvent) => {
  try {
    const token = await getPaypalAccessToken();
    if (token) {
      const webhookHeaders = {
        authorization: `${token?.token_type} ${token?.access_token}`,
        "content-type": "application/json",
        auth_algo: headers["PAYPAL-AUTH-ALGO"],
        cert_url: headers["PAYPAL-CERT-URL"],
        transmission_id: headers["PAYPAL-TRANSMISSION-ID"],
        transmission_time: headers["PAYPAL-TRANSMISSION-TIME"],
        transmission_sig: headers["PAYPAL-TRANSMISSION-SIG"],
      };

      const webhookSignature = new paypal.notification.webhookEvent.verify(
        webhookHeaders,
        webhookEvent,
        webhookId,
        (error, response) => {
          if (error?.message) {
            // TO-DO- Error handling in verification
            return false;
          } else if ((response.verification_status = "SUCCESS")) {
            // TO-DO - Redirect the user to getting the webhook event and handling it
            return true;
          } else if ((response.verification_status = "FAILURE")) {
            // TO-DO - handle webhook signature verification failure
            return false;
          } else {
            return false;
          }
        }
      );
      return webhookSignature;
    }
    return null;
  } catch (error) {
    console.log("Error: ", error);
  }
};
