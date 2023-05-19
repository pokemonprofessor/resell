import express from "express";
import adminController from "../../controllers/admin.controller";
import { auth } from "../../middleware/auth.middleware";

const args = { mergeParams: true };
const adminRouter = express.Router(args);

adminRouter.route("/signin").post(adminController.signIn);
adminRouter.route("/sellers").get(auth, adminController.sellers);
adminRouter.route("/get-sellers").get(adminController.getSellers);
adminRouter.route("/seller-approve").post(auth, adminController.sellerApprove);
adminRouter
  .route("/seller-disapprove")
  .post(auth, adminController.sellerReject);
adminRouter
  .route("/seller-resend-email")
  .post(adminController.sellerApproveResend);
adminRouter.route("/users").get(auth, adminController.users);
adminRouter.route("/products").get(auth, adminController.products);
export { adminRouter };
