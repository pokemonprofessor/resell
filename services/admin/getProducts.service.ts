import { ERRORS } from "../../utils/errors";
const { BuyableProduct } = require("../../models/product.model");
const GetProductService = async (query: any): Promise<any[]> => {
  try {
    const totalProducts = await BuyableProduct.count();
    const products = await BuyableProduct.find({}).limit(10).skip(10 * (query.page - 1)).lean();

    return [null, {products, count: totalProducts}];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while fetching the products" + e,
      },
      null,
    ];
  }
};
export default GetProductService;
