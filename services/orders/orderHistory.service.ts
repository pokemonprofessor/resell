import moment from "moment";
import { getDateRange } from "../../utils/dateRange";
import { ERRORS } from "../../utils/errors";
import { decodeToken } from "../../utils/jwtDecode";
//const { Order } = require("../../models/order.model");
import Order from "../../models/order.model";
const ObjectId = require("mongoose").Types.ObjectId;

export const orderHistoryService = async (
  user: any,
  query: any
): Promise<any[]> => {
  try {
    const { startDate, endDate } = getDateRange(query.date);
    console.log("orderHistoryService"+startDate+" "+endDate+ " " + user._id);
    const itemsPerPage = 10;
    const orderQuery = {
      status: query.status ? { OrderStatus: query.status } : {},
      userId: { UserID: new ObjectId(user._id) },
      dateRange: query.date
        ? {
            createdAt: {
              $gt: new Date(startDate.toDate()),
              $lte: new Date(endDate.toDate()),
            },
          }
        : {},
    };
    const orderCount = await Order.count({ UserID: user._id });
    console.log("orderHistoryService"+orderCount);

    const orderHistory = await Order.aggregate([
      {
        //$match:  orderQuery.userId
        $match: {
          $and: [orderQuery.userId, orderQuery.status, orderQuery.dateRange],
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: itemsPerPage * (query.page - 1) },
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
