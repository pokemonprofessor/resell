import express from "express";
import Responder from "../utils/expressResponder";
import {
  // getProductsService,
  createProductService,
  updateStatusService,
  updateQuantityPriceService,
} from "../services/product/product.services";
import { ERRORS } from "../utils/errors";
import UploadImageService from "../services/imageUpload/imageUpload.service";
import processFile from "../utils/upload";

export default class ImageUploadController {
  static async uploadImage(req: express.Request, res: express.Response) {
    console.log('eerererer')

    try {
      await processFile(req, res);
        console.log('eerererer',req)
      const documentFile = (req as any).files;
      const [error, response] = await UploadImageService(documentFile, req.body);
      console.log('responseresponseresponseresponse',error,response)

      if (error) {
        console.log('errrr',error)
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

}
