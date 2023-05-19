import Seller from "../../models/seller.model";
import { ERRORS } from "../../utils/errors";
import { ISeller } from "../../types/seller";
import { sellerApprovalMail, sellerResendApprovalMail } from "../../utils/sendGridTemplate";
import { getToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";

export const ApproveSellerService = async (sellerData: ISeller): Promise<any[]> => {
  try {
    const seller = await Seller.findOneAndUpdate(
      { email: sellerData.email },
      { isApproved: true ,approvalStatus: "APPROVED"},
      { new: true },
    );
    
    // const tokenPayload = {
    //   email: seller.email,
    //   firstName: seller.firstName,
    //   lastName: seller.lastName,
    // };

    // const token = getToken(tokenPayload);
    // const { emailObj } = sellerApprovalMail(sellerData, token);
    // await sendEmail(emailObj); 

    return [null, { message: "Seller approved by Admin" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while getting the seller account",
      },
      null,
    ];
  }
};

export const ResendApproveSellerService = async (sellerData: any): Promise<any[]> => {
  try {
    const tokenPayload = {
      email: sellerData.email,
      firstName: sellerData.firstName,
      lastName: sellerData.lastName,
    };

    const token = getToken(tokenPayload);
    const { emailObj } = sellerResendApprovalMail(sellerData, token);
    await sendEmail(emailObj);

    return [null, { message: "Seller approved by Admin" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while getting the seller account",
      },
      null,
    ];
  }
};

