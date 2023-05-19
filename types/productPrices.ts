export interface IProductPrices extends Document {
  StripeProductId: string;
  StripePriceId: string;
  price: string;
  interval: string;
  currency: string;
}
