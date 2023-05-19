import User, { SubscribeUser } from "../../models/user.model";
import { ERRORS } from "../../utils/errors";
import { IUser } from "../../types/user";
import {
  generateRefreshToken,
  getResetPasswordToken,
  getToken,
  resetPasswordPayload,
  verifyResetPasswordToken,
} from "../../utils/jwt";
import { hashPassword } from "../../utils/bcryptPassword";
import { sendVerificationLink } from "../../utils/sendVerificationLink";
import moment from "moment";
import { sendEmail } from "../../utils/sendEmail";
import Address from "../../models/userAddress.model";
import { comparePassword } from "../../utils/bcryptPassword";
import { sendVerificationOTP } from "../../utils/sendVerificationOTP";
import EmailOtp from "../../models/emailOtp.model";
import VerificationEmail from "../../models/verificationEmail.model";
import {
  emailUpdateVerification,
  emailVerificationObj,
  passwordResetObj,
} from "../../utils/sendGridTemplate";

const CreateUserService = async (userData: IUser): Promise<any[]> => {
  try {
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }
    const newUser = new User(userData);
    let createNewUser = await newUser.save();

    console.log(
      `Preparing to send email verification link to ${createNewUser.email}`
    );
    // function for creating email obj
    const { emailObj, verificationOTP } = emailVerificationObj(createNewUser);

    await sendVerificationLink(
      { otp: verificationOTP, email: createNewUser.email },
      emailObj
    );

    const tokenPayload = {
      _id: createNewUser._id,
      email: createNewUser.email,
      firstName: createNewUser.firstName,
      lastName: createNewUser.lastName,
      phoneNumber: createNewUser.phoneNumber,
      countryCode: createNewUser.countryCode,
      username: createNewUser.username,
      collegeName: createNewUser.collegeName,
      description: createNewUser.description,
      role: createNewUser.role,
      is2FA: createNewUser.is2FA,
      bannerImages: createNewUser.bannerImages,
      state: createNewUser.state,
      nickName : createNewUser.nickName?createNewUser.nickName:"",
      city : createNewUser.city?createNewUser.city:"",
      country : createNewUser.country?createNewUser.country:"",
      profileImage : createNewUser.profileImage?createNewUser.profileImage:"",
    };

    const token = getToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return [null, { ...tokenPayload, token, refreshToken }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while creating the user account " + e,
      },
      null,
    ];
  }
};
export const emailVerification = async (data: any): Promise<any[]> => {
  try {
    //Validate if user already exists
    let user = await VerificationEmail.findOne({
      email:  data.email,
      otp: data.otp,
    });

    if (!user) {
      return [
        {
          [ERRORS.BAD_REQUEST]: "Email and Otp could not be verified",
        },
        null,
      ];
    } else {
      await User.findOneAndUpdate(
        { email: data.email },
        { isEmailVerified: true }
      );

      await VerificationEmail.deleteOne({ email: user.email });
      return [null, { emailVerified: true }];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while fetching email verification otp : ${data.email}`,
      },
      null,
    ];
  }
};
export const checkEmailAlreadyExist = async (data: any): Promise<any[]> => {
  try {
    //Validate if user already exists
    let user = await User.findOne({
      email: { $regex: new RegExp("^" + data.email, "i") },
    });

    if (!user) {
      return [null, { valid: true }];
    } else
      return [
        {
          [ERRORS.BAD_REQUEST]: "Email already exists: Please use a new email",
        },
        null,
      ];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while fetching email : ${data.email}`,
      },
      null,
    ];
  }
};

export const sendResetPasswordLink = async (data: any): Promise<any[]> => {
  try {
    let user = await User.findOne({
      email: { $regex: new RegExp("^" + data.email, "i") },
    });

    if (!user) {
      return [{ [ERRORS.BAD_REQUEST]: "userNotFound" }, null];
    } else {
      console.log(`Preparing to send email verification link to ${data.email}`);

      let tokenPayload: resetPasswordPayload = {
        email: user.email,
        userId: user._id,
        resetType: "email",
      };

      let token = getResetPasswordToken(tokenPayload);
      const { emailObj } = passwordResetObj(user, token);

      await sendEmail(emailObj);
      return [null, { ...tokenPayload, token, mailSent: true }];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: "Error occuring while creating the user account",
      },
      null,
    ];
  }
};

