import express from "express";
import RefundController from "../../../controllers/refund.controller";

const args = { mergeParams: true };
const refundRouter = express.Router(args);

refundRouter.route("/refund").post(RefundController.create);
export { refundRouter };
