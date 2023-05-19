import { ObjectId } from "mongoose";

export interface IOrder extends IOrderMeta {
  ID: string,
  Status: string,
  SellerId: string,
  PaymentMethod: string,
  PaymentTransactionID: string,
  PaymentIntentID: string;
  ChargeID: string;
}

export interface IOrderMeta extends Document {
  TempOrderID: string,
  OrderStatus: string,
  OrderPaymentStatus: string,
  OrderDateUtc: string,
  UserID: ObjectId,
  BuyerAddress: string,
  ShippingAddress: string,
  RequestedShippingMethod: string,
  DeliverByDateUtc: string,
  ShippingLabelURL: string,
  TotalPrice: number,
  TotalTaxPrice: number,
  TotalShippingPrice: number,
  TotalShippingTaxPrice: number,
  TotalGiftOptionTaxPrice: number,
  TotalGiftOptionPrice: number,
  TotalOrderDiscount: number,
  TotalShippingDiscount: number,
  OtherFees: number,
  Currency: string, b
  VatInclusive: Boolean,
  Items: Array<Object>,
  SpecialInstructions: string,
  PrivateNotes: string,
  PaymentMethod: string,
  PaymentIntentID: string;
  SiteSourceID: string,
  SecondaryOrderID: string,
  Tags: Array<string>,
  FacilitatedTax: string,
  MustShipByDateUTC: string,
  DcCode: string
  subscriptionId: string,
  TotalPaysferAmount: number,
  TotalStripeFee: number,
  TotalSellerAmount: number,
  checkoutId: string,
}
