export interface IPayout extends Document {
  orderDetails: OrderDetail;
  transferID: string;
  totalAmount: number;
  currency: string;
  PayoutStatus: string;
  payoutID: string;
  payout: Object;
  createdAt: number;
  metadata: Object;
}

export interface OrderDetail extends Document {
  sellerID: string;
  amount: number;
  orderID: string[];
}
