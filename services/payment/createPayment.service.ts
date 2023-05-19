// @ts-nocheck
import Stripe from "stripe";
import moment from "moment";

import { core, orders } from "@paypal/checkout-server-sdk";
import { createOrderService, orderCreation } from "../orders/createOrder.service";
import User, { SubscribeUser } from "../../models/user.model";
import { uuid } from "uuidv4";
import Payment from "../../models/payment.model";
import PaymentIntent from "../../models/paymentIntent.model";
import {
  BillingReason,
  OrderPaymentStatus,
  OrderStatus,
  PaymentIntentStatus,
  PaymentStatus,
  PaymentType,
  PaypalOrderIntentStatus,
} from "../../utils/enums";
import config from "../../config";
import PaypalPayment from "../../models/paypalPayment.model";
import PaypalOrderIntent from "../../models/paypalOrderIntent.model";
import {
  createSubscription,
  deleteStripeSavedPaymentMethods,
  getProductDetails,
  getProductDetailsByProductId,
  getStripeSavedPaymentMethods,
  getStripeSubscriptions,
  paymentIntentStripe,
  updateOrdersDetailsInDB
} from "../../utils/payments";
import { ERRORS } from "../../utils/errors";
import Subscription from "../../models/subsciption.model";
import ProductPrices from "../../models/productPrices.modal";
import { toInteger } from "lodash";
import Checkout from "../../models/checkout.model";

const { Order } = require("../../models/order.model");
const { BuyableProduct } = require("../../models/product.model");
const ObjectId = require("mongoose").Types.ObjectId;
const secretkey = config.get("stripeSecretKey");
const stripe = new Stripe(secretkey, {
  apiVersion: "2020-03-02"
});
const orderid = require("order-id")("key");
const frontEndUrl = config.get("frontEnd");
const paypalClientID = config.get("paypalClientID");
const paypalClientSecret = config.get("paypalClientSecret");

let paypalEnvironment =
  config.get("env") === "production"
    ? new core.LiveEnvironment(paypalClientID, paypalClientSecret)
    : new core.SandboxEnvironment(paypalClientID, paypalClientSecret);

let client = () => {
  return new core.PayPalHttpClient(paypalEnvironment);
};

export const getStripePaymentMethods = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { userId } = requestData;
    const customerObj = await User.findOne({ _id: userId });

    // Store the customer stripe unique id in DB
    if (customerObj) {
      let stripeID = customerObj.stripeAccountId;
      const savedPaymentMethods = await getStripeSavedPaymentMethods(stripeID);
      return [
        null,
        {
          paymentMethods: savedPaymentMethods,
        },
      ];
    }
  } catch (e) {
    return [{}, null];
  }
};


export const getTaxCodesService = async (
): Promise<any[]> => {
  try {
    const taxCodesList = [];
    let taxCodes;

    for (let it = 0; it < 3; it++) {
      let starting_after;
      if (taxCodesList.length) {
        starting_after = taxCodesList[taxCodesList.length - 1]["id"];
      }
      taxCodes = await stripe.taxCodes.list({ limit: 100, starting_after });
      taxCodesList.push(...taxCodes.data);
    }
    return [null, {
      taxCodesList,
    }]
  } catch (e) {
    return [{}, null];
  }
};

export const deleteStripePaymentMethods = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { paymentMethodId } = requestData;
    const deletedPaymentMethod = await deleteStripeSavedPaymentMethods(paymentMethodId);
    return [
      null,
      {
        deletedPaymentMethod
      },
    ];
  } catch (e) {
    return [{}, null];
  }
};

export const addStripePaymentMethod = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { userId, tokenId } = requestData;
    const customerObj = await User.findOne({ _id: userId });
    // Store the customer stripe unique id in DB
    if (customerObj) {
      let stripeID = customerObj.stripeAccountId;
      const card = await stripe.customers.createSource(
        stripeID,
        { source: tokenId }
      );
      return [
        null,
        {},
      ];
    }

  } catch (e) {
    return [{}, null];
  }
};

