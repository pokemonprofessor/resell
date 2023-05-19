import User from "../../models/user.model";
import { ERRORS } from "../../utils/errors";
import { IUser } from "../../types/user";
import {
  getResetPasswordToken,
  getToken,
  resetPasswordPayload,
  verifyResetPasswordToken,
} from "../../utils/jwt";
import { hashPassword } from "../../utils/bcryptPassword";
import { sendVerificationLink } from "../../utils/sendVerificationLink";
import moment from "moment";
import { uuid } from "uuidv4";
import { IVerificationToken } from "../../types/verificationToken";
import { Email } from "../../types/sendEmail";
import nodemailer from "nodemailer";
import { sendEmail } from "../../utils/sendEmail";
import config from "../../config";

export const CreateAffiliateUserService = async (
  userData: IUser
): Promise<any[]> => {
  try {
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }

    const newUser = new User(userData);
    let createNewUser = await newUser.save();

    console.log(
      `Preparing to send email verification link to ${createNewUser.email}`
    );

    const emailVerificationToken = <IVerificationToken>{
      userId: createNewUser._id,
      token: uuid(),
      expiryTime: moment().add(3, "days"),
    };

    const emailObj = <Email>{
      to: createNewUser.email,
      from: config.get("sendGridID"),
      subject: "Paysfer - Email verification",
      html: `<strong>Please click on the link below to verify your email</strong><br/>
      <a href="${config.get("frontEnd")}/verify-token/${emailVerificationToken.token}">Verify Email</a>`,
    };

    await sendVerificationLink(emailVerificationToken, emailObj);

    const tokenPayload = {
      _id: createNewUser._id,
      email: createNewUser.email,
      firstName: createNewUser.firstName,
      lastName: createNewUser.lastName,
      phoneNumber: createNewUser.phoneNumber,
      countryCode: createNewUser.countryCode,
      role: createNewUser.role,
    };
    const token = getToken(tokenPayload);
    return [null, { ...tokenPayload, token }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while creating the user account",
      },
      null,
    ];
  }
};
