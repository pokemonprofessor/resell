import User from "../../models/user.model";
import { ERRORS } from "../../utils/errors";

export const getUserShopsByListings = async (): Promise<any[]> => {
  try {
    const query = {
      /*   $ne :[
     /*   {  bannerImages : [] },
        { description : "" }, 
        { username: "" }
      ], */
      $gt: {
        noOfListings: 2,
      },
    };
    console.log("hello");
    let users = await User.find(
      { noOfListings: { $gt: 1 } },
    );
    return [null, users];
  } catch (e) {
    return [
      { [ERRORS.BAD_REQUEST]: "Error occured while fetching the user shops" },
      null,
    ];
  }
};
