import { ERRORS } from "../../utils/errors";
import UserShoppingItem from "../../models/userShoppingItem.model";

export const deleteUserItemsService = async (userItemId: any): Promise<any[]> => {
  try {
    const result = await UserShoppingItem.findOneAndDelete({ _id: userItemId });
    return [null, {message: "User item removed successfully"}];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while deleting the cart details" + e,
      },
      null,
    ];
  }
};
