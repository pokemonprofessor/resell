import moment from "moment";
import { getDateRange } from "../../utils/dateRange";
import { ERRORS } from "../../utils/errors";
import { OrderStatus } from "../../utils/enums";
import { decodeToken } from "../../utils/jwtDecode";
//const { Order } = require("../../models/order.model");
import Order from "../../models/order.model";
const ObjectId = require("mongoose").Types.ObjectId;

export const getOrderDetailsByOrderIdService = async (orderId: any): Promise<any> => {
  try {
    const order = await Order.aggregate([
      {
        $match:  { _id: ObjectId(orderId) }
      },
      {
        $lookup: {
          from: "addresses",
          localField: "ShippingAddress",
          foreignField: "_id",
          as: "fullShippingAddress",
        },
      },
      { $unwind: "$fullShippingAddress" }, 
    ]);
    return [null, order];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while fetching the order" + e,
      },
      null,
    ];
  }
};

export const getorderDetailsBySellerIdService = async (
  sellerId: any,
): Promise<any[]> => {
  try {
  //  const { startDate, endDate } = getDateRange(query.date);
    const itemsPerPage = 10;
    const orderQuery = {
    //  status: query.status ? { OrderStatus: query.status } : {},
   // sellerUserId: sellerId,
    sellerUserId: { sellerUserId: sellerId },
     /* dateRange: query.date
        ? {
            createdAt: {
              $gt: new Date(startDate.toDate()),
              $lte: new Date(endDate.toDate()),
            },
          }
        : {},  */
    };
    const orderCount = await Order.count({ sellerUserId: sellerId });
    const orderHistory = await Order.aggregate([
      {
        $match:  orderQuery.sellerUserId
      /*  $match: {
          $and: [orderQuery.userId, orderQuery.status, orderQuery.dateRange],
        }, */
      },
      { $sort: { createdAt: -1 } },
    //  { $skip: itemsPerPage * (query.page - 1) },
      { $limit: itemsPerPage },

      {
        $lookup: {
          from: "addresses",
          localField: "ShippingAddress",
          foreignField: "_id",
          as: "shippingAddress",
        },
      },
      { $unwind: "$shippingAddress" },
    ]);

    return [null, { orderCount, orderHistory }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while fetching the orders history" + e,
      },
      null,
    ];
  }
};

export const acknowledgeService = async (orderId, sellerId, status): Promise<any[]> => {
  try {
    const filter = {
      _id: orderId,
      //   sellerUserId: sellerId,
      OrderStatus: OrderStatus.Pending,
    };
    var update;
    if(status.includes('Acknowledged')){
       update = { OrderStatus: OrderStatus.AcknowledgedBySeller };
    } else if(status.includes('Shipped')){
       update = { OrderStatus: OrderStatus.Shipped };
    }else if(status.includes('Delivered')){
       update = { OrderStatus: OrderStatus.Delivered };
    }else if(status.includes('Cancelled')){
      update = { OrderStatus: OrderStatus.Cancelled };
   }
    let orderData = await Order.findOneAndUpdate(
      { _id: orderId },
    //  { $and: [{ _id: orderId }, { OrderStatus: OrderStatus.Pending }] },
      update,
      {
        new: true,
      }
    );
    if (!orderData) {
      return [{ [ERRORS.BAD_REQUEST]: "Order not found" }, null];
    } else {
      return [null, orderData];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while updating the order " + e,
      },
      null,
    ];
  }
};
