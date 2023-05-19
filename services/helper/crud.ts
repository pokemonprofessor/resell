import _ from "lodash";
const { BuyableProduct } = require("../../models/product.model");
// get & find operations
export const getOneById = async ({ model, id, fields }) => {
  // model: db schema, id: _id , fields: fields to return
  return model.findOne({ _id: id }, { ...fields });
};

export const getOneByQuery = async ({ model, query, fields }) => {
  return model.findOne({ ...query }, { ...fields });
};

export const getAll = async ({ model, query, fields }) => {
  //   if (!_.isEmpty(attributes)) {
  //     query = { ...query, attributes };
  console.log("getAll", [`${model}`])
  //   }
  return model.find({ ...query }, { ...fields });
};

// update & insert operations

export const getOneAndUpdate = async ({ model, query, data, attributes }) => {
  // model: db schema, id: _id , fields: fields to return
  const additionalAttr = !_.isEmpty(attributes) ? attributes : {};
  return model.findOneAndUpdate(
    { ...query },
    { ...data },
    { ...additionalAttr }
  );
};


export const insertAll = async ({ model, data }) => {
  return model.insertMany(data);
};

// Aggregate operations
export const aggregate = async ({ model, aggFunction, data }) => {
  const query = { raw: true, where: { is_deleted: false, ...data } };
  let res;
  switch (aggFunction) {
    case "count":
      res = await model.count(query);
  }
  return res;
};

// delete operations

export const removeById = async ({ model, id }) => {
  return model.deleteOne({ _id: id });
};

export const removeByIds = async ({ model, ids }) => {
  return model.deleteMany({ _id: ids });
};
