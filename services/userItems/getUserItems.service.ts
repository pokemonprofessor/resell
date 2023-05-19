import { ERRORS } from "../../utils/errors";
import UserShoppingItem from "../../models/userShoppingItem.model";
import { IBuyableProduct } from "../../types/product";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { decodeToken } from "../../utils/jwtDecode";
// import {BuyableProduct} from "../../models/product.model";
const { BuyableProduct } = require("../../models/product.model");

export const getUserItemsService = async (
  type: string,
  user: any
): Promise<any[]> => {
  try {
    let userItems = await UserShoppingItem.find({ userId: user._id, type });
    const ids = userItems.map((i: any) => i.productId);
    const products = await BuyableProduct.find(
      { _id: ids },
       { _id: 1, userId: 1, title: 1, price: 1 , saleprice:1, productgroupimageurl: 1, description: 1}
    ).lean();

    const result = products.map((product: any) => {
       const index = userItems.findIndex(
        (item: any) => item?.productId?.toString() === product?._id?.toString()
        );
    if (type === "cart") {
        return {
          ...product,
          cartQty: userItems[index].quantity,
          total: userItems[index].total,
          cartId: userItems[index]._id,
          saveForLater: userItems[index].saveForLater
            ? userItems[index].saveForLater
            : false,
        };
      } else {
        return {
          ...product,
          wishlistQty: userItems[index].quantity,
          total: userItems[index].total,
          wishlistId: userItems[index]._id,
        };
      } 
    }); 

    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while fetching the cart " + e,
      },
      null,
    ];
  } 
};
