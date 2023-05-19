export interface ICheckout extends Document {
  checkoutId: string;
  paymentStatus: string;
  checkoutStatus: string;
  checkoutMode: string;
  currency: string;
  paymentIntentID: string;
  subscriptionId: string;
  totalTaxPrice: number;
  meta: string;
}
