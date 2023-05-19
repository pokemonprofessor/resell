import { ERRORS } from "../../utils/errors";
import UserShoppingItem from "../../models/userShoppingItem.model";
const { BuyableProduct } = require("../../models/product.model");

export const createOrUpdateUserItemsService = async (
  userItemData: any
): Promise<any[]> => {
  try {
    const { user, productId, price ,type,quantity } = userItemData;
   // const quantity =1;
   // const product = await BuyableProduct.findOne({ _id: productId });
    console.log("quantity "+quantity);
    const cartData: any = {
      productId,
      userId: user._id,
      type,
      total: 
        type == "cart"
          ? (price * quantity).toFixed(2)
          : price, 
      quantity,
    };
    const result = await UserShoppingItem.findOneAndUpdate(
      { productId, userId: user._id, type },
      cartData,
      { new: true, upsert: true }
    );
    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while creating the cart " + e,
      },
      null,
    ];
  }
};
