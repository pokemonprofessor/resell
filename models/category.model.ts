import { model, Schema, Model } from "mongoose";
import { ICategory, ITopCategory } from "../types/category";

const topCategorySchema: Schema<ITopCategory> = new Schema(
  {
    topCategoryIds: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const TopCategories: Model<ITopCategory> = model("topCategories", topCategorySchema);

const categorySchema: Schema<ICategory> = new Schema(
  {
    categoryId: { type: String },

    categoryName: { type: String, required: true },
    parentId: { type: String },

    allChildCategoryIds: [
      {
        type: String,
      },
    ],
    childCategoryIds: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Categories: Model<ICategory> = model("categories", categorySchema);

module.exports = { TopCategories, Categories };
