import crypto from "crypto";

export const generateSellerToken = ()=>{
  return crypto.randomBytes(3*4).toString('base64');
}