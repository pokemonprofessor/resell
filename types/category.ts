export interface ICategory extends Document {
  // category: string,
  // parent: string,
  // ancestors: Array<string>
  categoryId: string;
  parentId: string;
  categoryName: string;
  allChildCategoryIds: Array<string>;
  childCategoryIds: [];
}
export interface ITopCategory extends Document {
  topCategoryIds: Array<string>;
}