export const createStripePaymentIntent = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { user } = requestData;
    const customerObj = await User.findOne({ _id: user._id });

    // Store the customer stripe unique id in DB
    if (customerObj) {
      let stripeID = customerObj.stripeAccountId;
      if (!customerObj.stripeAccountId) {
        const customer = await stripe.customers.create({
          email: customerObj.email,
          name: customerObj.firstName,
        });
        stripeID = customer.id;

        await User.findOneAndUpdate(
          { _id: user._id },
          { stripeAccountId: customer.id }
        ).lean();
      }

      const paymentIntent = await paymentIntentStripe(
        requestData,
        customerObj,
        stripeID
      );
      const savedPaymentMethods = await getStripeSavedPaymentMethods(stripeID);

      return [
        null,
        {
          clientSecret: paymentIntent.client_secret,
          paymentMethods: savedPaymentMethods,
        },
      ];
    }
  } catch (e) {
    return [{}, null];
  }
};

export const createStripeProductSubscription = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { user } = requestData;
    const customerObj = await User.findOne({ _id: user._id });
    if (customerObj) {
      let stripeID = customerObj.stripeAccountId;
      const paymentIntent = await createSubscription(
        requestData,
        stripeID
      );
      const savedPaymentMethods = await getStripeSavedPaymentMethods(stripeID);
      return [
        null,
        {
          clientSecret: paymentIntent.client_secret,
          paymentMethods: savedPaymentMethods,
        },
      ];
    }
  } catch (e) {
    return [{}, null];
  }
};


export const getAllStripeSubscriptions = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { user } = requestData;
    const customerObj = await User.findOne({ _id: user._id });
    if (customerObj) {
      let stripeID = customerObj.stripeAccountId;
      const subscriptions = await getStripeSubscriptions(stripeID);
      return [
        null,
        {
          subscriptions: subscriptions,
        },
      ];
    }
  } catch (e) {
    return [{}, null];
  }
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const updateStripeSubscription = async (
  requestData: any
): Promise<any[]> => {
  try {

    const { subscriptionId, shippingAddress, quantity } = requestData;
    const paymentIntent = await PaymentIntent.findOne({ subscriptionId: subscriptionId });
    let meta: any = paymentIntent.meta[0];


    if (shippingAddress) {
      meta.ShippingAddress = shippingAddress;
    }

    if (quantity && subscriptionId) {
      const subscriptionItems = await stripe.subscriptionItems.list({ subscription: subscriptionId });
      await subscriptionItems.data.forEach(async (subscriptionItem, index) => {
        if (subscriptionItem.quantity != quantity) {
          await stripe.subscriptionItems.update(
            subscriptionItem.id,
            { quantity: quantity }
          );
        }
      })

      let total = 0;
      meta.items.forEach((val, index) => {
        meta.items[index].totalItemPrice = meta.items[index].UnitPrice * quantity;
        meta.items[index].Quantity = quantity;
        total += meta.items[index].UnitPrice * quantity;
      })
      meta.TotalPrice = total;
    }

    await PaymentIntent.findOneAndUpdate({ subscriptionId },
      {
        meta: meta
      });
    const customerObj = await User.findOne({ _id: meta.UserId });
    await sleep(1500);
    const subscriptions = await getStripeSubscriptions(customerObj.stripeAccountId);

    return [null, { subscriptions: subscriptions, }]
  } catch (e) {
    return [{}, null];
  }
};

export const cancelStripeProductSubscription = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { subscriptionId, user } = requestData;
    const customerObj = await User.findOne({ _id: user._id });

    if (customerObj) {
      let stripeID = customerObj.stripeAccountId;

      await stripe.subscriptions.del(subscriptionId);
      const subscriptions = await getStripeSubscriptions(stripeID);

      return [
        null,
        {
          subscriptions: subscriptions,
        },
      ];
    }
  } catch (e) {
    return [{}, null];
  }
};

