import express from "express";
import Responder from "../utils/expressResponder";
import { ICategory } from "../types/category";
import {
  createCategoryService,
  createTopCategoryService,
} from "../services/category/createCategory.service";
import {
  getTopLevelCategoryService,
  getTopCategoryService,
  getCategoryByParentService,
  getFiltersByCategoryService,
} from "../services/category/getCategory.service";
import { ERRORS } from "../utils/errors";

export default class CategoryController {
  static async create(req: express.Request, res: express.Response) {
    try {
      const categoryData: ICategory[] = req.body;
      const [error, response] = await createCategoryService(categoryData);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async createTopCategory(req: express.Request, res: express.Response) {
    try {
      const categoryData: ICategory[] = req.body;
      const [error, response] = await createTopCategoryService(categoryData);
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
      const [error, response] = await getTopLevelCategoryService();
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getByParent(req: express.Request, res: express.Response) {
    try {
      const { parent } = req.params;
      const [error, response] = await getCategoryByParentService(parent);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getTopCategory(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await getTopCategoryService();
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async getFiltersByCategory(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { categoryId } = req.params;
      const [error, response] = await getFiltersByCategoryService(categoryId);
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
