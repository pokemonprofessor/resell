import config from "../../config";
import Refund from "../../models/refund.model";
import { ERRORS } from "../../utils/errors";

const secretkey = config.get("stripeSecretKey");
const stripe = require("stripe")(secretkey);

export const createRefund = async (refundRequest: any): Promise<any[]> => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: refundRequest.PaymentIntentID,
    //  charge: refundRequest.ChargeID,
      reason: "requested_by_customer",
      amount: parseInt(refundRequest.amount),
      metadata: {
        notes: refundRequest.Notes,
      },
    });
  
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
  } catch (error) {
    console.log("============refund", error)
    return error;
    // return [
    //   {
    //     [ERRORS.BAD_DATA]:
    //       "Error occuring while creating the refund." + error.message,
    //   },
    //   null,
    // ];
  }
};
