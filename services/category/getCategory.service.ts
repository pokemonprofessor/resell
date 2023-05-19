import Filters from "../../models/filter.model";
import { ERRORS } from "../../utils/errors";
import { getAll } from "../helper/crud";
const { Categories, TopCategories } = require("../../models/category.model");

export const getTopLevelCategoryService = async (): Promise<any[]> => {
  try {
    const result = await Categories.aggregate([
      { $match: { parentId: null } },
      {
        $lookup: {
          from: "categories",
          localField: "childCategoryIds",
          foreignField: "categoryId",
          as: "childData",
        },
      },
      {
        $project: {
          "childData.categoryId": 1,
          "childData.categoryName": 1,
          categoryId: 1,
          categoryName: 1,
          parentId: 1,
        },
      },
    ]);
    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while fetching the top level categories " + e,
      },
      null,
    ];
  }
};

export const getCategoryByParentService = async (
  parent: any
): Promise<any[]> => {
  try {
    const result = await getAll({
      model: Categories,
      query: { parentId: parent },
      fields: { 
        childCategoryIds: 1,
        categoryId: 1,
        parentId: 1,
        categoryName: 1,
      },
    });
    return [null, result];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while fetching the categories by its parent" + e,
      },
      null,
    ];
  }
};

export const getTopCategoryService = async (): Promise<any[]> => {
  try {
    const { topCategoryIds } = await TopCategories.findOne()
      .select({
        _id: 0,
        topCategoryIds: 1,
      })
      .lean();

    const topCateogry = await Categories.find({
      categoryId: { $in: topCategoryIds },
    })
      .select({
        categoryId: 1,
        categoryName: 1,
      })
      .lean();
    return [null, topCateogry];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while fetching the dropdown categories by its parent" +
          e,
      },
      null,
    ];
  }
};

export const getFiltersByCategoryService = async (
  categoryId
): Promise<any[]> => {
  try {
    const filters = await Filters.findOne({ categoryId }).select({}).lean();
    return [null, filters];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while fetching the dropdown categories by its parent" +
          e,
      },
      null,
    ];
  }
};
