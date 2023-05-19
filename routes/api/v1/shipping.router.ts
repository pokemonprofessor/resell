import express from "express";
import shippingController from "../../../controllers/shipping.controller";
import { auth } from "../../../middleware/auth.middleware";

const args = { mergeParams: true };
const shippingRouter = express.Router(args);
shippingRouter.route("/printLabel/local").post(shippingController.printLabel);
shippingRouter.route("/trackPackageConnectLocal").post(shippingController.trackPackageConnectLocal);
shippingRouter.route("/trackPackage").post(shippingController.trackPackage);
shippingRouter.route("/printShippingLabel/delivery").post(shippingController.printLabelDelivery);
shippingRouter.route("/printShippingLabel").post(shippingController.printShippingLabelUSPS);

export { shippingRouter };
