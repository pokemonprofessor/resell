import { model, Schema, Model } from "mongoose";
import { IFilter } from "../types/filter";

const FilterSchema: Schema<IFilter> = new Schema(
  {
    categoryId: { type: String, Required: true },
    brand: { type: Array },
    color: { type: Array },
    size: { type: Array },
    price: { type: Array },
    material: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Filters: Model<IFilter> = model("filters", FilterSchema);

export default Filters;
