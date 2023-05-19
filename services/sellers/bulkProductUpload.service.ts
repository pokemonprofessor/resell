import Seller from "../../models/seller.model";
import { ERRORS } from "../../utils/errors";
import { ISeller } from "../../types/seller";
import TempProductUploads from "../../models/productTemp.model";
import { ITempProducts } from "../../types/tempProducts";
import generateId from "../../utils/generateSellerId";
import { createOrUpdateBuyableProductData } from "../../channelAdvisor-API/services/product.services";
import ProductPrices from "../../models/productPrices.modal";
import { IBuyableProduct } from "../../types/product";
import UpsertRecordService from "../search/upsertRecords.service";

interface IProduct {
  data: IData[];
  userId: string;
  username:string;
}
interface IData {
  title: string;
  description: string;
  parentSellerSKU: string;
  SellerSKU: [];
  Quantity: [];
  ListingStatus: [];
  productgroupimageurl:[];
  videourl:[];
  price: [];
}

export const BulkProductUploadService = async (
  productData: IProduct
  ): Promise<any[]> => {
  try {
    // add batch id before saving it to temp records
    // iteration through each product
    //check validation
    let count = 0;
    for (let product of productData.data) {
      count++;
      if (
        !(
          product?.title &&
          product?.description &&
          product?.Quantity &&
          product?.ListingStatus &&
          product?.price
        )
      ) {
        return [
          {
            [ERRORS.BAD_REQUEST]: "Error occured while validating products",
          },
          null,
        ];
      }
    }
    setTimeout(() => {
      upload(productData);
    }, 10000);
    return [null, { message: "Product uploads in progress" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while creating the products",
      },
      null,
    ];
  }
};

const upload = async (  productData: IProduct
  ) => {

    console.log('datatatat'+JSON.stringify(productData))
  if (productData.data) {
    let resultSet = [];

    for (let ele of productData.data as any) {
      let videourls = [];
      let imgUrls = [];
      if(!!ele.productgroupimageurl1){
        imgUrls.push(ele.productgroupimageurl1);
        delete ele.productgroupimageurl1
      }
      if(ele.productgroupimageurl2.length>0){
        imgUrls.push(ele.productgroupimageurl2[0]);
        delete ele.productgroupimageurl2
      }
      if(ele.productgroupimageurl3.length>0){
        imgUrls.push(ele.productgroupimageurl3[0]);
        delete ele.productgroupimageurl3
      }
      if(ele.productgroupimageurl4.length>0){
        imgUrls.push(ele.productgroupimageurl4[0]);
        delete ele.productgroupimageurl4
      }
      

   
      if(ele.videourl1.length>0){
        videourls.push(ele.videourl1[0]);
        delete ele.videourl1

      }
      if(ele.videourl2.length>0){
        videourls.push(ele.videourl2[0]);
        delete ele.videourl2

      }
      if(ele.videourl3.length>0){
        videourls.push(ele.videourl3[0]);
        delete ele.videourl3

      }
      if(ele.videourl4.length>0){
        videourls.push(ele.videourl4[0]);
        delete ele.videourl4
      }
      
      // insert in buyable products
      try {
        const result = await createOrUpdateBuyableProductData({...ele, 
          userId:productData.userId,
          userName:productData.username,
          productgroupimageurl:imgUrls,
          videourl:videourls
          
        });
        resultSet.push(result);
      } catch (e) {
        // single product could not be inserted/updated to buyable products
        console.log("=================> error", e);
      }
    }
    console.log('resultresult',resultSet)
    // Update products on search.io
    if (resultSet.length > 0) {
      await UpsertRecordService(resultSet);
    }
  }
};