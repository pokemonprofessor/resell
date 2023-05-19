import Admin from "../../models/admin.model";
import { ERRORS } from "../../utils/errors";
import { comparePassword } from "../../utils/bcryptPassword";
import { singIn } from "../../types/admin";
import { generateRefreshToken, getToken } from "../../utils/jwt";

const GetAdminService = async (adminData: singIn): Promise<any[]> => {
  try {
    let admin = await Admin.findOne({ email: adminData.email });

    if (!admin) {
      return [
        {
          [ERRORS.UNAUTHORIZED]: "Authentication failed. Invalid email ID.",
        },
        null,
      ];
    }
    if (!comparePassword(adminData.password, admin.password)) {
      return [
        { [ERRORS.UNAUTHORIZED]: "Authentication failed, invalid password." },
        null,
      ];
    }

    const tokenPayload = {
      _id: admin._id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
    };

    const token = getToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return [null, { ...tokenPayload, token, refreshToken }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occured while getting the admin account",
      },
      null,
    ];
  }
};

export default GetAdminService;
