import { ERRORS } from "../../utils/errors";
import ProductReview from "../../models/productReview.model";
import { decodeToken } from "../../utils/jwtDecode";

export const getProductReviewsService = async (user: any): Promise<any[]> => {
  try {
    const itemsPerPage = 10;
    const result = await ProductReview.find({ userId:  user._id}).lean();
    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while fetching all customer reviews for the product" +
          e,
      },
      null,
    ];
  }
};
