// @ts-nocheck
const { BuyableProduct } = require("../models/product.model");
//import BuyableProduct from "../models/product.model";

import Stripe from "stripe";
import PaymentIntent from "../models/paymentIntent.model";
import UserShoppingItem from "../models/userShoppingItem.model";
import config from "../config";
import moment from "moment";
import { Order } from "../models/order.model";
import { OrderPaymentStatus, OrderStatus } from "./enums";
import { PaysferCutPercent, SmallPaymentFixedCharge, SmallPaymentThreshold, StripeExtraFee, StripeFeePercent } from "./constants";

const secretkey = config.get("stripeSecretKey");
const stripe = new Stripe(secretkey, {
  apiVersion: "2020-03-02"
});
const orderid = require("order-id")("key");

export const getApplicationFee = (orderAmount: number): number => {
  /** TO-DO - Calculate application fee using right percentage value*/
  const applicationFee = (orderAmount * 4) / 100;
  return Math.round(applicationFee * 100);
};

interface productResponseType {
  productData: any;
  totalPrice: any;
  productIds: any;
}

export const getProductDetails = async (
  cartIds: any[],
  id: any
): Promise<productResponseType> => {
  const cartDetails = await UserShoppingItem.find({
    _id: cartIds,
    type: "cart",
  });
  const productIds = cartDetails.map((p: any) => p.productId);
  const productDetails = await BuyableProduct.find(
    { _id: productIds },
    {
      _id: 1,
      userId: 1,
      price: 1,
      saleprice:1,
      title: 1,
      description: 1,
      brand: 1,
      productgroupimageurl: 1,
      Quantity: 1,
    }
  ).lean();

  let totalPrice = cartDetails.reduce((n, { total }) => n + total, 0);

  const productData = await productDetails.map((p: any, i) => {
    const { quantity } = cartDetails.find(
      (obj: any) => obj.productId.toString() === p._id.toString()
    );
   // const index = p.SellerSKU.findIndex((i) => i === productSellerSKU);
    return {
      ID: id + i,
      sellerId: p.userId, // Map userId to sellerID
      productId: p._id,
    //  parentSellerSKU: p.parentSellerSKU,
    //  SellerSKU: productSellerSKU, // selller sku from array of seller sku
      UnitPrice: p.saleprice, // change it to variants price
      Quantity: quantity,
      totalItemPrice: Number((p.saleprice * quantity).toFixed(2)),
      title: p.title,
      description: p.description,
      image: p.productgroupimageurl[0],
      brand: p.brand,
    //  taxCode: p.taxCode,
    };
  });

  return {
    productData,
    totalPrice,
    productIds,
  };
};

interface productByIdResponseType {
  productData: any;
  totalPrice: any;
}
export const getProductDetailsByProductId = async (
  productId: any[],
  quantity: any,
  id: any
): Promise<productByIdResponseType> => {
  // const cartDetails = await UserShoppingItem.find({
  //   _id: cartIds,
  //   type: "cart",
  // });
  // const productIds = cartDetails.map((p: any) => p.productId);
  const productDetails = await BuyableProduct.findOne(
    { _id: productId },
    {
      _id: 1,
      userId: 1,
   //   parentSellerSKU: 1,
   //   SellerSKU: 1,
      price: 1,
      title: 1,
      saleprice: 1,
      description: 1,
      brand: 1,
      productgroupimageurl: 1,
      taxCode: 1
    }
  ).lean();
  console.log("getProductDetailsByProductId" + productId);

  let totalPrice = Number((productDetails.saleprice * quantity).toFixed(2));
  console.log("getProductDetailsByProductId" + productDetails.userId);

  const productData = [];
  productData.push({
    ID: id,
    sellerId: productDetails.userId,
    productId: productId,
  //  parentSellerSKU: productDetails.parentSellerSKU,
  //  SellerSKU: productDetails.SellerSKU[index], // selller sku from array of seller sku
  //  UnitPrice: productDetails.price[index], // change it to variants price
    UnitPrice: productDetails.saleprice,
    Quantity: quantity,
    totalItemPrice: totalPrice,
    title: productDetails.title,
    description: productDetails.description,
    taxCode: productDetails.taxCode,
    image: productDetails.productgroupimageurl,
    brand: productDetails.brand,
  });
  // });

  return {
    productData,
    totalPrice,
  };
};

export const updateOrdersDetailsInDB = async (Orders, paymentIntentDB, chargeId, balanceTransaction, paymentIntentId) => {
  const totalPrice = paymentIntentDB.meta[0]["TotalPrice"];
  // intialize stripe fee to 2.9% + 30cents of total prices.
  let totalStripeFee = totalPrice * StripeFeePercent + StripeExtraFee;

  // fetching stripe fees
  if (balanceTransaction) {
    totalStripeFee = (balanceTransaction.fee) / 100;  // cent -> usd
  }

  await Orders.forEach(async (order, index) => {
    let paysferAmountWithOtherFees;
    const totalPricePerOrder = Orders[index].TotalPrice;

    if (totalPricePerOrder <= SmallPaymentThreshold) {
      paysferAmountWithOtherFees = SmallPaymentFixedCharge;
    } else {
      paysferAmountWithOtherFees = totalPricePerOrder * PaysferCutPercent;
    }

    const totalSellerAmount = totalPricePerOrder - paysferAmountWithOtherFees;
    const stripeFeePerOrder = totalStripeFee * (totalPricePerOrder / totalPrice);
    const totalPaysferAmount = paysferAmountWithOtherFees - stripeFeePerOrder;

    await Order.findOneAndUpdate(
      { ID: order.ID, SellerId: order.SellerId },
      {
        OrderPaymentStatus: OrderPaymentStatus.COMPLETED,
        OrderStatus: OrderStatus.ReleasedForShipment,
        ChargeID: chargeId,
        PaymentIntentID: paymentIntentId,
        TotalPaysferAmount: totalPaysferAmount,
        TotalStripeFee: stripeFeePerOrder,
        TotalSellerAmount: totalSellerAmount,
      });
  })
}

