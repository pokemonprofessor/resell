import { ObjectId } from "mongoose";

export interface IUserItem extends Document {
  productId: ObjectId;
 // productSellerSKU: string;
  quantity: number;
  total: number;
  type: string;
  saveForLater?: boolean;
}
