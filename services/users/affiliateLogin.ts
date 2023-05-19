import User from '../../models/user.model';
import { ERRORS } from '../../utils/errors';
import { comparePassword } from '../../utils/bcryptPassword';
import { singIn } from '../../types/user';
import { getToken } from '../../utils/jwt';

export const GetAffiliateUser = async (userData : singIn): Promise<any[]> => {
  try {
    const query = {
      $or : [
        { email: userData.emailOrPhone },
        { "phoneNumber": userData.emailOrPhone }
      ]
    };

    let user = await User.findOne(query);

    if (!user) {
      return [ { [ERRORS.UNAUTHORIZED] : "Authentication failed. Invalid email or phone number." } , null];
    }
    if (!comparePassword(userData.password, user.password)) {
      return [ { [ERRORS.UNAUTHORIZED] : "Authentication failed, invalid password." } , null];
    }
    if (!user.isEmailVerified) {
      return [ { [ERRORS.UNAUTHORIZED] : "emailUnverified" } , null];
    }
    const tokenPayload = {
      _id : user._id,
      email : user.email,
      firstName : user.firstName,
      lastName : user.lastName,
      phoneNumber : user.phoneNumber,
      role : user.role
    };
    const token = getToken(tokenPayload);
    if( user.is2FA && !userData.is2FAVerified) {
      return [null, {
        verified : true,
        phoneNumber : user.phoneNumber,
        countryCode : user.countryCode
      }];
    } else {
      return [null, {...tokenPayload, token}];
    }
  } catch(e) {
    return [ { [ERRORS.BAD_REQUEST] : "Error occured while getting the user account" } , null];
  }
}