export const paymentIntentStripe = async (
  requestData,
  customerObj,
  stripeID
) => {
  const { user, addressId } = requestData;
  const cartIds =
    requestData.cartIds && requestData.cartIds.length > 0
      ? requestData.cartIds
      : null;
  const { productId, quantity, index }: any = requestData.productId
    ? requestData
    : {};
  const id = orderid.generate();
  const { productData, totalPrice } = cartIds
    ? await getProductDetails(cartIds, id)
    : await getProductDetailsByProductId(productId, quantity, id);
  let paymentIntent: any;

  try {
    paymentIntent = await stripe.paymentIntents.create({
      customer: stripeID,
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      payment_method_types: ["card"],
      statement_descriptor: "Custom descriptor",
      setup_future_usage: "on_session",
      metadata: {
        customer_email: customerObj.email,
      },
    });
  } catch (e) {
    return [{}, null];
  }

  await PaymentIntent.create({
    paymentIntentID: paymentIntent.id,
    paymentIntentStatus: paymentIntent.status,
    clientSecretKey: paymentIntent.client_secret,
    meta: {
      ID: id, // unique order id created for each order
      UserId: user._id,
      cartIds: cartIds,
      OrderDateUtc: moment().format(),
      BuyerAddress: addressId,
      ShippingAddress: addressId,
      TotalPrice: totalPrice,
      items: productData,
      subscriptionId: null
    },
  });

  return paymentIntent;
};


export const createSubscription = async (
  requestData,
  stripeID
) => {
  const { user, priceId, addressId } = requestData;

  // order details
  const cartIds =
    requestData.cartIds && requestData.cartIds.length > 0
      ? requestData.cartIds
      : null;
  const { productId, quantity, index }: any = requestData.productId
    ? requestData
    : {};
  const id = orderid.generate();
  const { productData, totalPrice } = cartIds
    ? await getProductDetails(cartIds, id)
    : await getProductDetailsByProductId(productId, quantity, id);
  let paymentIntent: any;
  let subscription: any;

  // creating subscription
  try {
    subscription = await stripe.subscriptions.create({
      customer: stripeID,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      collection_method: "charge_automatically",
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        UserId: user._id,
        PriceId: priceId,
        AddressId: addressId,
        ProductId: productId,
      },
    });
    paymentIntent = subscription.latest_invoice["payment_intent"];
  } catch (e) {
    return [{}, null];
  }

  await PaymentIntent.create({
    paymentIntentID: paymentIntent.id,
    paymentIntentStatus: paymentIntent.status,
    clientSecretKey: paymentIntent.client_secret,
    subscriptionId: subscription.id,
    meta: {
      ID: id, // unique order id created for each order
      UserId: user._id,
      cartIds: cartIds,
      OrderDateUtc: moment().format(),
      BuyerAddress: addressId,
      ShippingAddress: addressId,
      TotalPrice: totalPrice,
      items: productData,
      subscriptionId: subscription.id
    },
  });
  return paymentIntent;
}


export const getStripeSavedPaymentMethods = async (stripeAccountId: string) => {
  try {
    const { data } = await stripe.paymentMethods.list({
      customer: stripeAccountId,
      type: "card",
    });

    if (data.length === 0) return [];

    const paymentMethods = data
      .filter((payment) => payment.type === "card")
      .map((payment) => {
        const { id, card, billing_details } = payment;
        return { id, card, billing_details };
      });

    return paymentMethods;
  } catch (error) {
    return [];
  }
};

export const getStripeSubscriptions = async (stripeAccountId: string) => {
  try {

    const subscriptionsObj = await stripe.subscriptions.list({
      customer: stripeAccountId
    });
    const subscriptions = subscriptionsObj.data;
    const subsciptions = await Promise.all(subscriptions.map(async (subscription: any) => {
      const productId = subscription.metadata.ProductId;
      const productDetails = await BuyableProduct.findOne({ _id: productId });
      const paymentIntent = await PaymentIntent.findOne({ subscriptionId: subscription.id });
      let meta: any = paymentIntent.meta[0];

      return { id: subscription.id, name: productDetails.title, price: subscription.plan.amount, shippingAddress: meta.ShippingAddress, images: [productDetails.productgroupimageurl], quantity: subscription.quantity, interval: subscription.plan.interval };
    }));

    return subsciptions;
  } catch (error) {
    return [];
  }
};

export const deleteStripeSavedPaymentMethods = async (paymentMethodId: string) => {
  try {
    const deletedPaymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return deletedPaymentMethod;
  } catch (error) {
    return [];
  }
};

