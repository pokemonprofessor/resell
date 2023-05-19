import { model, Model, Schema } from "mongoose";
import { ISeller } from "../types/seller";

const SellerSchema: Schema<ISeller> = new Schema(
  {
    sellerId: { type: String },
    sellerToken: { type: String },
    email: {
      type: String,
      unique: true,
      require: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String },
    //  phoneNumber: { type: String, trim: true, required: true },
    // countryCode: { type: String, trim: true },
    // companyName: { type: String, trim: true },
    // address1: { type: String, trim: true },
    // address2: { type: String, trim: true },
    country: { type: String },
    city: { type: String },
    // state: { type: String },
    // postCode: { type: String },
    // governmentId: { type: String },
    // website: { type: String },
    stripeAccountId: { type: String, trim: true },
    paypalID: { type: String, trim: true },
    onBoardingStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    websiteUrl: { type: String },
    sellerType: {
      type: String,
      enum: ["ORGANISATION", "INDIVIDUAL"],
      default: "INDIVIDUAL",
    },
    approvalStatus: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED"],
      default: "PENDING",
    },
    companyRegistration: {
      preferredTaxClassifiacation: {
        type: String,
        enum: ["W-9", "W-8 ECI", ""],
        default: "",
      },
      stateOfIncorporation: { type: String },
      countryOfIncorporation: { type: String },
      stockExchange: { type: Boolean, default: false },
      legalCompanyName: { type: String },
      usTaxID: { type: String },
      DBA: { type: String },
      yearOfFoundation: { type: String },
      DUNS: { type: String },
      usAdress: {
        country: { type: String },
        state: { type: String },
        city: { type: String },
        code: { type: String },
        address1: { type: String },
        address2: { type: String },
        phone: { type: Number },
        companyWebsite: { type: String },
        officeOutsideUS: { type: Boolean, default: false },
      },
    },
    productIntegration: {
      itemCategory: {
        type: [String],
        enum: [
          "Software",
          "Fragrances",
          "Luxury Brands",
          "Cellphones and Accessories",
          "Jewellery and Watches",
          "Others",
        ],
        default: "Others",
      },
      avgOnlineRevenue: { type: String },
      highestPerformingCategory: { type: String },
      catalogSize: { type: String },
      "%SKUrefurbished": {
        type: String,
        enum: ["0%", "1-25%", "26-50%", "51-75%", "76-100%", ""],
        default: "",
      },
      "%SKUValidUPCCode": {
        type: String,
        enum: ["0%", "1-25%", "26-50%", "51-75%", "76-100%", ""],
        default: "",
      },
      "%SKUUsed": {
        type: String,
        enum: ["0%", "1-25%", "26-50%", "51-75%", "76-100%", ""],
        default: "",
      },
    },
    shippingAndOperations: {
      marketPlace: [
        {
          marketPlaceName: { type: String },
          marketPlaceSellerName: { type: String },
          marketPlaceURL: { type: String },
        },
      ],

      integrationType: {
        type: String,
        enum: [
          "Bulk Upload",
          "Simple Integration",
          "API Integration",
          "Solution Providers",
          ""
        ],
        default: "",
      },
      shippingMethods: {
        type: [String],
        enum: ["UPS", "FedEx", "USPS", "DHL", "FBA", "Others"],
        default: "Others",
      },
      briefOnFitForMarketPlace: { type: String },
    },
    // is2FA: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    // trackingId: { type: String },
    uploads: {
      type: [],
    },
  },
  {
    timestamps: true,
  }
);

const Seller: Model<ISeller> = model("Seller", SellerSchema);

export default Seller;
