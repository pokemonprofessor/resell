export interface IProductReview extends Document {
  userId: string;
  productId: string;
  title: string;
  review: string;
  rating: number;
}
