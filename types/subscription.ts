export interface ISubscription extends Document {
  subscriptionId: string;
  stripeAccountId: string;
  userId: string;
  priceId:string;
  status: string;
  quantity: number;
  currentPeriodStart: number;
  currentPeriodEnd: number;
}
