export interface IRefund extends Document {
  RefundID: string;
  PaymentIntentID: string;
  ChargeID: string;
  OrderID: string;
  amount: number;
  reason: string;
  receipt_number: string;
  status: string;
  Notes: string;
  description: string;
  failure_reason: string;
}
