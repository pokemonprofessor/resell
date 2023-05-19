import { model, Schema, Model } from "mongoose";
import { IOrder, IOrderMeta } from "../types/order";

const OrderSchema: Schema<IOrder> = new Schema(
{
    ID: { type: String, required: true, trim: true },
    UserID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    OrderPaymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
      required: true,
    },
    OrderStatus: {
      type: String,
      enum: [
        "Pending",
        "AcknowledgedBySeller",
        "Delivered",
        "Shipped",
        "Cancelled",
      ],
      default: "Pending",
      required: true,
    },
    sellerUserId: { type: String, required: true },    // sellerUserId of the product
    PaymentMethod: { type: String },
    PaymentType: { type: String },
    PaymentIntentID: { type: String },
    ChargeID: { type: String },
    PaypalOrderID: { type: String },
    CaptureID: { type: String },
    OrderDateUtc: { type: Date, required: true, trim: true },
    BuyerAddress: { type: Schema.Types.ObjectId, ref: "Address" },
    ShippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    RequestedShippingMethod: {
      type: String,
      default: "Standard",
      required: true,
      trim: true,
    },
    DeliverByDateUtc: { type: String, trim: true },
    ShippingLabelURL: { type: String, trim: true },
    Currency: { type: String, default: "USD", required: true, trim: true },
    TotalPrice: { type: Number, required: true },
    TotalPaysferAmount: { type: Number, default: 0.0, required: true, trim: true },
    TotalStripeFee: { type: Number, default: 0.0, required: true, trim: true },
    TotalSellerAmount: { type: Number, required: true, trim: true },
    TotalTaxPrice: { type: Number, default: 0.0, required: true, trim: true },
    TotalShippingPrice: {
      type: Number,
      default: 0.0,
      required: true,
      trim: true,
    },
    TotalShippingTaxPrice: {
      type: Number,
      default: 0.0,
      required: true,
      trim: true,
    },
    TotalGiftOptionPrice: {
      type: Number,
      default: 0.0,
      required: true,
      trim: true,
    },
    TotalGiftOptionTaxPrice: {
      type: Number,
      default: 0.0,
      required: true,
      trim: true,
    },
    Items: { type: Array },
    PaymentTransactionID: { type: String },
    RefundID: { type: String },
    subscriptionId: { type: String, default: null },
    checkoutId: { type: String, default: null },
    trackingNumber: { type: String, trim: true },
    isLabelGenerated: { type: Boolean, trim: true, default:false},
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = model("Order", OrderSchema);

//export { Order };

export default Order;
