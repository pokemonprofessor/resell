import { ERRORS } from "../../utils/errors";

import { excelToJson } from "../../utils/readExcel";
const { TopCategories, Categories } = require("../../models/category.model");

export const createCategoryService = async (
  categoryData: any
): Promise<any[]> => {
  try {
    const findCategories = await Categories.find();
    let arrayOfCategories = [];
    if (findCategories.length === 0) {
      let categories: any = await excelToJson("test.xlsx");

      for (let i = 0; i < categories.length; i++) {
        const eachCategory = categories[i].category.split(" > ");
        if (eachCategory.length === 1) {
          arrayOfCategories.push({
            categoryId: categories[i].ID,
            parentId: null,
            categoryName: eachCategory[0],
            allChildCategoryIds: [],
            childCategoryIds: [],
          });
        } else {
          let tmpParent = null;
          for (let j = 0; j < eachCategory.length; j++) {
            // find index of j -1 category
            const parentcategoryIndex = arrayOfCategories.findIndex(
              (i) => i.categoryName === eachCategory[j - 1]
            );
            //++++++++++
            if (j === eachCategory.length - 1) {
              arrayOfCategories.push({
                categoryId: categories[i].ID,
                // parent: eachCategory[j - 1],
                parentId: arrayOfCategories[parentcategoryIndex].categoryId,
                categoryName: eachCategory[j],
                allChildCategoryIds: [],
                childCategoryIds: [],
              });
            } else {
              const categoryIndex = await arrayOfCategories.findIndex(
                (i) => i.categoryName === eachCategory[j]
              );
              if (categoryIndex === -1) {
                arrayOfCategories.push({
                  categoryId: null,
                  // parent: tmpParent,
                  parentId: arrayOfCategories[parentcategoryIndex].categoryId,
                  categoryName: eachCategory[j],
                  allChildCategoryIds: [],
                  childCategoryIds: [],
                });
              } else {
                arrayOfCategories[categoryIndex].allChildCategoryIds.push(
                  categories[i].ID
                );
                // check if j + 1 is last value
                if (j + 1 === eachCategory.length - 1) {
                  // if so check if ID already present
                  if (
                    arrayOfCategories[categoryIndex].childCategoryIds.indexOf(
                      categories[i].ID
                    ) === -1
                  ) {
                    arrayOfCategories[categoryIndex].childCategoryIds.push(
                      categories[i].ID
                    );
                  }
                }

                // if (
                //   arrayOfCategories[categoryIndex].childCategoryName.indexOf(
                //     eachCategory[j + 1]
                //   ) === -1
                // )
                //   arrayOfCategories[categoryIndex].childCategoryName.push(
                //     eachCategory[j + 1]
                //   );

                // tmpParent = eachCategory[j];
              }
            }
          }
        }
      }
      await Categories.insertMany(arrayOfCategories);
    } else {
      arrayOfCategories.push(findCategories);
    }

    return [null, arrayOfCategories];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while creating the categories " + e,
      },
      null,
    ];
  }
};

export const createTopCategoryService = async (
  categoryData: any
): Promise<any[]> => {
  try {
    const findTopCategories = await TopCategories.find();

    let arrayOfCategories = [];
    if (findTopCategories.length === 0) {
      let categories: any = await excelToJson("topCategories.xlsx");
      const topCategoryIds = await categories.map((i) => i.ID);
      const ids = new TopCategories();
      ids.topCategoryIds = topCategoryIds;
    } else {
      arrayOfCategories.push(findTopCategories);
    }
    return [null, { message: "Top dropdown categories created successfully" }];
  } catch (e) {
    return [
      {
        [ERRORS.BAD_REQUEST]:
          "Error occuring while creating the top dorpdown categories " + e,
      },
      null,
    ];
  }
};
