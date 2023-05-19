import express from "express";
import Responder from "../utils/expressResponder";
import { IOrder } from "../types/order";
import { createOrderService, createStripeSubscriptionOrderService } from "../services/orders/createOrder.service";
import { ERRORS } from "../utils/errors";
import { orderHistoryService } from "../services/orders/orderHistory.service";
import { getOrderDetailsByOrderIdService, getorderDetailsBySellerIdService,acknowledgeService } from "../services/orders/orderDetail.service";
import { decodeToken } from "../utils/jwtDecode";
const { Order } = require("../models/order.model");

export default class OrderController {
  static async create(req: express.Request, res: express.Response) {
    try {
      const { paymentIntentID, paymentType, isSubscription } = req.body;
      const [error, response] = await createOrderService(
        paymentIntentID,
        paymentType,
        isSubscription,
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getHistory(req: express.Request, res: express.Response) {
    try {
      const query = req.query;
      const user = decodeToken(req.headers);
      const [error, response] = await orderHistoryService(user, query);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getOrderDetailsByOrderId(req: express.Request, res: express.Response) {
    try {
      const {orderId} = req.params;
      const [error, response] = await getOrderDetailsByOrderIdService(orderId);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getorderDetailsBySellerId(req: express.Request, res: express.Response) {
    try {
      const {sellerId} = req.params;
      const user = decodeToken(req.headers);
      console.log("UserId " + sellerId );
      const [error, response] = await getorderDetailsBySellerIdService(sellerId);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async updateOrderStatus(req: express.Request, res: express.Response){
    try{
      const {orderId, sellerId, status} = req.params;
      const [error, response] = await acknowledgeService(orderId, sellerId, status);
      if(error){
        Responder.failed(res, error);
      } else{
        Responder.success(res, response);
      }
    } catch (e){
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
}
