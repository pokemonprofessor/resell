import express from "express";
import { productRouter } from "./product.router";
import { orderRouter } from "./order.router";
import { orderRouterV2 } from "./order.router";

const router = express.Router();

// channel advisor API
router.use(`/v2/products`, productRouter);
router.use(`/orders`, orderRouter);
router.use(`/v2/orders`, orderRouterV2);

export default router;
