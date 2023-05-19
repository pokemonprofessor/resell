import express from "express";
import { sellerRouter } from "./seller.router";

const router = express.Router();
const NAMESPACE = "v1";

router.use(`/${NAMESPACE}`, sellerRouter);
export default router;