import { ERRORS } from "../../utils/errors";
import { createFilterQuery } from "../helper/productFilter";
const { Categories } = require("../../models/category.model");
const { BuyableProduct } = require("../../models/product.model");

export const getProductByCategoryService = async (
  category: string,
  obj
): Promise<any[]> => {
  try {
    const itemsPerPage = 10;
    const pageNum = obj.page ? parseInt(obj.page) : 1;
    delete obj.page;

    const categoryResult = await Categories.findOne({
      categoryId: category,
    }).select({ _id: 0, allChildCategoryIds: 1 });

    const ids = categoryResult ? categoryResult.allChildCategoryIds : [];
    let categoryQuery = ids.length != 0 ? ids : category;
    let query = createFilterQuery(obj);
    query = { ...query, categoryId: categoryQuery };
    const products = await BuyableProduct.find(query).limit(10).lean();

    //  const result = optmizedProductData(products);

    return [null, products];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while fetching the top level categories products" + e,
      },
      null,
    ];
  }
};

export const getProductByIdService = async (productId: any): Promise<any> => {
  try {
    const product = await BuyableProduct.findOne({
      _id: productId,
    });
    return [null, product];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while fetching the searched product" + e,
      },
      null,
    ];
  }
};

export const getProductBySearchService = async (
  search,
  page
): Promise<any[]> => {
  try {
    const itemsPerPage = 10;
    const pageNum = page ? page : 1;

    const query = search
      ? { title: { $regex: `${search}`, $options: "i" } }
      : {};

    const products = await BuyableProduct.find({
      $text: { $search: search, $caseSensitive: false },
    });

    return [null, products];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while fetching the searched products" + e,
      },
      null,
    ];
  }
};

const sortProducts = async (page: any, sellerId: any, sortingValue: any) => {
  const itemsPerPage = 3;
  const itemsToBeskipped = (Number(page) - 1) * itemsPerPage;
  let res = [];
  let res1 = [];
  res = await BuyableProduct.find({
    userId: sellerId,
  })
    .sort({ createdAt: -1 })
    .skip(itemsToBeskipped)
    .limit(itemsPerPage);
  res1 = [...res];
  if (sortingValue.price !== null && sortingValue.price === "asc") {
    res1 = [];

    res1 = res.sort(
      (a, b) => parseFloat(a.saleprice) - parseFloat(b.saleprice)
    );
  } else if (sortingValue.price !== null && sortingValue.price === "desc") {
    res1 = [];

    res.sort((a, b) => parseFloat(a.saleprice) - parseFloat(b.saleprice));

    for (let i = res.length - 1; i >= 0; i--) {
      res1.push(res[i]);
    }
  }
  return res1;
};

export const getProductBySellerIdService = async (
  sellerId: any,
  page: any,
  sortingValue: any
): Promise<any> => {
  try {
    const product = await BuyableProduct.find({
      userId: sellerId,
    });
    const finalProduct = await sortProducts(page, sellerId, sortingValue);

    const productResponse = {
      product: finalProduct,
      length: product.length,
    };
    return [null, productResponse];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occured while fetching the products for the seller" + e,
      },
      null,
    ];
  }
};
