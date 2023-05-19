// @ts-nocheck
import axios from "axios";
import Stripe from "stripe";
import { uuid } from "uuidv4";
import config from "../../config";
import Seller from "../../models/seller.model";
import { ISeller } from "../../types/seller";
import { ERRORS } from "../../utils/errors";
import { sendEmail } from "../../utils/sendEmail";
import { sellerSuccessfullOnBoardMail } from "../../utils/sendGridTemplate";
import  generateSellerId  from "../../utils/generateSellerId";
import { generateSellerToken } from "../../utils/generateSellerToken";
const secretkey = config.get("stripeSecretKey");
const STATIC_URL = config.get("paypalServiceUrl");
const stripe = new Stripe(secretkey, {
  apiVersion: "2020-03-02"
});
const MARKETPLACE_URL = config.get("marketPlaceUrl");

const generateAccountLink = (accountID, origin) => {
  return stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `https://dashboard.stripe.com/`,
      return_url: `${origin}/seller/signin`,
    })
    .then((link) => link.url);
};

export const onBoardSeller = async (sellerData: ISeller): Promise<any[]> => {
  try {

    const email: string = sellerData.email;
    const user = await Seller.findOne({ email });
    
    const defaultCountryForStripOnboarding = 'US';

    if (user) {
      const account = await stripe.accounts.create({
        type: "standard",
        email: sellerData.email,
        country: user.country ? user.country : defaultCountryForStripOnboarding,
        business_type: "individual",
        individual: {
          first_name: sellerData.firstName,
          last_name: sellerData.lastName,
          // phone: sellerData.phoneNumber,
          // address: {
          //   city: sellerData.city,
          //   country: sellerData.country,
          //   postal_code: sellerData.postCode,
          //   state: sellerData.state,
          //   line1: sellerData.address1,
          //   line2: sellerData.address2,
          // },
        },
      });
      console.log ('testing-------------',account);

      await Seller.findOneAndUpdate(
        { email },
        {
          stripeAccountId: account.id,
        }
      );
      const accountLinkURL = await generateAccountLink(
        account.id,
        MARKETPLACE_URL
      );
      return [null, { url: accountLinkURL, id: account.id }];
    } else {
      return [
        {
          [ERRORS.BAD_REQUEST]: "Seller with this email not exist in database",
        },
        ,
        null,
      ];
    }
  } catch (err) {
    return [
      { [ERRORS.BAD_REQUEST]: "Error occured while doing on-boarding" },
      ,
      null,
    ];
  }
};

export const updateSellerAccounts = async (account: any) => {
  const sellerId = generateSellerId();
  const sellerToken = generateSellerToken();

  if (account.details_submitted && account.charges_enabled) {
    console.log("=================inside first if condition")
    const findSeller = await Seller.findOne({ stripeAccountId: account.id });
    if (!findSeller.sellerId && !findSeller.sellerToken) {
      console.log("=================inside second if condition")
      const seller = await Seller.findOneAndUpdate(
        { stripeAccountId: account.id },
        {
          onBoardingStatus: "COMPLETED",
          sellerId: sellerId,
          sellerToken: sellerToken,
        },
        { new: true }
      );

      const { emailObj } = sellerSuccessfullOnBoardMail(
        seller,
        sellerId,
        sellerToken
      );

      await sendEmail(emailObj);
    }
  }
  console.log("=================outside if condition")
};

export const onBoardSellerPaypal = async (
  token: string,
  sellerData: ISeller
): Promise<any[]> => {
  try {
    const header = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const UUID = uuid();
    const request = {
      email: sellerData.email,
      tracking_id: UUID,
      products: ["EXPRESS_CHECKOUT"],
    };
    const response = await axios.post(
      `${STATIC_URL}/customer/partner-referrals`,
      request,
      { headers: header }
    );
    if (response) {
      await Seller.findOneAndUpdate(
        { email: sellerData.email },
        { trackingId: UUID }
      );
    }
    return [null, { response: response }];
  } catch (error) {
    return [{}, null];
  }
};

export const webhookSellerOnboardingCompleted = async (
  webhookEvent: any
): Promise<any[]> => {
  try {
    await Seller.findOneAndUpdate(
      { trackingId: webhookEvent.tracking_id },
      { onBoardingStatus: "COMPLETED" }
    );
    return [null, {}];
  } catch (error) {
    return [{}, null];
  }
};
function selleronBoardCompletionMail(
  sellerData: any,
  token: any
): { emailObj: any } {
  throw new Error("Function not implemented.");
}
export const sellerOrdersDetailsService = async (data: any): Promise<any[]> => {
  try {
    const seller = await Seller.findOne({ _id: data.sellerId });
    const orderCount = await Order.count({ SellerId: seller.sellerId });
    const orders = await Order.aggregate([
      {
        //$match:  orderQuery.userId
        $match: {
          SellerId: seller.sellerId
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: data.itemsPerPage * (data.page - 1) },
      { $limit: data.itemsPerPage },
    ]);

    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      let payout = await Payout.findOne({ "orderDetails.orderID": [order.ID] }, { transferID: 1, createdAt: 1, PayoutStatus: 1 });
      orders[index]["payoutDetails"] = payout;
      const address = await Address.find({ _id: orders[index].ShippingAddress});
      orders[index]["address"] = address;
    }
    // const orders = await Order.find({ SellerId: sellerData.sellerId });
    return [null, { orders, orderCount }];
  } catch (err) {
    return [{}, null];
  }
}