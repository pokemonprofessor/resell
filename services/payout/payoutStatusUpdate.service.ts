import { Payout } from "../../models/payout.model";
import { PayoutStatus } from "../../utils/enums";

export const webhookPayoutStatusUpdate = async (payout: any): Promise<void> => {
  try {
    await Payout.findOneAndUpdate(
      { payoutID: payout.id },
      { PayoutStatus: PayoutStatus[payout.status] }
    );
  } catch (e) {
    return null;
  }
};
