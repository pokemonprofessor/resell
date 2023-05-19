import VerificationToken from "../models/verificationToken";
import { Email } from "../types/sendEmail";
import nodemailer from "nodemailer";
import { sendEmail } from "./sendEmail";
import VerificationEmail from "../models/verificationEmail.model";

/**
 * This method is called after signup (buyer/seller) to save
 * verification token and send email verification link to the user.
 */
export const sendVerificationLink = async (
  verificationObj: Object,
  emailObj: Email
) => {
  try {
    const verificationEmail = new VerificationEmail(verificationObj);
    await verificationEmail.save();

    await sendEmail(emailObj);
  } catch (e) {
    console.error(
      { e },
      " : Error occured while sending email verifcation link"
    );
  }
};
