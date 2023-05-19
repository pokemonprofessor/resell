import { ERRORS } from "../../utils/errors";
import ProductReview from "../../models/productReview.model";
import Filters from "../../models/filter.model";
//const { BuyableProduct } = require("../../models/product.model");
const { BuyableProduct } = require("../../models/product.model");
const { Categories } = require("../../models/category.model");
//const data = require("../../results_array.json");

// check if the product exists in the system if yes update if no insert

export const upsertProductService = async (data1: any): Promise<any[]> => {
  try {
    // check if the product already exists if yes update if no insert
    const categories = await Categories.find(
      {},
      { categoryId: 1, categoryName: 1, _id: 0 }
    );
    // for (let p of data) {
    //   const productExist = await BuyableProduct.findOne({
    //     parentSellerSKU: p.parentSellerSKU,
    //   });
    //   if (!productExist) {
    //     // insert the product to db but first convert the price string to array
    //     delete p.rating;
    //     delete p.ratingCount;
    //     p.price = p.price.split(",");
    //     p.category = p.category.replace("&amp;", "&");
    //     let index = categories.findIndex((i) => i.categoryName == p.category);
    //     if (index !== -1) {
    //       p.categoryId = categories[index].categoryId;
    //     }
    //     await BuyableProduct.create(p);
    //   } else {
    //     console.log("product exist");
    //   }
    // }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while updating products" + e,
      },
      null,
    ];
  }
};

export const importProductService = async (data1: any): Promise<any[]> => {
  try {
    let categoryDetails: any = false;
    let filterArr: any = {};
    const categories = await Categories.find(
      {},
      { categoryId: 1, categoryName: 1, _id: 0 }
    );
    let count = 0;

    //splitArrayIntoChunksOfLen(data, 10000, categories); //split into chunks

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

async function splitArrayIntoChunksOfLen(arr, len, categories) {
  let chunks = [],
    i = 0,
    n = arr.length;
  while (i < n) {
    let data = arr.slice(i, (i += len));
    for (let p of data) {
      p.category = p.category.replace("&amp;", "&");
      let index = categories.findIndex((i) => i.categoryName == p.category);
      if (index !== -1) {
        p.categoryId = categories[index].categoryId;
      }
    }

    const result = await BuyableProduct.insertMany(data, {
      ordered: false,
    });
    // chunks.push(arr.slice(i, i += len));
  }
  return true;
}
