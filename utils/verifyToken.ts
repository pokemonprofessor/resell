import moment from "moment";
import User from "../models/user.model";
import VerificationToken from "../models/verificationToken"
import { ERRORS } from "./errors";

export const tokenVerification = async (data:any): Promise<any[]> => {
  try {
    const result = await VerificationToken.findOne({
      "token" : data.token
    });

    if (!result) {
      return [ { [ERRORS.BAD_REQUEST] : "tokenInvalid"}, null];
    }

    if ( result.token === data.token && moment(result.expiryTime).isAfter(moment()) ) {
      //Check if email is already verified
      let user = await User.findOne({_id : result.userId});

      if (user.isEmailVerified) {
        return [ { [ERRORS.BAD_REQUEST] : "tokenAlreadyVerified"}, null];

      } else {
        //Update 'isEmailVerified flag' in user schema.
        let verifiedToken = await User.findOneAndUpdate (
          {
            _id : result.userId
          },
          {
            $set : {
              isEmailVerified : true
            }
          },
          {
            useFindAndModify : false
          }
        );

        return [ null, { verified : true, msg : 'tokenVerified' } ];
      }

    } else {
      return [ { [ERRORS.BAD_REQUEST] : "tokenExpired"}, null];
    }
  } catch (e) {
    console.error ({ e }, 'Error occured while fetching token');
    throw new Error (`${ e } : Error occured while fetching token`);
  }
}
