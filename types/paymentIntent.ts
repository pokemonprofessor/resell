export interface IPaymentIntent extends Document {
  paymentIntentID: string;
  paymentIntentStatus: string;
  chargeID: string;
  meta: Array<object>;
  subscriptionId: string;
}
