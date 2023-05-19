import express from "express";
import sellerController from "../../../controllers/seller.controller";
import { auth } from "../../../middleware/auth.middleware";
import productController from "../../../controllers/product.controller";

const args = { mergeParams: true };
const sellerRouter = express.Router(args);
sellerRouter.route("/signup").post(sellerController.signUp);
sellerRouter.route("/signin").post(sellerController.signIn);
sellerRouter.route("/upload").post(sellerController.upload);
sellerRouter.route("/create-password").put(sellerController.createPassword);
sellerRouter.route("/on-board").post(sellerController.onBoardSeller);
sellerRouter
  .route("/seller-orders-details")
  .post(sellerController.sellerOrdersDetails);
sellerRouter
  .route("/bulk-upload")
  .post(auth, sellerController.bulkProductUpload);
sellerRouter
  .route("/direct-quantityprice")
  .post(auth, productController.directQuantityPrice);

export { sellerRouter };
