import express from "express";
import PaymentController from "../../../controllers/payment.controller";
import { auth } from "../../../middleware/auth.middleware";

const args = { mergeParams: true };
const paymentRouter = express.Router(args);
paymentRouter.route("/stripe").post(auth, PaymentController.createStripeIntent);
paymentRouter.route("/stripe-checkout").post(auth, PaymentController.createStripeCheckoutSession);
paymentRouter.route("/stripe/payment-methods/list").get(auth, PaymentController.getPaymentMethods);
paymentRouter.route("/stripe/payment-methods/delete/:paymentMethodId").delete(auth, PaymentController.deletePaymentMethods);
paymentRouter.route("/stripe/payment-methods/add").post(auth, PaymentController.addPaymentMethods);
paymentRouter.route("/stripe/payment-status").post(auth, PaymentController.getPaymentStatus);
paymentRouter.route("/stripe/tax-codes/list").get(auth, PaymentController.getTaxCodes);
paymentRouter.route("/paypal").post(auth, PaymentController.createPaypalIntent);
paymentRouter
  .route("/stripe/create-subscription")
  .post(auth, PaymentController.createStripeSubscription);
paymentRouter
  .route("/stripe/subscriptions/list")
  .get(auth, PaymentController.getAllSubscriptions);
paymentRouter
  .route("/stripe/subscriptions/update")
  .patch(auth, PaymentController.updateSubscription);
paymentRouter
  .route("/stripe/subscriptions/delete/:subscriptionId")
  .delete(auth, PaymentController.cancelStripeSubscription);
paymentRouter
  .route("/stripe-webhook")
  .post(
    express.raw({ type: "*/*" }),
    PaymentController.handleStripePaymentWebhook
  );
paymentRouter
  .route("/paypal-webhook")
  .post(PaymentController.handlePaypalPaymentWebhook);
paymentRouter
  .route("/stripe/update/payment-intent")
  .post(auth, PaymentController.handleStripePaymentIntentUpdate);
paymentRouter
  .route("/stripe-connect-webhook")
  .post(
    express.raw({ type: "*/*" }),
    PaymentController.handleStripeConnectPaymentWebhook
  );
export { paymentRouter };
