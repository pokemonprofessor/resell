import { core, payments } from "@paypal/checkout-server-sdk";
import config from "../../config";
import Payment from "../../models/payment.model";
import Refund from "../../models/refund.model";

const clientId = config.get("paypalClientID");
const clientSecret = config.get("paypalClientSecret");

const production = false;
/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */

const client = () => {
  return new core.PayPalHttpClient(
    production
      ? new core.SandboxEnvironment(clientId, clientSecret)
      : new core.LiveEnvironment(clientId, clientSecret)
  );
};

export const paypalRefund = async (refundRequest: any): Promise<any[]> => {
  try {
    //TODO: add amount to refund from seller channel api
    const request = new payments.CapturesRefundRequest(refundRequest.captureId);
    const payment = await Payment.findOne({ captureID: refundRequest.captureId });
    request.requestBody({
      amount: {
        currency_code: "USD",
        value: refundRequest.amount.toString(),
      },
    });
    try {
      const refund = await client().execute(request);
      if (refund) {
        const refundObj = new Refund({
          RefundID: refund.id,
          ...refund,
        });
        await refundObj.save();
        return refund.id;
        // return [
        //   null,
        //   { message: "Your refund is processing started. Wait for 5-10 days" },
        // ];
      }  
    } catch (err) {
      return [{}, null];
    }

    return [null, {}];
  } catch (error) {
    return [{}, null];
  }
};
