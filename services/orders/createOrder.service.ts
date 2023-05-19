import PaymentIntent from "../../models/paymentIntent.model";
//const { Order } = require("../../models/order.model");
import Order from "../../models/order.model";
import { ERRORS } from "../../utils/errors";
import {
  OrderPaymentStatus,
  OrderStatus,
  PaymentType,
} from "../../utils/enums";
import UserShoppingItem from "../../models/userShoppingItem.model";
import PaypalOrderIntent from "../../models/paypalOrderIntent.model";
import Checkout from "../../models/checkout.model";
import {
  PaysferCutPercent,
  SmallPaymentFixedCharge,
  SmallPaymentThreshold,
  StripeExtraFee,
  StripeFeePercent,
} from "../../utils/constants";
import {
  buyerOrderConfirmationEmail,
  sellerPurchaseConfirmationEmail,
} from "../../utils/sendGridTemplate";
import User from "../../models/user.model";
import { sendEmail } from "../../utils/sendEmail";
const { BuyableProduct } = require("../../models/product.model");
import { IBuyableProduct } from "../../types/product";

export const createOrderService = async (
  intentID: string,
  paymentType: string,
  isSubscription?: string
): Promise<any[]> => {
  try {
    let intent, order, orderId;

    if (paymentType === PaymentType.STRIPE) {
      if (isSubscription) {
        intent = await PaymentIntent.findOne({ paymentIntentID: intentID });
        order = await Order.find({ PaymentIntentID: intent.paymentIntentID });
      } else {
        intent = await Checkout.findOne({ checkoutId: intentID });
        order = await Order.find({ checkoutId: intentID });
      }
      if (order?.length === 0) {
        orderId = await orderCreation(intent, paymentType); // order created with stripe
      } else {
        // Order already exists with this paymentIntentID
        // throw error that order has been already created for this payment intent
        return [null, { status: "Order already created through webhook" }];
      }
    } else {
      intent = await PaypalOrderIntent.findOne({ orderIntentID: intentID });
      order = await Order.find({ PaypalOrderID: intent.orderIntentID });
      if (order.length === 0) {
        orderId = await orderCreation(intent, paymentType); // order created with paypal
      } else {
        // Order already exists with this paymentIntentID
        // throw error that order has been already created for this payment intent
        return [{ [ERRORS.BAD_REQUEST]: "Order already created" }, null];
      }
    }
    return [null, { message: "Order created successfully!" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while creating the orders " + e,
      },
      null,
    ];
  }
};

export const createStripeSubscriptionOrderService = async (
  checkoutId: string
): Promise<any[]> => {
  try {
    const checkout = await Checkout.findOne({ checkoutId });
    const order = await Order.find({ checkoutId });

    if (order.length === 0) {
      await orderCreation(checkout, PaymentType.STRIPE); // order created with stripe
    } else {
      // Order already exists with this paymentIntentID
      // throw error that order has been already created for this payment intent
      return [null, { status: "Order already created through webhook" }];
    }

    return [null, { message: "Order created successfully!" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while creating the orders " + e,
      },
      null,
    ];
  }
};

export async function orderCreation(
  intent,
  paymentType,
  chargeId?,
  orderPaymentStatus = OrderPaymentStatus.PENDING,
  orderStatus = OrderStatus.Pending,
  balanceTransaction?
) {
  const {
    ID,
    UserId,
    OrderDateUtc,
    ShippingAddress,
    TotalPrice,
    items,
    cartIds,
    subscriptionId,
    checkoutId,
  } = intent.meta[0];

  // logic for new schema

  let obj = {};
  let arr = [];

  let paymentObj =
    paymentType === PaymentType.STRIPE
      ? { PaymentIntentID: intent.paymentIntentID }
      : { PaypalOrderID: intent.orderIntentID };

  // intialize stripe fee to 2.9% + 30 cents of total prices.
  let totalStripeFee = TotalPrice * StripeFeePercent + StripeExtraFee;

  // fetching stripe fees
  if (balanceTransaction) {
    totalStripeFee = (balanceTransaction.fee) / 100;  // cent -> usd
  }

  for (let i = 0; i < items.length; i++) {
    if (obj[items[i].sellerId]) {
      // it means same seller add data into the existing doc
      let indexOfItem = arr.findIndex((e) => e.SellerId);
      arr[indexOfItem].TotalPrice += items[i].totalItemPrice;
      arr[indexOfItem].Items.push(items[i]);

    } else {
      obj[items[i].sellerId] = true;
      //calculation of stripe fees per seller order
      let paysferAmountWithOtherFees;
      const totalPricePerOrder = items[i].totalItemPrice;
      if (totalPricePerOrder <= SmallPaymentThreshold) {
        paysferAmountWithOtherFees = SmallPaymentFixedCharge;
      } else {
        paysferAmountWithOtherFees = totalPricePerOrder * PaysferCutPercent;
      }

      const totalSellerAmount = totalPricePerOrder - paysferAmountWithOtherFees;
      const stripeFeePerOrder =
        totalStripeFee * (totalPricePerOrder / TotalPrice);
      const totalPaysferAmount = paysferAmountWithOtherFees - stripeFeePerOrder;

      arr.push({
        // await Order.create({
        ID,
        ...paymentObj,
        PaymentType: paymentType,
        OrderPaymentStatus: orderPaymentStatus,
        OrderStatus: orderStatus,
        UserID: UserId,
        sellerUserId: items[i].sellerId,
        Currency: "USD",
        OrderDateUtc,
        ShippingAddress,
        RequestedShippingMethod: "Standard",
        TotalPrice: items[i].totalItemPrice,
        Items: [items[i]],
        subscriptionId: subscriptionId,
        //  ChargeID: chargeId,
        TotalPaysferAmount: TotalPrice,
        TotalStripeFee: 0,
        TotalSellerAmount: 0,
        TotalTaxPrice: 0,
        TotalShippingPrice: 0,
        TotalShippingTaxPrice: 0,
        TotalGiftOptionPrice: 0,
        TotalGiftOptionTaxPrice: 0,
        //  checkoutId: checkoutId
      });
    }
  }

  try {
    await Order.insertMany(arr);
    await UserShoppingItem.deleteMany({ _id: cartIds });
    const userResult = await User.findOne({ _id: UserId });
    const { emailObj } = buyerOrderConfirmationEmail(userResult);
    await sendEmail(emailObj);
    await sendSellerEmail(items);
    await updateQuantityForProducts(items);

    return ID;
  } catch (e) {
    return false;
  }
}

export async function sendSellerEmail(items) {
  for (let i = 0; i < items.length; i++) {
    const sellerResult = await User.findOne({ _id: items[i].sellerId });
    const { emailObj } = sellerPurchaseConfirmationEmail(sellerResult);
    await sendEmail(emailObj);
  }
}

export async function updateQuantityForProducts(items) {
  for (let i = 0; i < items.length; i++) {
    const product: IBuyableProduct = await BuyableProduct.find({
      _id: items[i].productId,
    });
    var newQty = product[0].Quantity - 1;
    const result = await BuyableProduct.findOneAndUpdate(
      { _id: items[i].productId },
      {
        Quantity: newQty,
      },
      {
        new: true,
      }
    );
    console.log("Q");
  }
}
