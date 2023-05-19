import express from "express";
import Responder from "../utils/expressResponder";
import { CreateSellerService, CreateSellerPasswordService } from "../services/sellers/createSeller.service";
import GetSellerService from "../services/sellers/sellerLogin.service";
import UploadService from "../services/sellers/uploadFileSeller.service";
import { ERRORS } from "../utils/errors";

import processFile from "../utils/upload";
import { ISeller } from "../types/seller";
import { onBoardSeller, sellerOrdersDetailsService } from "../services/payment/onSellerBoarding.service";
import { decodeToken } from "../utils/jwtDecode";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BulkProductUploadService } from "../services/sellers/bulkProductUpload.service";
import qs from "qs";
import { bulkUploadSliceIntoChunksProuducts, getFormatedData } from "../services/product/product.services";

export default class SellerController {
  static async signUp(req: express.Request, res: express.Response) {
    try {
      const sellerData: ISeller = req.body.seller;
      const [error, response] = await CreateSellerService(sellerData);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async sellerOrdersDetails(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const sellerData: ISeller = req.body;
      const [error, response] = await sellerOrdersDetailsService(sellerData);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async signIn(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetSellerService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async onBoardSeller(req: express.Request, res: express.Response) {
    try {
      const sellerData: ISeller = req.body;
      const [error, response] = await onBoardSeller(sellerData);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async upload(req: express.Request, res: express.Response) {
    try {
      await processFile(req, res);
      const documentFile = (req as any).files;
      const [error, response] = await UploadService(documentFile, req.body);

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async createPassword(req: express.Request, res: express.Response) {
    try {

      const [error, response] = await CreateSellerPasswordService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async bulkProductUpload(req: express.Request, res: express.Response) {
    await processFile(req, res);
    const post = qs.parse(req as any);
    console.log('post',req);

    const formatedDataValue = await getFormatedData(post.files);
    console.log('formatedDataValue',formatedDataValue);

    const userId = req.body.userId; 
    const username = req.body.username; 

    const formatedDataIntoChunks = await bulkUploadSliceIntoChunksProuducts(
      formatedDataValue 
    ); 

    // console.log('errrrrrrrr',formatedDataIntoChunks);
    formatedDataIntoChunks.forEach(async (item) => {
      try {
        const [error, response] = await BulkProductUploadService({
          data: item as any,
          userId: userId as any,
          username: username as any
        });
        if (error) {
          Responder.failed(res, error);
        } else {
          Responder.success(res, response);
        }
      } catch (e) {
        Responder.failed(res, ERRORS.INTERNAL);
      }
    });
  }
}
