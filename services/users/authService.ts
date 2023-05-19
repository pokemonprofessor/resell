import User from "../../models/user.model";
import { ERRORS } from "../../utils/errors";
import {
  generateRefreshToken,
  getToken,
  verifyRefreshToken,
} from "../../utils/jwt";

const generateAccessToken = async (refreshToken: string): Promise<any[]> => {
  try {
    if (!refreshToken) {
      return [
        {
          [ERRORS.UNAUTHORIZED]: "Refresh Token not found in request",
        },
        null,
      ];
    }

    let payload = null;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return [
        {
          [ERRORS.BAD_REQUEST]: "Refresh Token has been expired. Please log-in",
        },
        null,
      ];
    }
    //if token is valid check if user exist
    const user = await User.findOne({
      email: payload?.email,
    });

    if (!user)
      return [
        {
          [ERRORS.BAD_REQUEST]: "User doesn't exists",
        },
        null,
      ];

    const tokenPayload = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      is2FA: user.is2FA,
    };

    const updatedToken = getToken(tokenPayload);
    const updateRefreshToken = generateRefreshToken(tokenPayload);

    return [
      null,
      {
        token: updatedToken,
        refreshToken: updateRefreshToken,
      },
    ];
  } catch (e) {
    return [
      { [ERRORS.BAD_REQUEST]: "Error occured while getting the user account" },
      null,
    ];
  }
};

export default generateAccessToken;
