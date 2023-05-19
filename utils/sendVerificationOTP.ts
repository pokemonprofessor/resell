import VerificationToken from "../models/verificationToken";
import { Email } from "../types/sendEmail";
import { IVerificationToken } from "../types/verificationToken";
import nodemailer from "nodemailer";
import { sendEmail } from "./sendEmail";

/**
 * This method is called after signup (buyer/seller) to save
 * verification token and send email verification link to the user.
 */
export const sendVerificationOTP = async (otp: number, emailObj: Email) => {
  try {
    await sendEmail(emailObj);
  } catch (e) {
    console.error(
      { e },
      " : Error occured while sending email verifcation otp"
    );
  }
};