export const createPaypalPaymentOrderIntent = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { orderIntentID: orderIntent, user, addressId } = requestData;
    const id = orderid.generate();
    if (requestData.cartIds) {
      const cartIds = requestData.cartIds;
      const { productData, totalPrice, productIds } = await getProductDetails(
        cartIds,
        id
      );

      await PaypalOrderIntent.create({
        orderIntentID: orderIntent,
        orderIntentStatus: PaypalOrderIntentStatus.CREATED,
        purchase_units: productIds.length,
        meta: {
          ID: id,
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
    } else {
      const { productId, quantity, index } = requestData;
      const { productData, totalPrice } = await getProductDetailsByProductId(
        productId,
        quantity,
        id
      );

      await PaypalOrderIntent.create({
        orderIntentID: orderIntent,
        orderIntentStatus: PaypalOrderIntentStatus.CREATED,
        purchase_units: 1,
        meta: {
          ID: id,
          UserId: user._id,
          //  cartIds: cartIds,
          OrderDateUtc: moment().format(),
          BuyerAddress: addressId,
          ShippingAddress: addressId,
          TotalPrice: totalPrice,
          items: productData,
          subscriptionId: null
        },
      });
    }

    return [null, {}];
  } catch (e) {
    return [];
  }
};

export const createStripePaymentSuccess = async (
  paymentIntentData: any
): Promise<any[]> => {
  try {
    const balanceTransactionId = paymentIntentData.charges.data[0].balance_transaction;
    const balanceTransaction = await stripe.balanceTransactions.retrieve(
      balanceTransactionId
    );

    // create payments
    const payment = await Payment.findOne({
      PaymentIntentID: paymentIntentData.id,
    });

    if (!payment || !payment.ChargeID) {
      await Payment.create({
        UUID: uuid(),
        PaymentIntentID: paymentIntentData.id,
        ChargeID: paymentIntentData.charges.data[0].id,
        status: PaymentStatus.COMPLETED,
        amount: paymentIntentData.amount,
        $set: { ...paymentIntentData },
      });
    }
    setTimeout(async () => {
      const Orders = await Order.find({ PaymentIntentID: paymentIntentData.id });
      const paymentIntentDB = await PaymentIntent.findOne({
        paymentIntentID: paymentIntentData.id,
      });
      if (Orders?.length) {
        updateOrdersDetailsInDB(Orders, paymentIntentDB, paymentIntentData.charges.data[0].id, balanceTransaction, paymentIntentData.id)
      } else {
        await orderCreation(paymentIntentDB, PaymentType.STRIPE, paymentIntentData.charges.data[0].id, OrderPaymentStatus.COMPLETED, OrderStatus.ReleasedForShipment, balanceTransaction); // order created with stripe
      }
    }, 5000);

    return [null, {}];
  } catch (e) {
    return [{}, null];
  }
};

export const createCustomerSubscription = async (
  subscription: any
): Promise<any[]> => {
  try {
    await Subscription.create({
      subscriptionId: subscription.id,
      stripeAccountId: subscription.customer,
      status: subscription.status,
      userId: subscription.metadata.UserId,
      priceId: subscription.metadata.PriceId,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      quantity: subscription.quantity,
    });
    return [{}, null];
  } catch (e) {
    return [];
  }
};

export const updateCustomerSubscription = async (
  subscription: any
): Promise<any[]> => {
  try {
    if (subscription.previous_attributes && subscription.current_period_start && subscription.current_period_end) {
      await Subscription.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
        }
      );
      return [{}, null];
    }
    await Subscription.findOneAndUpdate(
      { subscriptionId: subscription.id },
      {
        status: subscription.status,
      }
    );

    return [{}, null];
  } catch (e) {
    return [];
  }
};

