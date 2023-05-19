import { ERRORS } from "../../utils/errors";
import { comparePassword } from "../../utils/bcryptPassword";
import { generateRefreshToken, getToken } from "../../utils/jwt";
import Seller from "../../models/seller.model";

export const GetSellerService = async (query: any): Promise<any[]> => {
  try {
    const totalSellers = await Seller.count();
    const sellers = await Seller.find({}).limit(10).skip(10 * (query.page - 1)).lean();
    if (sellers.length > 0) {
      return [null, {sellers, count: totalSellers}];
    }

    return [null, { message: `No Seller Found` }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting the sellers`,
      },
      null,
    ];
  }
};
export const GetSellersService = async (): Promise<any[]> => {
  try {
    const totalSellers = await Seller.count();
    const sellers = await Seller.find({});
    if (sellers.length > 0) {
      return [null, {sellers, count: totalSellers}];
    }

    return [null, { message: `No Seller Found` }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting the sellers`,
      },
      null,
    ];
  }
};


