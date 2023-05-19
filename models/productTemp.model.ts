import { model, Model, Schema } from "mongoose";
import { ITempProducts } from "../types/tempProducts";

const tempProductUploads: Schema<ITempProducts> = new Schema(
    {
      batchId: { type: String, require: true, trim: true },
      data: {type: Array, require: true },
      isSucceffullyUploaded: {type: Boolean, required: true, default: false},
      progress: {type: String, enum: ["Pending", "Inprogress", "Completed"],required: true, default: "Pending"}
    },
    {
      timestamps: true,
    }
  );
  export const TempProductUploads: Model<ITempProducts> = model("tempProductUploads", tempProductUploads);
  
  export default TempProductUploads;
  