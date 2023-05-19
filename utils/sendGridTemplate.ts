import config from "../config";
import { Email } from "../types/sendEmail";

interface IUser {
  firstName: string;
  email: string;
}

export const emailVerificationObj = (user: IUser) => {
  const verificationOTP = Math.floor(100000 + Math.random() * 900000);
  const tempId = config.get("sendgridVerifyEmailTemplateId");
  const newData = {
    otp: verificationOTP,
    name: user.firstName,
    frontendUrl: config.get("frontEnd"),
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj, verificationOTP };
};

export const emailUpdateVerification = (user: IUser, email: string) => {
  const verificationOTP = Math.floor(100000 + Math.random() * 900000);
  const tempId = config.get("sendgridUpdateEmailTemplateId");
  const newData = {
    otp: verificationOTP,
    name: user.firstName,
    frontendUrl: config.get("frontEnd"),
  };

  const emailObj = <Email>{
    to: email,
    from: config.get("sendGridID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj, verificationOTP };
};

export const passwordResetObj = (user: IUser, token: string) => {
  const tempId = config.get("sendgridResetPassTemplateId");
  const newData = {
    token: token,
    name: user.firstName,
    frontendUrl: config.get("frontEnd"),
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const sellerEmailVerification = (user: IUser) => {
  const verificationOTP = Math.floor(100000 + Math.random() * 900000);
  const tempId = config.get("sendgridSellerVerifyEmailTemplateId");
  const newData = {
    otp: verificationOTP,
    name: user.firstName,
    marketPlaceUrl: config.get("marketPlaceUrl"),
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridSellerID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj, verificationOTP };
};

export const sellerApprovalMail = (user: IUser, token: string) => {
  const tempId = config.get("sendgridApproveSellerTemplateId");
  const newData = {
    name: user.firstName,
    marketPlaceUrl: config.get("marketPlaceUrl"),
    token,
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridSellerID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const sellerRejectionMail = (user: IUser) => {
  const tempId = config.get("sendgridRejectSellerTemplateId");
  const newData = {
    name: user.firstName,
    // marketPlaceUrl: config.get("marketPlaceUrl"),
    //token:
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridSellerID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const sellerResendApprovalMail = (user: IUser, token: string) => {
  const tempId = config.get("sendgridResendApproveSellerTemplateId");
  const newData = {
    name: user.firstName,
    marketPlaceUrl: config.get("marketPlaceUrl"),
    token,
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridSellerID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const sellerSuccessfullOnBoardMail = (seller:IUser,id: string ,token: string) => {
  const tempId = config.get("sendgridSuccessfullOnboardTemplateId");
  const newData = {
    name: seller.firstName,
    marketPlaceUrl: config.get("marketPlaceUrl"),
    id,
    token,
  };

  const emailObj = <Email>{
    to: seller.email,
    from: config.get("sendGridSellerID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const sellerlistingSuccessEmail = (user: IUser) => {
  const tempId = config.get("sendgridListingProductTemplateId");
  const newData = {
    name: user.firstName,
    frontendUrl: config.get("frontEnd"),
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const buyerOrderConfirmationEmail = (user: IUser) => {
  const tempId = config.get("sendgridBuyerOrderConfirmedTemplateId");
  const newData = {
    name: user.firstName,
    frontendUrl: config.get("frontEnd"),
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};

export const sellerPurchaseConfirmationEmail = (user: IUser) => {
  const tempId = config.get("sendgridSellerOrderConfirmedTemplateId");
  const newData = {
    name: user.firstName,
    frontendUrl: config.get("frontEnd"),
  };

  const emailObj = <Email>{
    to: user.email,
    from: config.get("sendGridID"),
    templateId: tempId,
    dynamic_template_data: { ...newData },
  };

  return { emailObj };
};