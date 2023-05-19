import Seller from "../models/seller.model";

export async function isAuthenticated(req, res, next) {
  const { sellerid, sellertoken } = req.headers;
  const result = await Seller.findOne({$or:[ {sellerId: sellerid}, {sellerToken: sellertoken}]
  });
  
  if (!result) {
    return res.status(200).send({
      ResponseBody: null,
      Status: "Failed",
      PendingUri: null,
      Errors: [
        {
          ID: "InvalidSellerID",
          ErrorCode: "4002",
          Message:
            "Authorization failed. Invalid SellerID",
        },
        {
          ID: "InvalidToken",
          ErrorCode: "4001",
          Message:
            "Authorization failed. Invalid SellerToken",
        },
      ],
    });
  }
    else if(result.sellerId==sellerid && result.sellerToken != sellertoken){
      return res.status(200).send({
        ResponseBody: null,
        Status: "Failed",
        PendingUri: null,
        Errors: [
          {
            ID: "InvalidToken",
            ErrorCode: "4001",
            Message:
              "Authorization failed. Invalid SellerToken",
          },
        ],
      });
    }
    else if(result.sellerToken==sellertoken && result.sellerId != sellerid){
      return res.status(200).send({
        ResponseBody: null,
        Status: "Failed",
        PendingUri: null,
        Errors: [
          {
            ID: "InvalidSellerID",
            ErrorCode: "4002",
            Message:
              "Authorization failed. Invalid SellerID",
          }
        ],
      });
    }

  next();
}
