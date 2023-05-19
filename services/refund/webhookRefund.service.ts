import PaypalRefund from "../../models/paypalRefund";
import Refund from "../../models/refund.model";

export const webhookRefundService = async (refund: any): Promise<any[]> => {
  try {
    await Refund.findOneAndUpdate(
      { RefundID: refund.id },
      { $set: { ...refund } }
    );
    return [null, { received: true }];
  } catch (e) {
    return [];
  }
};

export const paypalWebhookRefundService = async (refund: any): Promise<any[]> => {
  try {
    await PaypalRefund.findOneAndUpdate(
      { RefundID: refund.id },
      { $set: { ...refund } }
    );
    return [null, ];
  } catch (e) {
    return [];
  }
};
