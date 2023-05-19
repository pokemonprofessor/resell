import express from "express";
import Responder from "../utils/expressResponder";
import { ERRORS } from "../utils/errors";
import GetAdminService from "../services/admin/adminLogin.service";
// import GetSellerService from "../services/admin/getSellers.service";
import {
  ApproveSellerService,
  ResendApproveSellerService,
} from "../services/admin/sellerApproval.service";
import RejectSellerService from "../services/admin/sellerRejection.service";
import GetProductService from "../services/admin/getProducts.service";
import GetUserService from "../services/admin/getUsers.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { GetSellerService, GetSellersService } from "../services/admin/getSellers.service";

export default class AdminController {
  static async signIn(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetAdminService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async sellers(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetSellerService(req.query); 
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getSellers(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetSellersService(); 
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async sellerApprove(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await ApproveSellerService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async sellerReject(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await RejectSellerService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async sellerApproveResend(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const seller = jwt.decode(req.body.token);
      const [error, response] = await ResendApproveSellerService(seller);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async users(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetUserService(req.query);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async products(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetProductService(req.query);
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
