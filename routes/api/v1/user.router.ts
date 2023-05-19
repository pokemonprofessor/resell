import express from "express";
import ImageUploadController from "../../../controllers/imageUploadController";
import userController from "../../../controllers/user.controller";
import { auth } from "../../../middleware/auth.middleware";

const args = { mergeParams: true };
const userRouter = express.Router(args);

userRouter.route("/signup").post(userController.signUp);
userRouter.route("/signin").post(userController.signIn);
userRouter.route("/check-email").post(userController.checkEmail);
userRouter.route("/email-verification").post(userController.verifyEmailOtp);
userRouter.route("/verify-token").post(userController.verifyToken);
userRouter.route("/resend-email").post(userController.resendEmail);
userRouter
  .route("/send-reset-password-link")
  .post(userController.sendResetLink);
userRouter.route("/get-country-code").post(userController.getCountryCode);
userRouter.route("/update-password").post(userController.updatePassword);
userRouter.route("/image-upload").post(ImageUploadController.uploadImage);

userRouter
  .route("/create-address")
  .post(auth, userController.createOrUpdateAddress);
  userRouter.route("/get-address").get(auth, userController.getAddress);
userRouter
  .route("/remove-address/:_id")
  .delete(auth, userController.removeAddress);
userRouter.route("/change-password").post(auth, userController.changePassword);
userRouter
  .route("/update-setting")
  .post(auth, userController.updateUserSetting);
userRouter.route("/verify-email").post(userController.updateEmailVerification);
userRouter
  .route("/set-address-default")
  .post(auth, userController.updateAddressAsDefault);
userRouter.route("/subscribe").post(userController.createSubscribeUser);
userRouter.route("/subscribe").get(userController.getSubscribeUser);
userRouter.route("/access-token").post(userController.getAccessToken);
userRouter.route("/shops").get(userController.getUserShopsByListings);
export { userRouter };
