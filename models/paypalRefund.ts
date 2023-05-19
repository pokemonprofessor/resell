import { model, Schema, Model } from "mongoose";
import { IPaypalRefund } from "../types/paypalRefund";

const PaypalRefundSchema: Schema<IPaypalRefund> = new Schema(
  {
    RefundID: { type: String, require: true, trim: true }, // The PayPal-generated ID for the refund.
    captureID: { type: String }, // The PayPal-generated ID for the captured payment.
    status: {
      type: String,
      enum: ["CANCELLED", "PENDING", "COMPLETED"],
    }, // The status of the refund.
    status_details: { type: Object }, // The details of the refund status.
    invoice_id: { type: String }, // The API caller-provided external invoice number for this order.
    amount: { type: Number }, // The amount that the payee refunded to the payer.
    currency: { type: String },
    create_time: { type: String }, // The date and time when the transaction occurred
    update_time: { type: String }, // The date and time when the transaction was last updated
    note_to_payer: { type: String }, // The reason for the refund. Appears in both the payer's transaction history and the emails that the payer receives.
    OrderID: { type: String },
    Notes: { type: String },
    email: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const PaypalRefund: Model<IPaypalRefund> = model(
  "PaypalRefund",
  PaypalRefundSchema
);

export default PaypalRefund;
