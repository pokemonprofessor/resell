import Seller from "../../models/seller.model";
import { ERRORS } from "../../utils/errors";
import { comparePassword } from "../../utils/bcryptPassword";
import { singIn } from "../../types/seller";
import { generateRefreshToken, getToken } from "../../utils/jwt";

const GetSellerService = async (sellerData: singIn): Promise<any[]> => {
  try {
    const query = {
      $or: [{ email: sellerData.email }],
    };

    let seller = await Seller.findOne(query);

    if (!seller) {
      return [
        {
          [ERRORS.UNAUTHORIZED]:
            "Authentication failed. Invalid email id.",
        },
        null,
      ];
    }
    if (!comparePassword(sellerData.password, seller.password)) {
      return [
        { [ERRORS.UNAUTHORIZED]: "Authentication failed, invalid password." },
        null,
      ];
    }

    const tokenPayload = {
      _id: seller._id,
      email: seller.email,
      firstName: seller.firstName,
      lastName: seller.lastName,
    };

    const token = getToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return [null, { token, refreshToken }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while getting the seller account",
      },
      null,
    ];
  }
};

export default GetSellerService;
