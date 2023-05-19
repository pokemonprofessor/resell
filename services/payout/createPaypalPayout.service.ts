import { PayoutItemInfo, PaypalPayout } from "../../models/paypalPayout";
import { IPaypalPayout } from "../../types/paypalPayout";

export const webhookCreatePaypalPayout = async (
  webhookEvent: any
): Promise<any[]> => {
  try {
    const batchDetail = webhookEvent?.batch_header;
    const payoutBatch = await PaypalPayout.findOneAndUpdate(
      { payout_batch_id: batchDetail.payout_batch_id },
      { batch_status: batchDetail.batch_status }
    );

    // if (payoutBatch) {
    //   PaypalPayout.updateOne({});
    // } else {
    // @@ Order detail need to achive
    //   PaypalPayout.create({
    //     payout_batch_id: batchDetail.payout_batch_id,
    //     time_created: batchDetail.time_created,
    //     sender_batch_header: batchDetail.sender_batch_header,
    //     items: webhookEvent?.items,
    //     batch_status: batchDetail.batch_status,
    //     meta: {
    //       ...batchDetail.amount,
    //       ...batchDetail.fees,
    //     },
    //   });
    // }
    return [null, {}];
  } catch (error) {
    return [{}, null];
  }
};

export const webhookCreatePaypalPayoutPerItem = async (
  webhookEvent: any
): Promise<any[]> => {
  try {
    const payoutBatchId = webhookEvent.payout_batch_id;
    const payout = await PaypalPayout.findOne({
      payout_batch_id: payoutBatchId,
    });
    if (payout) {
      const items: any[] = payout.items;
      for (const item of items) {
        if (item?.payout_item_id === webhookEvent.payout_item_id) {
          const final = [
            {
              transaction_status: webhookEvent.transaction_status,
              ...item,
            },
            ...items,
          ];
          // now set this final variable as final items
          break;
        }
      }
    }
    return [null, {}];
  } catch (error) {
    return [{}, null];
  }
};
