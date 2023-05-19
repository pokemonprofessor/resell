export interface IPaypalRefund extends Document {
  RefundID: string;
  captureID: string;
  status: string;
  status_details: Object;
  invoice_id: number;
  amount: string;
  currency: string;
  create_time: string;
  update_time: string;
  note_to_payer: string;
  OrderID: string;
  Notes: String;
}
