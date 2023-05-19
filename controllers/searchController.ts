import Responder from "../utils/expressResponder";
import CreateCollectionService from "../services/search/createCollection.service";
import CreateFieldsService from "../services/search/createFields.service";
import UpsertRecordService from "../services/search/upsertRecords.service";
import GetSearchService from "../services/search/getSearch.service";
import DeleteRecordService from "../services/search/deleteRecords.service";
import express from "express";

export default class SearchController {
  static async create(req: express.Request, res: express.Response) {
    const { id, displayName } = req.body;
    const [error, response] = await CreateCollectionService(id, displayName);
    if (error) {
      Responder.failed(res, error);
    } else {
      Responder.success(res, response);
    }
  }

  static async createFields(req: express.Request, res: express.Response) {
    const { id, displayName } = req.body;
    const [error, response] = await CreateFieldsService();
    if (error) {
      Responder.failed(res, error);
    } else {
      Responder.success(res, response);
    }
  }

  static async upsertRecords(req: express.Request, res: express.Response) {
    const { id, displayName } = req.body;
    let records = []
    const [error, response] = await UpsertRecordService(records = []);
    if (error) {
      Responder.failed(res, error);
    } else {
      Responder.success(res, response);
    }
  }

  static async getRecords(req: express.Request, res: express.Response) {
    const { query } = req.query;
    const [error, response] = await GetSearchService(query);
    if (error) {
      Responder.failed(res, error);
    } else {
      Responder.success(res, response);
    }
  }

  static async deleteRecords(req: express.Request, res: express.Response) {
    const [error, response] = await DeleteRecordService();
    if (error) {
      Responder.failed(res, error);
    } else {
      Responder.success(res, response);
    }
  }


}
