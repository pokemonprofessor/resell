import express from "express";
import {
  createStripePaymentIntent,
  createPaypalPaymentOrderIntent,
  updateStripePaymentIntent,
  createStripeProductSubscription,
  cancelStripeProductSubscription,
  getStripePaymentMethods,
  deleteStripePaymentMethods,
  addStripePaymentMethod,
  getAllStripeSubscriptions,
  updateStripeSubscription,
  getTaxCodesService,
  createStripeCheckoutSessionService,
  getPaymentStatus,
} from "../services/payment/createPayment.service";
import { acknowledgeWebhookStripe } from "../services/payment/webhookStripe.service";
import { acknowledgeWebhookPaypal } from "../services/payment/webhookPayPal.service";
import { IBuyableProduct } from "../types/product";
import { IUser } from "../types/user";
import { ERRORS } from "../utils/errors";
import Responder from "../utils/expressResponder";
import { verifyToken } from "../utils/jwt";
import { decodeToken } from "../utils/jwtDecode";
import { acknowledgeWebhookStripeConnect } from "../services/payment/webhookConnectStripe.service";

export default class PaymentController {
  static async createStripeIntent(req: express.Request, res: express.Response) {
    try {
      const { requestData } = req.body;
      const user = decodeToken(req.headers);
      const [error, response] = await createStripePaymentIntent({
        ...requestData,
        user,
      });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async createStripeCheckoutSession(req: express.Request, res: express.Response) {
    try {
      const { requestData } = req.body;
      const user = decodeToken(req.headers);
      const [error, response] = await createStripeCheckoutSessionService({
        ...requestData,
        user,
      });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getPaymentMethods(req: express.Request, res: express.Response) {
    try {
      const userId = decodeToken(req.headers);
      const [error, response] = await getStripePaymentMethods({ userId });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getTaxCodes(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await getTaxCodesService();
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async deletePaymentMethods(req: express.Request, res: express.Response) {
    try {
      const { paymentMethodId } = req.params;
      const [error, response] = await deleteStripePaymentMethods({ paymentMethodId });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async addPaymentMethods(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await addStripePaymentMethod(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }


  static async getPaymentStatus(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await getPaymentStatus(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async createPaypalIntent(req: express.Request, res: express.Response) {
    try {
      const { userId, addressId, cartIds, orderIntentID, requestData } =
        req.body;
      const user = decodeToken(req.headers);
      const [error, response] = await createPaypalPaymentOrderIntent(
        { ...requestData, user }
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async createStripeSubscription(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { addressId, requestData } = req.body;
      const user = decodeToken(req.headers);
      const [error, response] = await createStripeProductSubscription({
        ...requestData,
        user,
      }
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getAllSubscriptions(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { requestData } = req.body;
      const user = decodeToken(req.headers);
      const [error, response] = await getAllStripeSubscriptions({
        ...requestData,
        user,
      }
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async updateSubscription(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const requestData = req.body;
      const [error, response] = await updateStripeSubscription({
        ...requestData,
      }
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async cancelStripeSubscription(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { subscriptionId } = req.params;
      const user = decodeToken(req.headers);
      const [error, response] = await cancelStripeProductSubscription({
        subscriptionId,
        user
      }
      );
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async handleStripePaymentWebhook(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const [error, response] = await acknowledgeWebhookStripe(req);

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async handlePaypalPaymentWebhook(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const [error, response] = await acknowledgeWebhookPaypal(req, res);

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async handleStripePaymentIntentUpdate(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { clientSecretKey, paymentMethodId } = req.body;
      const [error, response] = await updateStripePaymentIntent(
        clientSecretKey,
        paymentMethodId
      );

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async handleStripeConnectPaymentWebhook(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const [error, response] = await acknowledgeWebhookStripeConnect(req);

      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
}
