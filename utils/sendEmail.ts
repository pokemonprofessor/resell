import sendgrid from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';
import config from "../config";
import { Email } from '../types/sendEmail';

/**
 * Method to send email verification link to an email.
 */
export const sendEmail = async (emailObj: Email) => {
  try {
    sendgrid.setApiKey(config.get ('sendGridAPIKey'));

    const payload: MailData = emailObj;

    console.log(`Sending email to ${emailObj.to}`);
    await sendgrid.send(<any>payload);

  } catch(e) {
    console.error({ e }, ' : Error occured while sending the mail');
    throw new Error (`${e} : Error occured while sending the mail`);
  }
}
