import express from "express";
import CategoryController from "../../../controllers/category.controller";

const args = { mergeParams: true };
const categoryRouter = express.Router(args);

categoryRouter.route("/").post(CategoryController.create);
categoryRouter.route("/top").post(CategoryController.createTopCategory);
categoryRouter.route("/").get(CategoryController.get);
categoryRouter.route("/top").get(CategoryController.getTopCategory);
categoryRouter.route("/:parent").get(CategoryController.getByParent);
categoryRouter
  .route("/filter/:categoryId")
  .get(CategoryController.getFiltersByCategory);

export { categoryRouter };
