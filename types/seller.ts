export interface ISeller extends Document {
  email: string;
  firstName: string;
  lastName: string;
  sellerId?: string;
  sellerToken?: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  companyName?: string;
  address1?: string;
  address2?: string;
  country?: string;
  city?: string;
  state?: string;
  postCode?: string;
  sellerType?: string;
  logo?: string;
  website?: string;
  governmentId?: string;
  stripeAccountId?: string;
  paypalID?: string;
  onBoarding?: string;
  token?: string;
  is2FA?: boolean;
  isEmailVerified?: boolean;
  isApproved?: boolean;
  approvalStatus?: string;
  uploads?: {}; 
}

export interface singIn extends Document {
  email: string;
  password: string;
  is2FAVerified ?: boolean;
}
