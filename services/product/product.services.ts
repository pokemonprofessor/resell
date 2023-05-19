import { ERRORS } from "../../utils/errors";
import UpsertRecordService from "../../services/search/upsertRecords.service";
import {
  failResponse,
  successResponse,
} from "../../ResponseBuilder/productResponseBuilder";
import { IBuyableProduct } from "../../types/product";
const { Categories } = require("../../models/category.model");
//const { BuyableProduct } = require("../../models/product.model");
import User from "../../models/user.model";
import {sellerlistingSuccessEmail} from "../../utils/sendGridTemplate";
import { sendVerificationLink } from "../../utils/sendVerificationLink";
import { sendEmail } from "../../utils/sendEmail";
const { BuyableProduct } = require("../../models/product.model");
import XLSX from "xlsx";

export const createProductService = async (  
  productData: IBuyableProduct
): Promise<any[]> => {
  try {
    let categoryDetails: any = false;
    let boolean = false;
    let responseArr: any = [];
    let searchIOArr: any = [];

      let product = new BuyableProduct();
      product.title =  productData.title;
      product.brand = productData.brand;
      product.category = productData.category;
      product.condition = productData.condition;
      product.collegeName = productData.collegeName;
      product.userName = productData.userName;
      product.shippingcoststandard = productData.shippingcoststandard;
      product.shippingcostexpedited = productData.shippingcostexpedited;
      product.shippinglength = productData.shippinglength;
      product.shippingwidth = productData.shippingwidth;
      product.shippingheight = productData.shippingheight;
      product.shippingweight = productData.shippingweight;
      product.productgroupimageurl = productData.productgroupimageurl.slice();
      product.videourl = productData.videourl;
      product.lengthunit = productData.lengthunit;
      product.widthunit = productData.widthunit;
      product.userId = productData.userId;
      product.userName = productData.userName;
      product.color = productData.color;
      product.size = productData.size;
      product.description = productData.description;
      product.ListingStatus = productData.ListingStatus;
      product.material =productData.material;
      product.price = productData.price;
      product.saleprice = productData.saleprice;
      product.Quantity = productData.Quantity;
      console.log(product.userId);

      let result = await createOrUpdateBuyableProductData(product);

      if (result === false) {
        boolean = true;
        let response = await failResponse(product);
        responseArr.push({
          BuyableProductResults: response,
          Errors: [],
        });
      } else {
        searchIOArr.push(result);

        let response = await successResponse(product);

        responseArr.push({
          BuyableProductResults: response,
          Errors: [],
        });

        // update search.io with data asynchronously
        UpsertRecordService(searchIOArr);
        
        // Send Email on successful Listing posted
        const userResult = await User.findOne({_id:product.userId});   
        console.log(userResult.firstName);
        const { emailObj } = sellerlistingSuccessEmail(userResult);

        await sendEmail(emailObj);
        var noOfListings = userResult.noOfListings;
        let userData = await User.findOneAndUpdate({ _id: userResult._id }, {noOfListings: noOfListings+1}, {
          new: true,
        });
      }
    // }
  
    return [null, responseArr, boolean];
    // new schema code ends here
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while creating products2" + e,
      },
      null,
    ];
  }
};

// export const getProductsService = async (sellerid: any): Promise<any[]> => {
//   try {
//     let products = await BuyableProduct.find({ SellerId: sellerid });

//     let resProducts = [];
//     for (let p of products) {
//       let BuyableProductsArr = [];

//       for (let i = 0; i < p.SellerSKU.length; i++) {
//         BuyableProductsArr.push({
//           Quantity: p.Quantity[i],
//           ListingStatus: p.ListingStatus,
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
     /*   if (foundProduct) {
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
        }  */
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
    /*  if (foundProduct) {
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
      } */

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
    const result = await BuyableProduct.findOneAndUpdate(
      { _id: data._id },
      dataTobeUpdated,
      {
        upsert: true,
        new: true,
      }
    );  
    return result;
  } catch (e) {
    return false;
  }
};
const convertToJson = (csv: any) => {
  var lines = csv.split("\n");

  var result = [];

  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length - 1; i++) {
    var obj: any = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }
  return JSON.stringify(result);
};

