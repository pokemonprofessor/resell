import express from "express";
import Responder from "../utils/expressResponder";
import {
  getProductByCategoryService,
  getProductByIdService,
  getProductBySearchService,
  getProductBySellerIdService,
} from "../services/product/getProduct.service";
import { getProductReviewsService } from "../services/product/getProductReviews.service";
import { createProductReviewService } from "../services/product/createProductReview.service";
import { upvoteProductReviewService } from "../services/product/upvoteProductReview.service";
import {
  importProductService,
  upsertProductService,
} from "../services/product/importProduct.service";
import {
  // getProductsService,
  createProductService,
  updateStatusService,
  updateQuantityPriceService,
  bulkUploadSliceIntoChunksProuducts,
  getFormatedDataForProductQtyAndPriceUpdate,
  updateProductService,
} from "../services/product/product.services";
import { ERRORS } from "../utils/errors";
import { updateProductImageService } from "../services/product/updateProductImageService";
import { decodeToken } from "../utils/jwtDecode";
import processFile from "../utils/upload";
import qs from "qs";
import { updateQuantityPriceServiceForDirectSeller } from "../channelAdvisor-API/services/product.services";

export default class ProductController {
  static async getProductByCategory(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { category } = req.params;
      const obj = req.query;
      const [error, response] = await getProductByCategoryService(
        category,
        obj
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

  static async getProductBySearch(req: express.Request, res: express.Response) {
    try {
      const { search, page } = req.query;
      const [error, response] = await getProductBySearchService(search, page);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getProductById(req: express.Request, res: express.Response) {
    try {
      const { productId } = req.params;
      const [error, response] = await getProductByIdService(productId);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async createReview(req: express.Request, res: express.Response) {
    try {
      const review = req.body;
      const { page } = req.query;
      const user = decodeToken(req.headers);
      const [error, response] = await createProductReviewService(review, user);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async getReviews(req: express.Request, res: express.Response) {
    try {
      const { page } = req.query;
      const user = decodeToken(req.headers);
      const [error, response] = await getProductReviewsService(user);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async upvoteReview(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const { page } = req.query;
      const [error, response] = await upvoteProductReviewService(id);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async importProducts(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      const [error, response] = await upsertProductService(data);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async updateProductsImage(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const data = req.body;
      const [error, response] = await updateProductImageService();
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async create(req: express.Request, res: express.Response) {
    try {
      const { sellerid } = req.headers;
      const [error, response, boolean] = await createProductService(req.body);

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getProductBySellerId(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { page } = req.query;
      const { sort }: any = req.query;
      const { sellerId } = req.params;
      const sortingValue = JSON.parse(sort);
      const [error, response] = await getProductBySellerIdService(
        sellerId,
        page,
        sortingValue
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

  static async directQuantityPrice(
    req: express.Request,
    res: express.Response
  ) {
    await processFile(req, res);
    const post = qs.parse(req as any);

    const formatedDataValue = await getFormatedDataForProductQtyAndPriceUpdate(
      post.files
    );
    const sellerId = req.body.sellerId;

    const formatedDataIntoChunks = await bulkUploadSliceIntoChunksProuducts(
      formatedDataValue
    );

    console.log(
      "formatedDataIntoChunksformatedDataIntoChunks",
      formatedDataIntoChunks
    );
    formatedDataIntoChunks.forEach(async (item) => {
      try {
        const [error, response] =
          await updateQuantityPriceServiceForDirectSeller(item);
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

  static async updateProductData(req: express.Request, res: express.Response) {
    try {
      const { productId } = req.params;
      const [error, response] = await updateProductService(productId, req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      console.log(e);
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
}
