import express from "express";
import { auth } from "../../../middleware/auth.middleware";
import UserItemsController from "../../../controllers/userItems.controller";

const args = { mergeParams: true };
const userItemsRouter = express.Router(args);

userItemsRouter.route("/").post(auth, UserItemsController.createOrUpdate);
userItemsRouter.route("/:type").get(auth, UserItemsController.get);
userItemsRouter.route("/:userItemId").delete(auth, UserItemsController.delete);
export { userItemsRouter };
