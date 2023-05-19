export const successResponse =  (product) => {
  let buyableSuccessArr = [];
  // product.SellerSKU.forEach((sku) => {
    buyableSuccessArr.push({
      RequestResult: "Success",
      product,
      Errors: [],
    });
  // });
  return buyableSuccessArr;
};

export const failResponse =  (product) => {
  let buyableFailArr = [];

  // product.SellerSKU.forEach((sku) => {
    buyableFailArr.push({
      RequestResult: "Fail",
      title: product.title,
      Errors: [
        {
          ID: "ProductFailedDataValidation",
          ErrorCode: null,
          Message: "",
        },
      ],
    });
  // });
  return buyableFailArr;
};
