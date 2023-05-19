export interface IPayment extends Document {
  PaymentIntentID: string;
  ChargeID: string;
  UUID: string;
  OrderID: string;
  TransactionID: string;
  amount: number;
  Norms: string;
  UserID: string;
  application_fee_amount: number;
  status: string;
}
