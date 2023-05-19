import config from "../config";
import User from "../models/user.model";
import VerificationEmail from "../models/verificationEmail.model";
import { emailVerificationObj } from "./sendGridTemplate";
import { ERRORS } from "./errors";
import { sendVerificationLink } from "./sendVerificationLink";

const tempId = config.get("sendgridVerifyEmailTemplateId");

export const resendEmailVerificationLink = async (
  data: any
): Promise<any[]> => {
  try {
    const user = await User.findOne({
      email: data.email,
    });

    if (!user) {
      console.error("Cant get user with email", data.email);
      return [{ [ERRORS.BAD_REQUEST]: "emailInvalid" }, null];
    }
    if (user.isEmailVerified) {
      console.error("Email is already verified", data.email);
      return [{ [ERRORS.BAD_REQUEST]: "emailIsAlreadyVerified" }, null];
    }

    await VerificationEmail.deleteOne({ email: user.email });

    // function for creating email obj
    const { emailObj, verificationOTP } = emailVerificationObj(user)

    await sendVerificationLink(
      { otp: verificationOTP, email: user.email },
      emailObj
    );
    return [null, { sent: true }];
  } catch (e) {
    console.error({ e }, "Error occured while sending email");
    throw new Error(`${e} : Error occured while sending email`);
  }
};
