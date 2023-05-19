export interface IPaypalOrderIntent extends Document {
  orderIntentID: string;
  orderIntentStatus: string;
  captureID: string;
  purchase_units: Array<Object>;
  meta: Array<Object>;
}
