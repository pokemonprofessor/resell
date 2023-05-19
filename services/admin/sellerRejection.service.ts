import Seller from "../../models/seller.model";
import { ERRORS } from "../../utils/errors";
import { ISeller, singIn } from "../../types/seller";
import { sendEmail } from "../../utils/sendEmail";
import { sellerRejectionMail } from "../../utils/sendGridTemplate";

const RejectSellerService = async (sellerData: ISeller): Promise<any[]> => {
  try {
    const seller = await Seller.findOneAndUpdate(
      { email: sellerData.email },
      {  isApproved: false,approvalStatus: "REJECTED"},
      { new: true },
    );
    const { emailObj } = sellerRejectionMail(sellerData);

    await sendEmail(emailObj);
    return [null, { message: "Seller approval rejected by Admin" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while getting the seller account",
      },
      null,
    ];
  }
};

export default RejectSellerService;