export const invoicePaid = async (
  invoiceData: any
): Promise<any[]> => {
  try {
    setTimeout(async () => {
      if (invoiceData.subscription != null && invoiceData.billing_reason == BillingReason.subscription_cycle) {
        // fetching old payment intent for subscription id
        const checkout = await Checkout.findOne({
          subscriptionId: invoiceData.subscription,
        });

        if (checkout) {
          checkout.meta[0]["ID"] = orderid.generate();
          checkout.paymentIntentID = invoiceData.payment_intent;
          checkout.meta[0]["OrderDateUtc"] = moment().format();

          const chargeData = await stripe.charges.retrieve(invoiceData.charge);
          const balanceTransactionId: any = chargeData.balance_transaction;
          const balanceTransaction = await stripe.balanceTransactions.retrieve(balanceTransactionId);

          await orderCreation(checkout, PaymentType.STRIPE, invoiceData.charge, OrderPaymentStatus.COMPLETED, OrderStatus.ReleasedForShipment, balanceTransaction); // order created with stripe

          // create payments
          await Payment.create({
            UUID: uuid(),
            PaymentIntentID: invoiceData.payment_intent,
            ChargeID: invoiceData.charge,
            status: PaymentStatus.COMPLETED,
            amount: invoiceData.total,
            OrderID: checkout.meta[0]["ID"]
          });
        } else {
          return [{ [ERRORS.BAD_REQUEST]: "Order details does not exist for this subscription id" }, null];
        }
      }
    }, 5000);

    if (invoiceData.subscription != null && invoiceData.billing_reason == BillingReason.subscription_create) {
      const chargeData = await stripe.charges.retrieve(invoiceData.charge);
      const balanceTransactionId: any = chargeData.balance_transaction;
      const balanceTransaction = await stripe.balanceTransactions.retrieve(
        balanceTransactionId
      );

      // create payments
      const payment = await Payment.findOne({
        PaymentIntentID: invoiceData.payment_intent,
      });

      if (!payment || !payment.ChargeID) {
        await Payment.create({
          UUID: uuid(),
          PaymentIntentID: invoiceData.payment_intent,
          ChargeID: invoiceData.charge,
          status: PaymentStatus.COMPLETED,
          amount: invoiceData.total,
        });
      }

      setTimeout(async () => {
        const checkout = await Checkout.findOne({
          subscriptionId: invoiceData.subscription,
        });
        const Orders = await Order.find({ checkoutId: checkout.checkoutId });
        if (Orders) {
          updateOrdersDetailsInDB(Orders, checkout, invoiceData.charge, balanceTransaction, invoiceData.payment_intent)
        } else {
          checkout.paymentIntentID = invoiceData.payment_intent;
          await orderCreation(checkout, PaymentType.STRIPE, invoiceData.charge, OrderPaymentStatus.COMPLETED, OrderStatus.ReleasedForShipment, balanceTransaction); // order created with stripe
        }
      }, 3000);

    }
  } catch (e) {
    return [];
  }
};

export const webhookCreatePaypalPayment = async (
  webhookEvent: any
): Promise<any[]> => {
  try {
    // TO-DO - check if webhookEvent rightly populate the data
    const paypalPayment = await PaypalPayment.findOne({
      captureID: webhookEvent.capture_id,
    });
    if (paypalPayment) {
      await PaypalPayment.updateOne(
        { captureID: webhookEvent.capture_id },
        {
          status: PaypalOrderIntentStatus[webhookEvent.status],
          ...webhookEvent,
        }
      );
    } else {
      PaypalPayment.create({
        captureID: webhookEvent.capture_id,
        amount: webhookEvent.amount,
        currency: webhookEvent.currency,
        $set: { ...webhookEvent },
        ...webhookEvent,
      });
    }

    if (webhookEvent?.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      // update order with complete status.
      updateOrderStatusSuccessPaypal(
        webhookEvent?.resource?.supplementary_data?.related_ids?.order_id,
        webhookEvent.capture_id
      );
    }
    return [null, {}];
  } catch (e) {
    return [{}, null];
  }
};

const updateStripePaymentStatus = async (
  paymentIntent: any,
  paymentStatus: PaymentStatus
) => {
  try {
    const payment = await Payment.findOne({
      PaymentIntentID: paymentIntent.id,
    });

    if (payment) {
      await Payment.updateOne(
        { paymentIntentID: paymentIntent.id },
        { status: paymentStatus }
      );
    } else {
      await Payment.create({
        UUID: uuid(),
        PaymentIntentID: paymentIntent.id,
        status: paymentStatus,
        $set: { ...paymentIntent },
        ...paymentIntent,
      });
    }
  } catch (e) {
    return [];
  }
};

export const webhookPaymentIntentStatusUpdate = async (
  paymentIntent: any
): Promise<any[]> => {
  try {
    const isPaymentIntent = await PaymentIntent.findOne({ paymentIntentID: paymentIntent.id });
    if (isPaymentIntent) {
      await PaymentIntent.findOneAndUpdate(
        { paymentIntentID: paymentIntent.id },
        { paymentIntentStatus: paymentIntent.status }
      );
      if (paymentIntent.status === PaymentIntentStatus.processing)
        await updateStripePaymentStatus(paymentIntent, PaymentStatus.PENDING);
      if (paymentIntent.status === PaymentIntentStatus.succeeded) {
        await createStripePaymentSuccess(paymentIntent);
      }
      if (paymentIntent.status === PaymentIntentStatus.canceled) {
        await updateOrderStatusFailed(paymentIntent.id);
        await updateStripePaymentStatus(paymentIntent, PaymentStatus.FAILED);
      }
    }
    return [null, { received: true }];
  } catch (e) {
    return [];
  }
};

