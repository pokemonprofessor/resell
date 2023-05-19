import { ERRORS } from "../../utils/errors";
import config from "../../config";

//const { BuyableProduct } = require("../../models/product.model");
const gcpBucket = config.get("gcpBucket");
const { BuyableProduct } = require("../../models/product.model");

export const updateProductImageService = async (): Promise<any[]> => {
  try {
    const products = await BuyableProduct.find();
    let countForPlaceholder = 0;
    let countForChannelimage = 0;
    let countForPaysferImage = 0;

    for (let product of products) {
      if (
        product.productgroupimageurl.includes(
          "https://storage.googleapis.com"
        ) &&
        !product.productgroupimageurl.includes("content.paysfer.com")
      ) {
        countForPlaceholder++;
        product.productgroupimageurl[0] = gcpBucket;
      } else if (
        product.productgroupimageurl.includes(
          "https://storage.googleapis.com"
        ) &&
        product.productgroupimageurl.includes("content.paysfer.com")
      ) {
        countForPaysferImage++;
      } else {
        countForChannelimage++;
      }
    }
    return [null, "success"];
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
