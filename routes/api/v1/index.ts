import express from "express";
import { exampleRouter } from "./example.router";
import { userRouter } from "./user.router";
import { orderRouter } from "./order.router";
import { categoryRouter } from "./category.router";
import { productRouter } from "./product.router";
import { userItemsRouter } from "./userItems.router";
import { paymentRouter } from "./payment.router";
import { shippingRouter } from "./shipping.router";
import { imageUploadRouter } from "./imageUpload.router";
const router = express.Router();
const NAMESPACE = "v1";

// Example API
router.use(`/${NAMESPACE}`, exampleRouter);

// User API
router.use(`/${NAMESPACE}/user`, userRouter);
// router.use(`/${NAMESPACE}/product`, productRouter)
router.use(`/${NAMESPACE}/orders`, orderRouter);
router.use(`/${NAMESPACE}/categories`, categoryRouter);
router.use(`/${NAMESPACE}/product`, productRouter);
router.use(`/${NAMESPACE}/userItems`, userItemsRouter);
router.use(`/${NAMESPACE}/orders`, orderRouter);
router.use(`/${NAMESPACE}/payment`, paymentRouter);
router.use(`/${NAMESPACE}/shipping`, shippingRouter);
// router.use(`/${NAMESPACE}/image-upload`, imageUploadRouter);
export default router;
