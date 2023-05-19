import { ERRORS } from "../../utils/errors";
import UpsertRecordService from "../../services/search/upsertRecords.service";
import {
  failResponse,
  successResponse,
} from "../ResponseBuilder/productResponseBuilder";
const { Categories } = require("../../models/category.model");
const { BuyableProduct } = require("../../models/product.model");

export const createProductService = async (
  _id: any,
  productData: any
): Promise<any[]> => {
  try {
    let categoryDetails: any = false;
    let boolean = false;
    let responseArr: any = [];
    let searchIOArr: any = [];

    // for (let [index, p] of productData.entries()) {
    //   // new schema update per search.io starts here

    //   let product = new BuyableProduct();
    //   let productFields = p.Fields;  
    //   let buyableProducts = p.BuyableProducts;
    //   // fetch category Id first and then move forward
    //   let category = productFields.find(
    //     (pField) => pField.Name == "category"
    //   ).Value;

    //   const categoryResult = await Categories.findOne({
    //     categoryId: category,
    //   });
    //   product.category = categoryResult.categoryName;
    //   product.categoryId = category;
    //   product.parentSellerSKU = p.SellerSKU;
    //   product._id = _id;

    //   for (let field of [
    //     "title",
    //     "description",
    //       "category",
    //     "brand",
    //     "condition",
    //     "countryoforigin",
    //     "productgroupimageurl",
    //   ]) {
    //     product[field] = productFields.find(
    //       (pField) => pField.Name == field
    //     ).Value;
    //   }
    //   for (let buyableProduct of buyableProducts) {
    //     for (let field of buyableProduct.Fields) {
    //       product[field.Name]?.push(field.Value);
    //     }
    //     product.SellerSKU.push(buyableProduct.SellerSKU);
    //     product.Quantity.push(buyableProduct.Quantity);
    //     product.ListingStatus.push(buyableProduct.ListingStatus);
    //   }

    //   let result = await createOrUpdateBuyableProductData(product);

    //   if (!result) {
    //     boolean = true;
    //     let response = await failResponse(product);
    //     responseArr.push({
    //       SellerSKU: product.parentSellerSKU,
    //       BuyableProductResults: response,
    //       Errors: [],
    //     });
    //   } else {
    //     searchIOArr.push(result);

    //     let response = await successResponse(product);

    //     responseArr.push({
    //       SellerSKU: product.parentSellerSKU,
    //       BuyableProductResults: response,
    //       Errors: [],
    //     });
    //   }
    // }
    // update search.io with data asynchronously

    // UpsertRecordService(searchIOArr); 
    return [null, responseArr, boolean];
    // new schema code ends here
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while creating products1" + e,
      },
      null,
    ];
  }
};

// export const getProductsService = async (_id: any): Promise<any[]> => {
//   try {
//     let products = await BuyableProduct.find({ _id: _id });

//     let resProducts = [];
//     for (let p of products) {
//       let BuyableProductsArr = [];

//       for (let i = 0; i < p.SellerSKU.length; i++) {
//         BuyableProductsArr.push({
//           SellerSKU: p.SellerSKU[i],
//           Quantity: p.Quantity[i],
//           ListingStatus: p.ListingStatus[i],
//           Fields: [],
//         });
//       }
//       p.Sel;
//       resProducts.push({
//         SellerSKU: p.parentSellerSKU,
//         Fields: [],
//         BuyableProducts: BuyableProductsArr,
//       });

//       // }
//     }

//     return [null, resProducts];
//   } catch (e) {
//     return [
//       {
//         [ERRORS.BAD_REQUEST]: "Error occurred while fetching the products " + e,
//       },
//       null,
//     ];
//   }
// };

export const updateStatusService = async (productData: any): Promise<any[]> => {
  try {
    let boolean = false;
    let responseArr: any = [];
    let searchIOArr = [];
    // new way as suggested by partner support
    for (let p of productData) {
      let obj = {
        SellerSKU: p.SellerSKU,
        BuyableProductResults: [],
        Errors: [],
      };

      for (let buyableProduct of p.BuyableProducts) {
        let foundProduct = await BuyableProduct.findOne({
          SellerSKU: { $elemMatch: { $eq: buyableProduct.SellerSKU } },
        });
        if (foundProduct) {
          let index = foundProduct.SellerSKU.findIndex(
            (i) => i === buyableProduct.SellerSKU
          );
          
          foundProduct.ListingStatus[index] = buyableProduct.ListingStatus;
          foundProduct.Quantity[index] = buyableProduct.Quantity;
          try {
            foundProduct.markModified("ListingStatus");
            foundProduct.markModified("Quantity");
            await foundProduct.save();
            // let response = successResponse(foundProduct);
            obj.BuyableProductResults.push({
              RequestResult: "Success",
              SellerSKU: buyableProduct.SellerSKU,
              Errors: [],
            });
            responseArr.push(obj);
            searchIOArr.push(foundProduct);
          } catch (e) {
            // let response = failResponse(foundProduct);
            obj.BuyableProductResults.push({
              RequestResult: "Fail",
              SellerSKU: buyableProduct.SellerSKU,
              Errors: [
                {
                  ID: "ProductFailedDataValidation",
                  ErrorCode: null,
                  Message: "",
                },
              ],
            });
            responseArr.push(obj);
          }
        }
      }


    }

    // end

    // older way
    // for (let p of productData) {
    //   let obj = {
    //     SellerSKU: p.SellerSKU,
    //     BuyableProductResults: [],
    //     Errors: [],
    //   };
    //   // update status as per new schema
    //   // first fetch product on the basis of parentSellerSKU and then select the indexOf sellerSKU
    //   let foundProduct = await BuyableProduct.findOne({
    //     parentSellerSKU: p.SellerSKU,
    //   });
    //   if (foundProduct) {
    //     for (let buyableProduct of p.BuyableProducts) {
    //       let index = foundProduct.SellerSKU.findIndex(
    //         (i) => i === buyableProduct.SellerSKU
    //       );

    //       foundProduct.ListingStatus[index] = buyableProduct.ListingStatus;
    //     }
    //     try {
    //       foundProduct.markModified("ListingStatus");
    //       await foundProduct.save();
    //       let response = successResponse(foundProduct);
    //       obj.BuyableProductResults.push(...response);
    //       responseArr.push(obj);
    //       searchIOArr.push(foundProduct);
    //     } catch (e) {
    //       let response = failResponse(foundProduct);
    //       obj.BuyableProductResults.push(...response);
    //       responseArr.push(obj);
    //     }
    //   }
    //   // end of new schema logic
    // }
    UpsertRecordService(searchIOArr);
    return [null, responseArr, boolean];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while updating " + e,
      },
      null,
    ];
  }
};

