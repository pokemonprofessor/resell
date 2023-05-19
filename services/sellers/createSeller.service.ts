import Seller from "../../models/seller.model";
import { ERRORS } from "../../utils/errors";
import { ISeller } from "../../types/seller";
import {
  getResetPasswordToken,
  resetPasswordPayload,
  verifyResetPasswordToken,
} from "../../utils/jwt";
import { hashPassword } from "../../utils/bcryptPassword";
import { Email } from "../../types/sendEmail";
import { sendEmail } from "../../utils/sendEmail";
import config from "../../config";

export const CreateSellerService = async (
  sellerData: ISeller
): Promise<any[]> => {
  try {
    if (sellerData.email) {
      const sellerExist = await Seller.findOne({ email: sellerData.email });
      if (!sellerExist) {
        const newUser = new Seller(sellerData);
        let createNewSeller = await newUser.save();
        return [null, createNewSeller];
      } else {
        // update existing seller
        const updateSeller = await Seller.findOneAndUpdate(
          { email: sellerData.email },
          sellerData,
          { new: true }
        );

        return [null, updateSeller];
      }
    }
    return [{ [ERRORS.BAD_REQUEST]: "Email not found" }, null];
  } catch (e) {
    console.log("eroror", e);
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while creating the seller account",
      },
      null,
    ];
  }
};

export const CreateSellerPasswordService = async (
  sellerData: any
): Promise<any[]> => {
  try {
    console.log(sellerData)
    if (sellerData.password && sellerData.email) {
      sellerData.password = await hashPassword(sellerData.password);

      await Seller.findOneAndUpdate(
        { email: sellerData.email },
        { password: sellerData.password }
      );

      return [null, { message: "Password created successfully" }];
    }
    return [{ [ERRORS.BAD_REQUEST]: "Please provide password" }, null];
  } catch (e) {
    console.log("=================>", e)
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while creating the seller password",
      },
      null,
    ];
  }
};

export const sendResetPasswordLink = async (data: any): Promise<any[]> => {
  try {
    let user = await Seller.findOne({
      email: { $regex: new RegExp("^" + data.email, "i") },
    });

    if (!user) {
      return [{ [ERRORS.BAD_REQUEST]: "userNotFound" }, null];
    } else {
      console.log(`Preparing to send email verification link to ${data.email}`);

      let tokenPayload: resetPasswordPayload = {
        email: user.email,
        userId: user._id,
        resetType: "email",
      };

      let token = getResetPasswordToken(tokenPayload);

      const emailObj = <Email>{
        to: user.email,
        from: config.get("sendGridID"),
        subject: "Paysfer - Reset Password",
        html: `<strong>Please click on the link below to reset your password</strong><br/>
        <a href="${config.get(
          "frontEnd"
        )}/reset-password/email?token=${token}">Reset Password</a>`,
      };

      await sendEmail(emailObj);
      console.log("Mail sent");

      return [null, { ...tokenPayload, token }];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while creating the user account",
      },
      null,
    ];
  }
};

export const passwordUpdate = async (data: any): Promise<any[]> => {
  try {
    if (data.token) {
      let payload: any = verifyResetPasswordToken(data.token);

      let seller = await Seller.findOne({
        email: { $regex: new RegExp("^" + payload.email, "i") },
      });

      if (!seller) {
        return [{ [ERRORS.BAD_REQUEST]: "sellerNotFound" }, null];
      } else {
        _updatePassword({ sellerId: seller._id, password: data.password });
        return [null, { passwordUpdated: true }];
      }
    } else if (data.phoneNumber) {
      let seller = await Seller.findOne({ phoneNumber: data.phoneNumber });

      if (!seller) {
        return [{ [ERRORS.BAD_REQUEST]: "sellerNotFound" }, null];
      } else {
        _updatePassword({ sellerId: seller._id, password: data.password });
        return [null, { passwordUpdated: true }];
      }
    }
  } catch (e) {
    console.error({ e }, "Error occured while updating the password");
    return [
      { [ERRORS.BAD_REQUEST]: "Error occured while updating the password" },
      null,
    ];
  }
};

const _updatePassword = async (data: any): Promise<any> => {
  try {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    let seller = await Seller.findOneAndUpdate(
      {
        _id: data.sellerId,
      },
      {
        $set: {
          password: data.password,
        },
      },
      {
        useFindAndModify: false,
      }
    );
  } catch (e) {
    throw e;
  }
};
