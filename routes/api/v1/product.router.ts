import express from "express";
import ProductController from "../../../controllers/product.controller";
import { auth } from "../../../middleware/auth.middleware";
import { isAuthenticated } from "../../../middleware/isAuthenticated";

const args = { mergeParams: true };
const productRouter = express.Router(args);


productRouter.route("/search").get(ProductController.getProductBySearch);
productRouter.route("/:productId").get(ProductController.getProductById);
productRouter.route("/:category").get(ProductController.getProductByCategory);
productRouter.route("/review").post(auth, ProductController.createReview);
productRouter.route("/reviews").get(auth,ProductController.getReviews);
productRouter.route("/review/upvote/:_id").put(auth,ProductController.upvoteReview);
productRouter.route("/import-products").post(ProductController.importProducts);
productRouter.route("/update-products-image").put(ProductController.updateProductsImage);
productRouter.route('/create').post(ProductController.create);
productRouter.route('/getProducts/:sellerId').get(ProductController.getProductBySellerId);
productRouter.route('/updateProduct/:productId').post(ProductController.updateProductData);
export { productRouter };
