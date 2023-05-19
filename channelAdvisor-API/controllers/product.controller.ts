import express from "express";
import Responder from "../utils/expressResponder";
import { ERRORS } from "../utils/errors";
import {
  // getProductsService,
  createProductService,
  updateStatusService,
  updateQuantityPriceService,
} from "../services/product.services";

export default class ProductController {
  // static async getProducts(req: express.Request, res: express.Response) {
  //   try {
  //     const { _id } = req.headers;
  //     const [error, response, boolean] = await getProductsService(_id);

  //     if (error) {
  //       Responder.failed(res, error);
  //     } else {
  //       Responder.success(res, response, boolean);
  //     }
  //   } catch (e) {
  //     Responder.failed(res, ERRORS.INTERNAL);
  //   }
  // }

  static async create(req: express.Request, res: express.Response) {
    try {
      const { _id } = req.headers;
      const [error, response, boolean] = await createProductService(
        _id,
        req.body
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

  static async status(req: express.Request, res: express.Response) {
    try {
      // const productData = req.body;
      const [error, response, boolean] = await updateStatusService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response, boolean);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async quantityprice(req: express.Request, res: express.Response) {
    try {
      const productData = req.body;

      const [error, response, boolean] = await updateQuantityPriceService(
        req.body
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
}
