import express from "express";
import Responder from "../utils/expressResponder";
import { IOrder } from "../../types/order";
import { ERRORS } from "../utils/errors";
import {
  getOrdersService,
  getOrderService,
  acknowledgeService,
  fulfillService,
  cancelService,
} from "../services/order.services";
const { Order } = require("../../models/order.model");

export default class OrderController {
  static async getOrders(req: express.Request, res: express.Response) {
    try {
      const { sellerid } = req.headers;
      const [error, response, boolean] = await getOrdersService(
        sellerid,
        req.body,
        req.query
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getOrder(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const {sellerid} = req.headers;

      const [error, response, boolean] = await getOrderService(sellerid, id);
      if (error) {
        Responder.orderFailed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async acknowledge(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const { sellerid } = req.headers;
      const [error, response, boolean] = await acknowledgeService(sellerid,id);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async fulfill(req: express.Request, res: express.Response) {
    try {
      const orderFulfillment = req.body;
      const { sellerid } = req.headers;
      const [error, response, boolean] = await fulfillService(
        sellerid,
        orderFulfillment
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async cancel(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const { sellerid } = req.headers;
      const [error, response, boolean] = await cancelService(
        sellerid,
        req.body,
        id
      );

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async refund(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const { sellerid } = req.headers;
      const [error, response, boolean] = await cancelService(
        sellerid,
        req.body,
        id
      );

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ["error"]);
    }
  }
}