const createProductData = async (productData: any) => {

  // console.log('productDataproductData',productData)
  let data: any[] = [];
  let _productData: any[] = [];
  productData = JSON.parse(productData);

  productData.forEach(function (item: any) {
      data.push({
        saleprice: Number(item["Sale Price"]),
        productId: item["Product Id"],
        shippingcoststandard: Number(item["Shipping Cost Standard"]),
        shippingcostexpedited: Number(item["Shipping Cost Expedited"]),
        shippinglength: item["Shipping Length"],
        shippingwidth: item["Shipping Width"],
        shippingheight: item["Shipping Height"],
        shippingweight: item["Shipping Weight"],
        title: item["Title"],
        description: item["Description"],
        category: item["Category Name"],
        condition: item["Condition"],
        brand: item["Brand"],
        price:  Number(item["Price"]),
        Quantity: Number(item["Quantity"]),
        ListingStatus: item["Listing Status"],
        productgroupimageurl1: item["Product Group Image URL 1"],
        productgroupimageurl2: [item["Product Group Image URL 2"]],
        productgroupimageurl3: [item["Product Group Image URL 3"]],
        productgroupimageurl4: [item["Product Group Image URL 4"]],
        videourl1: [item["Video URL 1"]],
        videourl2: [item["Video URL 2"]],
        videourl3: [item["Video URL 3"]],
        videourl4: [item["Video URL 4"]],
        color: item["Color"],
        material: item["Material"],
        lengthUnit: item["Length Unit"],
        widthUnit: item["Width Unit"],
      });
  
  });

  for (let i = 0; i < data.length - 1; i++) {
    _productData.push(data[i]);
  }

  return _productData;
};

export const getFormatedData = async (file) => {
  Object.assign(file[0], { name: file[0].fieldname });
  const f = file[0];
  const wb = XLSX.read(f.buffer, { type: "buffer" });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = XLSX.utils.sheet_to_csv(ws);
  const _products = convertToJson(data);
  const products = await createProductData(_products);
  return products;
};

async function sliceIntoChunks(arr: any[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
async function processProducts(data: any) {
  let formatedData: any = await sliceIntoChunks(data, 200);
  return formatedData;
}

export const bulkUploadSliceIntoChunksProuducts = async (data: any) => {
  let result = await processProducts(data);
  return result;
};


const createProductDataForProductQtyAndPriceUpdate = (productData: any) => {
  let data: any[] = [];
  let _productData: any[] = [];
  productData = JSON.parse(productData);
  productData.forEach(function (item: any) {
    data.push({
      saleprice: Number(item["Sale Price"]),
      productId: item["Product Id"],
      price:  Number(item["Price"]),
      Quantity: Number(item["Quantity"]),
      ListingStatus: item["Listing Status"],
    });

});
  for (let i =0; i < data.length-1; i++) {
    _productData.push(data[i]);
  }
  return _productData;
};

export const getFormatedDataForProductQtyAndPriceUpdate = async (file) => {
  Object.assign(file[0], { name: file[0].fieldname });
  const f = file[0];
  const wb = XLSX.read(f.buffer, { type: "buffer" });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = XLSX.utils.sheet_to_csv(ws);
  const _products = convertToJson(data);
  const products = await createProductDataForProductQtyAndPriceUpdate(
    _products
  );
  return products;
};

export const updateProductService = async (
  productId: any,
  productData: any
) => {
  let product = new BuyableProduct();
  product._id = productId;
  product.title = productData.title;
  product.brand = productData.brand;
  product.category = productData.category;
  product.condition = productData.condition;
  product.collegeName = productData.collegeName;
  product.userName = productData.userName;
  product.shippingcoststandard = productData.shippingcoststandard;
  product.shippingcostexpedited = productData.shippingcostexpedited;
  product.shippinglength = productData.shippinglength;
  product.shippingwidth = productData.shippingwidth;
  product.shippingheight = productData.shippingheight;
  product.shippingweight = productData.shippingweight;
  product.productgroupimageurl = productData.productgroupimageurl.slice();
  product.videourl = productData.videourl;
  product.lengthunit = productData.lengthunit;
  product.widthunit = productData.widthunit;
  product.userId = productData.userId;
  product.userName = productData.userName;
  product.color = productData.color;
  product.size = productData.size;
  product.description = productData.description;
  product.ListingStatus = productData.ListingStatus;
  product.material = productData.material;
  product.price = productData.price;
  product.saleprice = productData.saleprice;
  product.Quantity = productData.Quantity;
  const result = await BuyableProduct.findOneAndUpdate(
    { _id: productId },
    product,
    {
      new: true,
    }
  );
  if (!result) {
    return [{ [ERRORS.BAD_REQUEST]: "Product Not Found" }, null];
  } else {
    return [null, result];
  }
};
