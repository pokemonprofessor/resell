import express from "express";
import ImageUploadController from "../../../controllers/imageUploadController";

const args = { mergeParams: true };
const imageUploadRouter = express.Router(args);
console.log('ererererwwe')

imageUploadRouter.route("/image-upload").post(ImageUploadController.uploadImage);
export { imageUploadRouter };
