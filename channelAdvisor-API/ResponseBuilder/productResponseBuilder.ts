export const successResponse =  (product) => {
  let buyableSuccessArr = [];
  product.SellerSKU.forEach((sku) => {
    buyableSuccessArr.push({
      RequestResult: "Success",
      SellerSKU: sku,
      Errors: [],
    });
  });
  return buyableSuccessArr;
};

export const failResponse =  (product) => {
  let buyableFailArr = [];

  product.SellerSKU.forEach((sku) => {
    buyableFailArr.push({
      RequestResult: "Fail",
      SellerSKU: sku,
      Errors: [
        {
          ID: "ProductFailedDataValidation",
          ErrorCode: null,
          Message: "",
        },
      ],
    });
  });
  return buyableFailArr;
};
