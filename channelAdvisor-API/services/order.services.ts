import { paypalRefund } from "../../services/refund/createPaypalRefund.service";
import { createRefund } from "../../services/refund/createRefund.service";
import { OrderStatus, PaymentType } from "../../utils/enums";
import { ERRORS } from "../../utils/errors";
const { Order } = require("../../models/order.model");

export const getOrdersService = async (
  sellerId: any,
  data: any,
  query: any
): Promise<any[]> => {
  try {
    const orderQuery = {
      status: query.status
        ? { OrderStatus: query.status }
        : { OrderStatus: OrderStatus.Shipped },
      limit: query.limit ? parseInt(query.limit) : 10,
      sellerId: { SellerId: sellerId },
    };

    const testOrder = await Order.aggregate([
      {
      $match: {
      $and: [orderQuery.status, orderQuery.sellerId],
      },
      },
      { $limit: orderQuery.limit },
      {
      $lookup: {
      from: "addresses",
      localField: "ShippingAddress",
      foreignField: "_id",
      as: "ShippingAddress",
      },
      },
      { $unwind: "$ShippingAddress" },
      {
      $project: {
      _id: 0,
      OrderPaymentStatus: 0,
      subscriptionId: 0,
      PaymentIntentID: 0,
      PaymentType: 0,
      UserID: 0,
      SellerId: 0,
      ChargeID: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
      "Items.title": 0,
      "Items.description": 0,
      "Items.brand": 0,
      "Items.totalItemPrice": 0,
      "Items.image": 0,
      "Items.sellerId": 0,
      "Items.productId": 0,
      "Items.parentSellerSKU": 0,
      },
      },
      ]);
      

    return [null, testOrder];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while fetching the orders " + e,
      },
      null,
    ];
  }
};

export const getOrderService = async (sellerId, id: String): Promise<any[]> => {
  try {
    const getOrder = await Order.findOne({ ID: id, SellerId: sellerId })
      .populate("BuyerAddress ShippingAddress")
      .select(["-_id", "-__v", "-created_at", "-updated_at"]);
    if (!getOrder) {
      return [
        {
          ID: "OrderNotFound",
          ErrorCode: "482",
          Message: "No order exists with that order ID",
        },
        null,
      ];
    } else {
      return [null, getOrder];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while fetching the order " + e,
      },
      null,
    ];
  }
};

export const acknowledgeService = async (
  sellerId,
  id: String
): Promise<any[]> => {
  try {
    const filter = {
      ID: id,
      SellerId: sellerId,
    //  OrderStatus: OrderStatus.ReleasedForShipment,
    };
    const update = { OrderStatus: OrderStatus.AcknowledgedBySeller };
    await Order.findOneAndUpdate(filter, update, {
      new: true,
    });

    return [null, {}];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while updating the order " + e,
      },
      null,
    ];
  }
};

export const fulfillService = async (
  sellerId,
  orderFulfillment: any
): Promise<any[]> => {
  try {
    const Ids = await orderFulfillment.map((i) => i.ID);

    const ordersExist = await Order.find({
      ID: { $in: Ids },
      SellerId: sellerId,
    });
    const resFulfillment = [];
    for (let order of ordersExist) {
      const findOrder = await orderFulfillment.find((x) => x.ID === order.ID);
      let newItem = [];

      for (let item of order.Items) {
        const findItem = await findOrder.Items.find(
          (x) => x.OrderItemID === item.ID
        );
        if (findItem) {
          item.TrackingNumber = findItem.TrackingNumber;
          item.ShippingCarrier = findItem.ShippingCarrier;
          item.ShippingClass = findItem.ShippingClass;
          item.QuantityShipped = findItem.Quantity;
          if (findItem.Quantity === item.Quantity) {
            item.ItemStatus = "Shipped";
          } else {
            item.ItemStatus = "PartiallyShipped";
          //  order.OrderStatus = OrderStatus.PartiallyShipped;
          }
        }
        newItem.push(item);
      }

      order.Items = newItem;
     /* if (order.OrderStatus !== OrderStatus.PartiallyShipped) {
        order.OrderStatus = OrderStatus.Shipped;
      } */
      const updateFulfillment = await Order.updateOne({ ID: order.ID }, order);
      if (updateFulfillment) {
        resFulfillment.push({ ID: order.ID, Result: "Success", Errors: [] });
      }
    }
    return [null, resFulfillment];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while fulfilling the order " + e,
      },
      null,
    ];
  }
};

export const cancelService = async (
  sellerId: any,
  cancelOrder: any,
  id: String
): Promise<any[]> => {
  try {
    const { OrderID, Items } = cancelOrder;

    const findOrder = await Order.findOne({ ID: id, SellerId: sellerId });
    if (findOrder) {
      let amountToRefund = 0;
      let isCancel = false;
      for (let obj of findOrder.Items) {
        const value = await cancelOrder.Items.find((i) => i.ID === obj.ID);

        if (value) {
          amountToRefund += value.Quantity * value.UnitPrice;
          obj.QuantityCancelled = value.Quantity;
          obj.Reason = value.Reason;
          obj.ItemStatus = "Cancelled";
        }
        if (!isCancel) {
          isCancel =
            obj.ItemStatus && obj.ItemStatus !== "Cancelled" ? false : true;
        }
      }
      let refundId:any = "";
      if (findOrder.PaymentType === PaymentType.STRIPE) {
        const refundObj = {
          PaymentIntentID: findOrder.PaymentIntentID,
          ChargeID: findOrder.ChargeID,
          amount: Math.round(amountToRefund * 100),
          reason: "GeneralAdjustment",
        };
        refundId = await createRefund(refundObj);
      } else {
        const refundObj = {
          captureId: findOrder.CaptureID, // check if captureId inserted in the db or not
          // ChargeID: findOrder.ChargeID,
          amount: Math.round(amountToRefund * 100),
          reason: "GeneralAdjustment",
        };
        refundId = await paypalRefund(refundObj);
      }

      await Order.updateOne(
        { ID: id },
        {
          OrderStatus: findOrder.Items.find((i) => i.ItemStatus !== "Cancelled")
            ? findOrder.OrderStatus
            : OrderStatus.Cancelled,
          RefundID: refundId,
          Items: findOrder.Items,
        }
      );
    }

    return [null, {}];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while cancelling the order " + e,
      },
      null,
    ];
  }
};
