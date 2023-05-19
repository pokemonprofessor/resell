import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const secretkey = config.get("jwtSecret");
const refreshTokenSecretKey = config.get("jwtRefreshTokenSecretKey");
const jwtExpiry = config.get("jwtExpiry");
const jwtRefreshTokenExpiry = config.get("jwtRefreshTokenExpiry");

const resetPasswordJwtExpiry = config.get("jwtExpiryResetPassword");

export interface PAYLOAD {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface resetPasswordPayload {
  email: string;
  userId: string;
  resetType: "email";
}

export const getToken = (payload: PAYLOAD): string => {
  return jwt.sign(payload, secretkey, { expiresIn: jwtExpiry });
};

export const generateRefreshToken = (payload: PAYLOAD): string => {
  return jwt.sign(payload, refreshTokenSecretKey, {
    expiresIn: jwtRefreshTokenExpiry,
  });
};

export const getResetPasswordToken = (
  payload: resetPasswordPayload
): string => {
  return jwt.sign(payload, secretkey, { expiresIn: resetPasswordJwtExpiry });
};

export const verifyResetPasswordToken = (
  token: string
): JwtPayload | string => {
  return jwt.verify(token, secretkey);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, secretkey);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, refreshTokenSecretKey);
};
