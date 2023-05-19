export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  username: string;
  bannerImages: string[];
  profileImage?: string;
  collegeName: string;
  description: string;
  nickName?: string;
  storeName ?: string;
  address1 ?: string;
  address2 ?: string;
  country ?: string;
  city ?: string;
  state ?: string;
  postCode ?: string;
  governmentId ?: string;
  sellerId ?: number;
  stripeAccountId ?: string;
  role ?: string;
  token ?: string;
  is2FA ?: boolean;
  isEmailVerified ?: boolean;
  noOfListings ?: number;
}

export interface singIn extends Document {
  emailOrPhone: string;
  password: string;
  is2FAVerified ?: boolean;
}
