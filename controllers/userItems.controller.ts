import express from "express";
import Responder from "../utils/expressResponder";
import { IUserItem } from "../types/userItem";
import { createOrUpdateUserItemsService } from "../services/userItems/createUserItems.service";
import { getUserItemsService } from "../services/userItems/getUserItems.service";
import { deleteUserItemsService } from "../services/userItems/deleteUserItems.service";
import { ERRORS } from "../utils/errors";
import { decodeToken } from "../utils/jwtDecode";

export default class UserItemsController {
  static async createOrUpdate(req: express.Request, res: express.Response) {
    try {
   
      const userItemData: IUserItem = req.body;
      const user = decodeToken(req && req.headers);
      const [error, response] = await createOrUpdateUserItemsService({
        ...userItemData, user
      });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async get(req: express.Request, res: express.Response) {
    try {
      const { type } = req.params;
      const user = decodeToken(req && req.headers);
      const [error, response] = await getUserItemsService(type, user);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async delete(req: express.Request, res: express.Response) {
    try {
      const { userItemId } = req.params;
      const [error, response] = await deleteUserItemsService(userItemId);
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
