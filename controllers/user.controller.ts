import express from "express";
import Responder from "../utils/expressResponder";
import CreateBuyerUserService, {
  checkEmailAlreadyExist,
  fetchCountryCode,
  passwordUpdate,
  sendResetPasswordLink,
  getUserAddress,
  createOrUpdateUserAddress,
  removeUserAddress,
  resetPassword,
  updateUserSetting,
  UpdateEmailVerificationService,
  setAddressAsDefault,
  createSubscribeUser,
  getSubscribeUser,
  emailVerification,
} from "../services/users/createBuyer.service";
import {getUserShopsByListings} from "../services/users/userShops.service";
import GetUserService from "../services/users/buyerLogin.service";
import { IUser } from "../types/user";
import { ERRORS } from "../utils/errors";
import { tokenVerification } from "../utils/verifyToken";
import { resendEmailVerificationLink } from "../utils/resendEmail";
import { onBoardSeller } from "../services/payment/onSellerBoarding.service";
import { ISeller } from "../types/seller";
import generateAccessToken from "../services/users/authService";
import { decodeToken } from "../utils/jwtDecode";

export default class UserController {
  static async signUp(req: express.Request, res: express.Response) {
    try {
      const userData: IUser = req.body;
      const [error, response] = await CreateBuyerUserService(userData);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async signIn(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await GetUserService(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async checkEmail(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await checkEmailAlreadyExist(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async verifyToken(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await tokenVerification(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async verifyEmailOtp(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await emailVerification(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async resendEmail(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await resendEmailVerificationLink(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async sendResetLink(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await sendResetPasswordLink(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getCountryCode(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await fetchCountryCode(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async updatePassword(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await passwordUpdate(req.body);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async createOrUpdateAddress(
    req: express.Request,
    res: express.Request
  ) {
    try {
      const user = decodeToken(req.headers);
      const [error, response] = await createOrUpdateUserAddress({
        ...req.body,
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
  static async getAddress(req: express.Request, res: express.Request) {
    try {
      const user = decodeToken(req && req.headers);
      const [error, response] = await getUserAddress(user);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async removeAddress(req: express.Request, res: express.Request) {
    try {
      const { _id } = req.params;
      const [error, response] = await removeUserAddress(_id);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async changePassword(req: express.Request, res: express.Response) {
    try {
      const user = decodeToken(req && req.headers);
      const [error, response] = await resetPassword({ ...req.body, user });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async updateUserSetting(req: express.Request, res: express.Response) {
    try {
      const user = decodeToken(req && req.headers);
      const [error, response] = await updateUserSetting({ ...req.body, user });
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async updateEmailVerification(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { userId, email } = req.body;
      const [error, response] = await UpdateEmailVerificationService(
        userId,
        email
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

  static async updateAddressAsDefault(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { setAsDefault } = req.body;
      const [error, response] = await setAddressAsDefault(setAsDefault);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }
  static async createSubscribeUser(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const { email } = req.body;
      const [error, response] = await createSubscribeUser(email);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getSubscribeUser(req: express.Request, res: express.Response) {
    try {
      const [error, response] = await getSubscribeUser();
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getAccessToken(req: express.Request, res: express.Response) {
    try {
      const { refreshToken } = req.body;
      const [error, response] = await generateAccessToken(refreshToken);
      if (error) {
        Responder.failed(res, error);
      } else {
        Responder.success(res, response);
      }
    } catch (e) {
      Responder.failed(res, ERRORS.INTERNAL);
    }
  }

  static async getUserShopsByListings(req:express.Request, res: express.Response){
    try {
    const[error, response] = await getUserShopsByListings();
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
