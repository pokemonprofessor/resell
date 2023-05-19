import { ERRORS } from "../../utils/errors";
import ProductReview from "../../models/productReview.model";

export const upvoteProductReviewService = async (_id: any): Promise<any[]> => {
  try {
    const result = await ProductReview.findOneAndUpdate(
      { _id },
      { $inc: { upvote: 1 } }
    );
    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while updating review upvote" + e,
      },
      null,
    ];
  }
};
