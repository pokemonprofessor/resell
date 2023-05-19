import { model, Model, Schema } from "mongoose";
import { IPaypalPayout } from "../types/paypalPayout";

interface BatchInfo extends Document {
  sender_batch_id: ""; // A sender-specified ID number. Tracks the payout in an accounting system.
  recipient_type: ""; // The ID type that identifies the recipient of the payment
  email_subject: ""; // The subject line for the email that PayPal sends when payment for a payout item completes
  email_message: ""; // The email message that PayPal sends when the payout item completes. The message is the same for all recipients.
  note: ""; // The payouts and item-level notes are concatenated in the email.
}

interface PayoutItemInfo extends Document {
  payout_item_id: ""; // The ID for the payout item. Viewable when you show details for a payout.
  transaction_id: ""; // The PayPal-generated ID for the transaction.
  activity_id: ""; //  The unique PayPal-generated common ID created to link sender side and receiver side transaction. Used for tracking.
  transaction_status: {
    type: String;
    enum: [
      "SUCCESS",
      "FAILED",
      "PENDING",
      "UNCLAIMED",
      "RETURNED",
      "ONHOLD",
      "BLOCKED",
      "REFUNDED",
      "REVERSED"
    ];
  }; // The transaction status.
  payout_item_fee: Object; // The fee, in U.S. dollars.
  payout_item: {
    recipient_type: {
      type: String;
      enum: ["EMAIL", "PHONE", "PAYPAL_ID"];
      default: "EMAIL";
    };
    amount: {
      currency: string;
      value: string;
    }; // The currency and amount of payout item
    note: string; // The sender-specified note for notifications.
    receiver: string; // The receiver of the payment. Corresponds to the recipient_type value in the request.
    sender_item_id: string; // A sender-specified ID number. Tracks the payout in an accounting system.
    recipient_name: object; // The name of the recipient where money is credited. For UNCLAIMED payments, the recipient name is populated after the payment is claimed.
    recipient_wallet: {
      type: String;
      enum: ["PAYPAL", "VENMO", "RECIPIENT_SELECTED"];
    };
  };
  currency_conversion: object;
  errors_occured: object;
  time_processed: string;
}

const PayoutItemInfoSchema: Schema<PayoutItemInfo> = new Schema({
  payout_item_id: String, // The ID for the payout item. Viewable when you show details for a payout.
  transaction_id: String, // The PayPal-generated ID for the transaction.
  activity_id: String, //  The unique PayPal-generated common ID created to link sender side and receiver side transaction. Used for tracking.
  transaction_status: {
    type: String,
    enum: [
      "SUCCESS",
      "FAILED",
      "PENDING",
      "UNCLAIMED",
      "RETURNED",
      "ONHOLD",
      "BLOCKED",
      "REFUNDED",
      "REVERSED",
    ],
  }, // The transaction status.
  payout_item_fee: Object, // The fee, in U.S. dollars.
  payout_item: {
    recipient_type: {
      type: String,
      enum: ["EMAIL", "PHONE", "PAYPAL_ID"],
      default: "EMAIL",
    },
    amount: {
      currency: String,
      value: String,
    }, // The currency and amount of payout item
    note: String, // The sender-specified note for notifications.
    receiver: String, // The receiver of the payment. Corresponds to the recipient_type value in the request.
    sender_item_id: String, // A sender-specified ID number. Tracks the payout in an accounting system.
    recipient_name: String, // The name of the recipient where money is credited. For UNCLAIMED payments, the recipient name is populated after the payment is claimed.
    recipient_wallet: {
      type: String,
      enum: ["PAYPAL", "VENMO", "RECIPIENT_SELECTED"],
    },
  },
  currency_conversion: Object,
  errors_occured: Object,
  time_processed: String,
});

const PayoutItemInfos: Model<PayoutItemInfo> = model(
  "PayoutItem",
  PayoutItemInfoSchema
);


const PaypalPayoutSchema: Schema<IPaypalPayout> = new Schema(
  {
    payout_batch_id: String, // The PayPal-generated ID for a payout.
    batch_status: {
      type: String,
      enum: ["DENIED", "PENDING", "PROCESSING", "SUCCESS", "CANCELED"],
      default: "DENIED",
    }, // The PayPal-generated payout status. If the payout passes preliminary checks, the status is PENDING.
    time_created: String, // The date and time when processing for the payout began,
    sender_batch_header: Object, // The original payout header, as provided by the payment sender.
    items: Array, // An array of individual items.
    orderDetails: {
      type: Object,
      required: true,
    },
    metadata: Object,
  },
  {
    timestamps: true,
  }
);

const PaypalPayout: Model<IPaypalPayout> = model(
  "PaypalPayout",
  PaypalPayoutSchema
);

export { PaypalPayout, PayoutItemInfo };
