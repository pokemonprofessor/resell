import express from "express";
import SearchController from "../../../controllers/searchController";

const args = { mergeParams: true };
const searchRouter = express.Router(args);

searchRouter.route("/create-collection").post(SearchController.create);
searchRouter.route("/create-fields").post(SearchController.createFields);
searchRouter.route("/upsert-records").post(SearchController.upsertRecords);
searchRouter.route("/get").get(SearchController.getRecords);
searchRouter.route("/delete-records").delete(SearchController.deleteRecords);

export { searchRouter };
