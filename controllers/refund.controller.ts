import express from "express";
import { createRefund } from "../services/refund/createRefund.service";
import { IRefund } from "../types/refund";
import { ERRORS } from "../utils/errors";
import Responder from "../utils/expressResponder";

export default class RefundController {
  static async create(req: express.Request, res: express.Response) {
    try {
      const refundData: IRefund = req.body;
      const [error, response] = await createRefund(refundData);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
}
