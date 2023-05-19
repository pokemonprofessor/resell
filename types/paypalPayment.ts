export interface IPaypalPayment extends Document {
  orderIntentID: string;
  captureID: string;
  UUID: string;
  OrderID: string;
  UserID: string;
  amount: number;
  currency: string;
  status: string;
  status_details: string;
  update_time: string;
  create_time: string;
}
