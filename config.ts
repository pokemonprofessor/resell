import convict from "convict";
require("dotenv").config();

const {
  APP_NAME,
  APP_PORT,
  APP_ENV,
  FRONT_END_URL,
  MONGO_DB_URL,
  JWT_SECRET,
  JWT_EXPIRY,
  JWT_EXPIRY_RESET_PASSWORD,
  SENDGRID_API_KEY,
  SENDGRID_ID,
  SENDGRID_SELLER_ID,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SIGN_KEY,
  STRIPE_CONNECT_WEBHOOK_SIGN_KEY,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_WEBHOOK_ID,
  PAYPAL_SERVICE_URL,
  SEARCHIO_ACCOUNT_ID,
  SEARCHIO_COLLECTION_ID,
  SEARCHIO_KEY_ID,
  SEARCHIO_KEY_SECRET,
  SEARCHIO_PIPELINE,
  SEARCHIO_VERSION,
  GCP_BUCKET_URL,
  JWT_REFRESH_TOKEN_SECRET_KEY,
  JWT_REFRESH_TOKEN_EXPIRY,
  SENDGRID_VERIFY_EMAIL_TEMPLATE_ID,
  SENDGRID_RESET_PASS_TEMPLATE_ID,
  SENDGRID_UPDATE_EMAIL_TEMPLATE_ID,
  SENDGRID_APPROVE_SELLER_TEMPLATE_ID,
  SENDGRID_REJECT_SELLER_TEMPLATE_ID,
  SENDGRID_SUCCESSFULL_ONBOARD_TEMPLATE_ID,
  MARKETPLACE_URL,
  GCP_SELLER_BUCKET,
  SENDGRID_SELLER_EMAIL_VERIFIY_TEMPLATE_ID,
  SENDGRID_RESEND_APPROVE_SELLER_TEMPLATE_ID,
  SENDGRID_LISTING_PRODUCT_TEMPLATE_ID,
  SENDGRID_BUYER_ORDER_CONFIRMED_TEMPLATE_ID,
  SENDGRID_SELLER_ORDER_CONFIRMED_TEMPLATE_ID,
  ADMIN_URL,
} = process.env;
// TODO: set .env and pass all the credentials there
const config = convict({
  app: {
    name: {
      default: APP_NAME,
      doc: "Paysfer Backend",
      format: String,
    },
  },
  port: {
    default: APP_PORT,
    doc: "The port to bind.",
    env: "PORT",
    format: Number,
  },
  frontEnd: {
    // default: "https://www.pay-emart.com",
    default: FRONT_END_URL,
  },
  mongodb: {
    //  default: "mongodb://paysferMongoAdmin:paysfer%40#!@localhost:27017/paysfer?authSource=admin",
    default: MONGO_DB_URL,
    doc: "The mongodb to bind.",
    format: String,
  },
  jwtSecret: {
    default: JWT_SECRET,
    doc: "JWT Access-Token Secret key",
    format: String,
  },
  jwtRefreshTokenSecretKey: {
    default: JWT_REFRESH_TOKEN_SECRET_KEY,
    doc: "JWT Refresh Token Secret key",
    format: String,
  },
  jwtRefreshTokenExpiry: {
    default: JWT_REFRESH_TOKEN_EXPIRY,
    env: "JWT_EXPIRY",
    doc: "JWT expiry time",
    format: String,
  },
  jwtExpiry: {
    default: JWT_EXPIRY,
    env: "JWT_EXPIRY",
    doc: "JWT expiry time",
    format: String,
  },
  jwtExpiryResetPassword: {
    default: JWT_EXPIRY_RESET_PASSWORD,
    env: "JWT_EXPIRY_RESET_PASSWORD",
    doc: "JWT expiry time for Reset Password",
    format: String,
  },
  env: {
    default: APP_ENV,
    doc: "The application environment.",
    env: "NODE_ENV",
    format: ["production", "development", "staging", "test"],
  },
  sendGridAPIKey: {
    default: SENDGRID_API_KEY,
    doc: "Send Grid API key",
    env: "SENDGRID_API_KEY",
    format: String,
  },
  sendGridID: {
    default: SENDGRID_ID,
    format: String,
  },
  sendGridSellerID:{
    default: SENDGRID_SELLER_ID,
    format: String,
  },
  stripeSecretKey: {
    default: STRIPE_SECRET_KEY,
  },
  stripeWebhookSignKey: {
    default: STRIPE_WEBHOOK_SIGN_KEY,
  },
  stripeConnectWebhookSignKey: {
    default: STRIPE_CONNECT_WEBHOOK_SIGN_KEY,
  },
  paypalClientID: {
    default: PAYPAL_CLIENT_ID,
  },
  paypalClientSecret: {
    default: PAYPAL_CLIENT_SECRET,
  },
  paypalWebhookID: {
    default: PAYPAL_WEBHOOK_ID,
  },
  paypalServiceUrl: {
    default: PAYPAL_SERVICE_URL,
  },
  searchIO: {
    accountId: { default: SEARCHIO_ACCOUNT_ID },
    collectionId: { default: SEARCHIO_COLLECTION_ID },
    keyId: { default: SEARCHIO_KEY_ID },
    keySecret: { default: SEARCHIO_KEY_SECRET },
    pipeline: { default: SEARCHIO_PIPELINE },
    version: { default: SEARCHIO_VERSION },
  },
  gcpBucket: {
    default: GCP_BUCKET_URL,
  },
  gcpSellerBucket: {
    default: GCP_SELLER_BUCKET,
  },
  sendgridVerifyEmailTemplateId: {
    default: SENDGRID_VERIFY_EMAIL_TEMPLATE_ID,
  },
  sendgridResetPassTemplateId: {
    default: SENDGRID_RESET_PASS_TEMPLATE_ID,
  },
  sendgridUpdateEmailTemplateId: {
    default: SENDGRID_UPDATE_EMAIL_TEMPLATE_ID,
  },
  sendgridApproveSellerTemplateId: {
    default: SENDGRID_APPROVE_SELLER_TEMPLATE_ID,
  },
  sendgridRejectSellerTemplateId: {
    default: SENDGRID_REJECT_SELLER_TEMPLATE_ID,
  },
  sendgridSuccessfullOnboardTemplateId: {
    default: SENDGRID_SUCCESSFULL_ONBOARD_TEMPLATE_ID,
  },
  sendgridSellerVerifyEmailTemplateId: {
    default: SENDGRID_SELLER_EMAIL_VERIFIY_TEMPLATE_ID,
  },
  sendgridResendApproveSellerTemplateId: {
    default: SENDGRID_RESEND_APPROVE_SELLER_TEMPLATE_ID,
  },
  sendgridListingProductTemplateId: {
    default: SENDGRID_LISTING_PRODUCT_TEMPLATE_ID,
  },
  sendgridBuyerOrderConfirmedTemplateId: {
    default: SENDGRID_BUYER_ORDER_CONFIRMED_TEMPLATE_ID,
  },
  sendgridSellerOrderConfirmedTemplateId: {
    default: SENDGRID_SELLER_ORDER_CONFIRMED_TEMPLATE_ID,
  },
  marketPlaceUrl: {
    default: MARKETPLACE_URL,
  },
  adminUrl: {
    default: ADMIN_URL,
  },
});

config.validate({ allowed: "strict" });

export default config;