export const updateQuantityPriceService = async (
  productData: any
): Promise<any[]> => {
  try {
    let boolean = false;
    let responseArr = [];
    let searchIOArr = [];
    for (let p of productData) {
      let obj = {
        SellerSKU: p.SellerSKU,
        BuyableProductResults: [],
        Errors: [],
      };

      // code as per new schema
      let foundProduct = await BuyableProduct.findOne({
        parentSellerSKU: p.SellerSKU,
      });
      if (foundProduct) {
        for (let buyableProduct of p.BuyableProducts) {
          let index = foundProduct.SellerSKU.findIndex(
            (i) => i === buyableProduct.SellerSKU
          );

          foundProduct.Quantity[index] = buyableProduct.Quantity;
          foundProduct.price[index] = parseInt(
            buyableProduct.Fields.find((field) => field.Name == "price").Value
          );
        }

        try {
          foundProduct.markModified("Quantity");
          foundProduct.markModified("price");
          await foundProduct.save();
          let response = successResponse(foundProduct);
          obj.BuyableProductResults.push(...response);
          responseArr.push(obj);
          searchIOArr.push(foundProduct);
        } catch (e) {
          let response = failResponse(foundProduct);
          obj.BuyableProductResults.push(...response);
          responseArr.push(obj);
        }
      }

      // end of code as per new schema
    }
    UpsertRecordService(searchIOArr);
    return [null, responseArr, boolean];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while updating " + e,
      },
      null,
    ];
  }
};

export const createOrUpdateBuyableProductData = async (data) => {
  try {
    const dataTobeUpdated = JSON.parse(JSON.stringify(data));
      console.log('resultSetresultSet',BuyableProduct)
    delete dataTobeUpdated._id;
    const result = await BuyableProduct.findOneAndUpdate(
      { productId: dataTobeUpdated.productId },
      dataTobeUpdated,
      {
        upsert: true,
        new: true,
      }
    );
    delete result.ratings;
    return result;
  } catch (e) {
    console.log('rerererer',e)
    return false;
  }
};

export const updateQuantityPriceServiceForDirectSeller = async (
  productData: any
): Promise<any[]> => {
  
  try {
    let boolean = false;
    let responseArr = [];
    let searchIOArr = [];
    for (let p of productData) {
      // console.log('ppppp',p)

      let obj = {
        productId: p.productId,
        BuyableProductResults: [],
        Errors: [],
      };

      // code as per new schema
      let foundProduct = await BuyableProduct.findOne({
        productId: p.productId,
      });
      // console.log('foundProduct',foundProduct)

      if (foundProduct) {
          let index = foundProduct.productId.findIndex(
            (i) => i === p.productId[0]
          );
            // console.log('index',index)
            foundProduct.Quantity[index] = parseInt(p.Quantity[0]);
            foundProduct.saleprice[index] = parseInt(p.saleprice[0]);
            foundProduct.price[index] = parseInt(p.price[0]);
        try {
          // console.log('foundProductfoundProductfoundProduct',foundProduct)
          foundProduct.markModified("Quantity");
          foundProduct.markModified("price");
          foundProduct.markModified("saleprice");
          await foundProduct.save();
          let response = successResponse(foundProduct);

          // console.log('response',response)

          obj.BuyableProductResults.push(...response);
          responseArr.push(obj);
          searchIOArr.push(foundProduct);
        } catch (e) {
          // console.log('eeeee'+JSON.stringify(e))

          let response = failResponse(foundProduct);
          // console.log('ressdfsdfsadf'+JSON.stringify(response))
          obj.BuyableProductResults.push(...response);
          responseArr.push(obj);
        }
      }


      // end of code as per new schema
    }
    // console.log('resss',searchIOArr)
    UpsertRecordService(searchIOArr);
    return [null, responseArr, boolean];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while updating " + e,
      },
      null,
    ];
  }
};