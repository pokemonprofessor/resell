import { ERRORS } from "../../utils/errors";
import ProductReview from "../../models/productReview.model";
import UpsertRecordService from "../search/upsertRecords.service";
const { BuyableProduct } = require("../../models/product.model");

export const createProductReviewService = async (
  review: any,
  user: any
): Promise<any[]> => {
  try {
    const itemsPerPage = 10;
    review = { ...review, userId: user._id };
    const data = new ProductReview(review);
    const result = await data.save();

    if (result) {
      // Fetch product and update avg rating and count of a specific ratings and also ratingCount

      const query = `ratings.${data.rating}`;
      const product = await BuyableProduct.findOne({ _id: data.productId });

      product.ratings = {
        ...product.ratings,
        [data.rating]: product.ratings[data.rating] + 1,
      };

      const avgRating =
        ((product.ratings[5] * 5 +
          product.ratings[4] * 4 +
          product.ratings[3] * 3 +
          product.ratings[2] * 2 +
          product.ratings[1]) *
          1) /
        (product.ratings[5] +
          product.ratings[4] +
          product.ratings[3] +
          product.ratings[2] +
          product.ratings[1]);

      const updateProduct = await BuyableProduct.findByIdAndUpdate(
        { _id: data.productId },
        { $inc: { [query]: 1, ratingCount: 1 }, rating: avgRating.toFixed(1) },
        { new: true }
      );
      UpsertRecordService([updateProduct])
      return [null, updateProduct];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while creating customer review for product" + e,
      },
      null,
    ];
  }
};
