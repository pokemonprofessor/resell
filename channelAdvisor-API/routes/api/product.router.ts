import express from 'express';
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import productController from '../../controllers/product.controller';

const args = { mergeParams: true }
const productRouter = express.Router(args)

// productRouter.route('/').get(isAuthenticated,productController.getProducts)
productRouter.route('/').post(isAuthenticated,productController.create)
productRouter.route('/quantityprice').post(isAuthenticated,productController.quantityprice)
productRouter.route('/status').post(isAuthenticated,productController.status)


export { productRouter }
