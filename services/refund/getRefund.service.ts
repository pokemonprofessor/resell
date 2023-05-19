import Refund from "../../models/refund.model";
import { ERRORS } from "../../utils/errors";
import { RefundStatus } from "../../utils/enums";
import config from "../../config";

const secretkey = config.get("stripeSecretKey");
const stripe = require("stripe")(secretkey);

export const getRefundService = async (refundID: string): Promise<any[]> => {
  try {
    const refundObj = await Refund.findOne({ RefundID: refundID });
    const refund = await stripe.refunds.retrieve(refundID);
    if (refund) {
      if (RefundStatus[refund.status] !== refundObj.status) {
        Refund.updateOne(
          { RefundID: refundID },
          { $set: { state: RefundStatus[refund.status] } }
        );
        return [null, { message: "Refund status updated." }];
      }
    }
    return [null, { message: "Refund status  not updated yet." }];
  } catch (error) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while getting the refund status." + error.message,
      },
      null,
    ];
  }
};