export const webhookPaymentIntentProcessing = async (
  paymentIntent: any
): Promise<any[]> => {
  try {
    await webhookPaymentIntentStatusUpdate(paymentIntent);
    setTimeout(async () => {
      await createOrderService(paymentIntent.id, PaymentType.STRIPE);
    }, 5000);
    return [null, { received: true }];
  } catch (e) {
    return [];
  }
};

export const updateOrderStatusSuccess = async (
  paymentIntentID: string
): Promise<any[]> => {
  try {
    await Order.updateOne(
      { PaymentIntentID: paymentIntentID },
      {
        $set: {
          OrderPaymentStatus: OrderPaymentStatus.COMPLETED,
          OrderStatus: OrderStatus.ReleasedForShipment,
        },
      }
    );
  } catch (e) {
    return [];
  }
};

export const updateOrderStatusSuccessPaypal = async (
  orderIntentID: string,
  captureId: string
): Promise<any[]> => {
  try {
    await Order.updateOne(
      { PaypalOrderID: orderIntentID },
      {
        $set: {
          OrderPaymentStatus: OrderPaymentStatus.COMPLETED,
          OrderStatus: OrderStatus.ReleasedForShipment,
          CaptureID: captureId
        },
      }
    );
  } catch (e) {
    return [];
  }
};

export const updateOrderStatusFailed = async (
  paymentIntentID: string
): Promise<any[]> => {
  try {
    await Order.updateOne(
      { PaymentIntentID: paymentIntentID },
      {
        $set: {
          OrderPaymentStatus: OrderPaymentStatus.FAILED,
          OrderStatus: OrderStatus.Failed,
        },
      }
    );
  } catch (e) {
    return [];
  }
};

export const updateOrderStatusFailedPaypal = async (
  orderIntentID: string
): Promise<any[]> => {
  try {
    await Order.updateOne(
      { PaypalOrderID: orderIntentID },
      {
        $set: {
          OrderPaymentStatus: OrderPaymentStatus.FAILED,
          OrderStatus: OrderStatus.Failed,
        },
      }
    );
  } catch (e) {
    return [];
  }
};

export const webhookUpdateOrderIntentStatus = async (
  webhookEvent: any
): Promise<any[]> => {
  try {
    const { id, status } = webhookEvent.resource;
    await PaypalOrderIntent.findOneAndUpdate(
      { orderIntentID: id },
      { orderIntentStatus: PaypalOrderIntentStatus[status] }
    );
    return [null, {}];
  } catch (error) {
    return [{}, null];
  }
};

export const updateStripePaymentIntent = async (
  clientSecretKey: string,
  paymentMethodId: string
): Promise<any[]> => {
  try {
    const paymentIntent = await PaymentIntent.findOne({ clientSecretKey });

    if (paymentIntent) {
      const updatedPaymentIntent = await stripe.paymentIntents.update(
        paymentIntent.paymentIntentID,
        {
          payment_method: paymentMethodId,
        }
      );

      return [null, { clientSecret: updatedPaymentIntent.client_secret }];
    }
    return [null, { clientSecret: clientSecretKey }];
  } catch (error) {
    return [
      {
        ["Error"]:
          "An error occurred while using this payment-method. Please try again",
      },
      null,
    ];
  }
};

// Stripe Checkout

