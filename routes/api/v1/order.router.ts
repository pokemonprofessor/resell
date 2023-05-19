import express from "express";
import OrderController from "../../../controllers/order.controller";
import { auth } from "../../../middleware/auth.middleware";

const args = { mergeParams: true };
const orderRouter = express.Router(args);

orderRouter.route("/").post(auth, OrderController.create);
orderRouter.route("/history").get(auth, OrderController.getHistory);
orderRouter.route("/seller/:sellerId").get(auth, OrderController.getorderDetailsBySellerId);
orderRouter.route("/:orderId").get(auth, OrderController.getOrderDetailsByOrderId);
orderRouter.route("/updateStatus/:orderId&sellerId:sellerId&status:status").post(auth, OrderController.updateOrderStatus);
export { orderRouter };
