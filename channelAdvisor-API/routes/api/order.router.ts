import express from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import OrderController from "../../controllers/order.controller";

const args = { mergeParams: true };
const orderRouterV2 = express.Router(args);
const orderRouter = express.Router(args);

orderRouterV2.route("/").get(isAuthenticated, OrderController.getOrders);
orderRouterV2.route("/:id").get(isAuthenticated, OrderController.getOrder);
orderRouter
  .route("/:id/acknowledge")
  .post(isAuthenticated, OrderController.acknowledge);
orderRouter.route("/fulfill").post(isAuthenticated, OrderController.fulfill);
orderRouter.route("/:id/cancel").post(isAuthenticated, OrderController.cancel);
orderRouter.route("/:id/refund").post(isAuthenticated, OrderController.refund);

export { orderRouter, orderRouterV2 };