export const passwordUpdate = async (data: any): Promise<any[]> => {
  try {
    if (data.token) {
      let payload: any = verifyResetPasswordToken(data.token);

      let user = await User.findOne({
        email: { $regex: new RegExp("^" + payload.email, "i") },
      });

      if (!user) {
        return [{ [ERRORS.BAD_REQUEST]: "userNotFound" }, null];
      } else {
        _updatePassword({ userId: user._id, password: data.password });
        return [null, { passwordUpdated: true }];
      }
    } else if (data.phoneNumber) {
      let user = await User.findOne({ phoneNumber: data.phoneNumber });

      if (!user) {
        return [{ [ERRORS.BAD_REQUEST]: "userNotFound" }, null];
      } else {
        _updatePassword({ userId: user._id, password: data.password });
        return [null, { passwordUpdated: true }];
      }
    }
  } catch (e) {
    console.error({ e }, "Error occured while updating the password");
    return [
      { [ERRORS.BAD_REQUEST]: "Error occured while updating the password" },
      null,
    ];
  }
};

const _updatePassword = async (data: any): Promise<any> => {
  try {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    let user = await User.findOneAndUpdate(
      {
        _id: data.userId,
      },
      {
        $set: {
          password: data.password,
        },
      },
      {
        useFindAndModify: false,
      }
    );
  } catch (e) {
    throw e;
  }
};

export const fetchCountryCode = async (data: any): Promise<any[]> => {
  try {
    let user = await User.findOne({ phoneNumber: data.phone });

    if (!user) {
      return [{ [ERRORS.BAD_REQUEST]: "userNotFound" }, null];
    } else {
      return [null, { countryCode: user.countryCode }];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting the country code for Phone Number ${data.phone}`,
      },
      null,
    ];
  }
};

export const createOrUpdateUserAddress = async (
  address: any
): Promise<any[]> => {
  try {
    const { _id, user } = address;
    let result;
    if (_id) {
      result = await Address.findByIdAndUpdate({ _id }, address).lean();
    } else {
      const newAddress = new Address({ ...address, userId: user._id });
      result = await newAddress.save();
    }
    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting `,
      },
      null,
    ];
  }
};

export const getUserAddress = async (user: any): Promise<any[]> => {
  try {
    const address = await Address.find({ userId: user._id });

    if (!address) {
      return [{ [ERRORS.BAD_REQUEST]: "No address found for the user" }, null];
    } else {
      return [null, address];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting `,
      },
      null,
    ];
  }
};

export const removeUserAddress = async (_id: any): Promise<any[]> => {
  try {
    const address = await Address.deleteOne({ _id });

    if (!address) {
      return [
        { [ERRORS.BAD_REQUEST]: "No address found for the user to be deleted" },
        null,
      ];
    } else {
      return [null, address];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while getting `,
      },
      null,
    ];
  }
};

