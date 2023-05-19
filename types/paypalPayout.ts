export interface IPaypalPayout extends Document {
  payout_batch_id: String;
  batch_status: String;
  time_created: String;
  sender_batch_header: Object;
  items: Object[];
  orderDetails: Object;
  metadata: Object;
}