export const createStripeCheckoutSessionService = async (
  requestData: any
): Promise<any[]> => {
  try {
    const { user, addressId, isSubscription } = requestData;
    const cartIds =
      requestData.cartIds && requestData.cartIds.length > 0
        ? requestData.cartIds
        : null;
    const { productId, quantity, index }: any = requestData.productId
      ? requestData
      : {};
      console.log("productId:" +productId +" quantity" +quantity + " index" + index);

    const id = orderid.generate();
    const { productData, totalPrice } = cartIds
      ? await getProductDetails(cartIds, id)
      : await getProductDetailsByProductId(productId, quantity, id);
    const line_items = [];

    if (!isSubscription) {
      productData.forEach((val) => {stripe.checkout.sessions.create
        let tax_code = val.taxCode;
        line_items.push({
          price_data: {
            currency: 'usd',
            tax_behavior: "exclusive",
            product_data: {
              name: val.title,
              tax_code,
            },
            unit_amount: toInteger(val.UnitPrice * 100),
          },
          quantity: val.Quantity,
        });
      });      

      const session = await stripe.checkout.sessions.create({
        line_items,
        payment_method_types: ['card'],
        automatic_tax: {
          enabled: true,
        },
        mode: 'payment',
        success_url: `${frontEndUrl}/stripe-payment/status/?redirect_status=succeeded`,
        cancel_url: `${frontEndUrl}/stripe-payment/status/?redirect_status=failed`,
        expand: ["payment_intent"]
      });

      console.log("session payment_intent" +session.payment_intent +"session id" +session.id);
      const paymentIntent: any = session.payment_intent;
      await PaymentIntent.create({
        paymentIntentID: paymentIntent.id,
        paymentIntentStatus: paymentIntent.status,
        clientSecretKey: paymentIntent.client_secret,
        meta: {
          ID: id,
          UserId: user._id,
          cartIds: cartIds,
          OrderDateUtc: moment().format(),
          BuyerAddress: addressId,
          ShippingAddress: addressId,
          TotalPrice: totalPrice,
          items: productData,
          checkoutId: session.id,
          subscriptionId: null
        },
      });  

      return [
        null,
        {
          url: session.url,
          sessionId: session.id,
          paymentIntentId: session.payment_intent.id
        },
      ];
    } else {
      productData.forEach((val) => {
        line_items.push({
          price: "price_1KzzioF5F5h6y3w5o4cuyEkS",
          quantity: val.Quantity,
        });
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        automatic_tax: {
          enabled: true,
        },
        mode: 'subscription',
        success_url: `${frontEndUrl}/stripe-payment/status/?redirect_status=succeeded`,
        cancel_url: `${frontEndUrl}/stripe-payment/status/?redirect_status=failed`,
        expand: ["payment_intent"]
      });

      await Checkout.create({
        checkoutId: session.id,
        paymentStatus: session.payment_status,
        checkoutStatus: session["status"],
        checkoutMode: session.mode,
        currency: session.currency,
        meta: {
          ID: id,
          UserId: user._id,
          cartIds: cartIds,
          OrderDateUtc: moment().format(),
          BuyerAddress: addressId,
          ShippingAddress: addressId,
          TotalPrice: totalPrice,
          items: productData,
          checkoutId: session.id,
          subscriptionId: null
        },
      });

      return [
        null,
        {
          url: session.url,
          paymentIntentId: session.id,
        },
      ];
    }
  } catch (e) {
    return [{}, null];
  }
};

export const getPaymentStatus  = async (
  requestData: any
): Promise<any[]> => {
  const { sessionId} = requestData;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log(session.payment_intent + " session Id"+ session.id);

  const paymentIntentId:any = session.payment_intent;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  await PaymentIntent.create({
    paymentIntentID: paymentIntent.id,
    paymentIntentStatus: paymentIntent.status,
    clientSecretKey: paymentIntent.client_secret,
    meta: {
     // ID: id,
    //  UserId: user._id,
    //  cartIds: cartIds,
      OrderDateUtc: moment().format(),
    //  BuyerAddress: addressId,
    //  ShippingAddress: addressId,
    //  TotalPrice: totalPrice,
    //  items: productData,
      checkoutId: session.id,
      subscriptionId: null
    },
  });
  return [paymentIntentId];
}

export const CheckoutCompleted = async (
  checkoutObj: any
): Promise<any[]> => {
  try {
    if (checkoutObj.mode === "payment") {
      setTimeout(async () => {
        await Order.findOneAndUpdate(
          { PaymentIntentID: checkoutObj.payment_intent },
          {
            TotalTaxPrice: (checkoutObj.total_details.amount_tax / 100.0)
          });
      }, 5000);
    }
    if (checkoutObj.mode === "subscription") {
      await Checkout.findOneAndUpdate(
        { checkoutId: checkoutObj.id },
        {
          subscriptionId: checkoutObj.subscription,
          totalTaxPrice: (checkoutObj.total_details.amount_tax / 100.0)
        });
    }
  } catch (e) {
    return null;
  }
};