export const resetPassword = async (data: any): Promise<any[]> => {
  try {
    const { user, newPassword, currentPassword } = data;
    if (user) {
      let userData = await User.findOne({ _id: user._id });
      if (!userData) {
        return [{ [ERRORS.BAD_REQUEST]: "User is not found" }, null];
      } else {
        // compare password
        if (comparePassword(currentPassword, userData.password)) {
          // validate if current password is correct
          if (comparePassword(newPassword, userData.password)) {
            // validate if new password is similar to current one
            return [
              {
                [ERRORS.BAD_REQUEST]:
                  "New password is similar to current password",
              },
              null,
            ];
          } else {
            // update password to newone
            _updatePassword({
              userId: user._id,
              password: newPassword,
            });
            return [null, { passwordUpdated: true }];
          }
        } else {
          return [
            { [ERRORS.BAD_REQUEST]: "You have entered wrong password" },
            null,
          ];
        }
      }
    } else {
      return [{ [ERRORS.BAD_REQUEST]: "Please provide a user id" }, null];
    }
  } catch (e) {
    console.error({ e }, "Error occured while updating the password");
    return [
      { [ERRORS.BAD_REQUEST]: "Error occured while updating the password" },
      null,
    ];
  }
};
export const updateUserSetting = async (data: any): Promise<any[]> => {
  try {
    const query: any = {};
    const { user, name, email, phone, otp, bannerImageUrl, profileImageUrl, address, nickName, description } = data;
    if (name) {
      query.firstName = name.firstName;
      query.lastName = name.lastName;
    } else if (email) {
      const verify = await EmailOtp.findOne({
        userId: user._id,
        otp: otp,
      });
      if (!verify) {
        return [{ [ERRORS.BAD_REQUEST]: "Please enter valid otp" }, null];
      } else {
        // delete email from doc
        await EmailOtp.deleteOne({ userId: user._id, otp: otp });
        if (moment().diff(moment(verify.
          createdAt), "minutes") > 10) {
          return [
            {
              [ERRORS.BAD_REQUEST]:
                "OTP is expired please resend otp to verify",
            },
            null,
          ];
        } else {
          let findEmail = await User.findOne({ email: email });
          if (findEmail) {
            return [
              {
                [ERRORS.BAD_REQUEST]:
                  "The email provided is already registered , please use another email id",
              },
              null,
            ];
          } else {
            query.email = email;
          }
        }
      }
    } else if (data["2FA"] !== undefined) {
      query.is2FA = data["2FA"];
    } else if (phone) {
      query.phoneNumber = phone.phoneNumber;
      query.countryCode = phone.countryCode;
    } else if(bannerImageUrl){
      query.bannerImages = bannerImageUrl.bannerImages;
    }
    else if(profileImageUrl){
      query.profileImage = profileImageUrl.profileImageUrl;
    }
    else if (address) {
      query.city = address.city;
      query.state = address.state;
    } else if (nickName) {
      query.nickName = nickName;
    }else if (description) {
      query.description = description;
    }
    else if (phone) {
      query.phoneNumber = phone.phoneNumber;
      query.countryCode = phone.countryCode;
    }
    else {
      return [{ [ERRORS.BAD_REQUEST]: "Please enter valid details" }, null];
    }

    let userData = await User.findOneAndUpdate({ _id: user._id }, query, {
      new: true,
    });
    if (!userData) {
      return [{ [ERRORS.BAD_REQUEST]: "userNotFound" }, null];
    } else {
      const tokenPayload = {
        _id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        is2FA: userData.is2FA,
        username: userData.username,
        collegeName: userData.collegeName,
        description: userData.description,
        bannerImages: userData.bannerImages,
        city: userData.city,
        state: userData.state,
        nickName : userData.nickName,
        profileImage : userData.profileImage,
      };

      const token = getToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      return [null, { ...tokenPayload, token, refreshToken }];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while updating user settings`,
      },
      null,
    ];
  }
};

export const UpdateEmailVerificationService = async (
  userId: any,
  email: any
): Promise<any[]> => {
  try {
    const user = await User.findOne({ _id: userId });

    // function for creating email obj
    const { emailObj, verificationOTP } = emailUpdateVerification(user, email);
    await sendVerificationOTP(verificationOTP, emailObj);

    // insert otp in a emailotp // userid , email , otp

    const emailotp = new EmailOtp({
      userId: userId,
      email,
      otp: verificationOTP,
    });
    await emailotp.save();

    return [null, { message: "OTP has been sent on the provided email id" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while sending the verification otp " + e,
      },
      null,
    ];
  }
};

export const setAddressAsDefault = async (
  setAsDefault: any
): Promise<any[]> => {
  try {
    const { newAddressId, oldAddressId } = setAsDefault;
    let address = {};
    if (oldAddressId) {
      await Address.findByIdAndUpdate(
        { _id: oldAddressId },
        { $set: { Default: false } },
        { new: true }
      );
      address = await Address.findByIdAndUpdate(
        { _id: newAddressId },
        { $set: { Default: true } },
        { new: true }
      );
    } else {
      address = await Address.findByIdAndUpdate(
        { _id: newAddressId },
        { $set: { Default: true } },
        { new: true }
      );
    }

    if (!address) {
      return [
        { [ERRORS.BAD_REQUEST]: "User address could not be set to default" },
        null,
      ];
    } else {
      return [null, address];
    }
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while setting user address as default `,
      },
      null,
    ];
  }
};
export const createSubscribeUser = async (email: string): Promise<any[]> => {
  try {
    const existingUser = await SubscribeUser.findOne({ email });
    if (existingUser) {
      return [{ [ERRORS.BAD_REQUEST]: `User is already subscribed` }, null];
    }
    const newSubscribeUser = new SubscribeUser({ email: email });
    await newSubscribeUser.save();
    return [null, { message: "User subscribed successfully" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while creating a subscribed user`,
      },
      null,
    ];
  }
};
export const getSubscribeUser = async (): Promise<any[]> => {
  try {
    let subscribeUsers = await SubscribeUser.find();
    return [null, subscribeUsers];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]: `Error occured while fetching subscribed users`,
      },
      null,
    ];
  }
};

export default CreateUserService;
