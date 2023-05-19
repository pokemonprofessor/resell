import { ERRORS } from "../../utils/errors";
import User from "../../models/user.model";

const GetUserService = async (query:any): Promise<any[]> => {
  try {
    const totalUsers = await User.count();
    const users = await User.find({}, {password: 0}).limit(10).skip(10 * (query.page - 1)).lean();

    return [null, {users, count: totalUsers}];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting the users`,
      },
      null,
    ];
  }
};

export default GetUserService;
