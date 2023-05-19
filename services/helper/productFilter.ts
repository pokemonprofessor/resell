export const createFilterQuery = (obj) => {
  let arr = [];
  let query = {};
  if (Object.keys(obj).length !== 0) {
    // object containing filters
    let priceObj = {};
    // check if price min and price max exist
    if (obj["priceMin"] !== undefined) {
      priceObj = { ...priceObj, $gte: parseInt(obj.priceMin) };
    }
    if (obj["priceMax"] !== undefined) {
      priceObj = { ...priceObj, $lte: parseInt(obj.priceMax) };
    }
    if (obj["brand"] !== undefined) {
      query = { ...query, brand: obj.brand };
    }

    query = Object.keys(priceObj).length !== 0 && { ...query, price: priceObj };
    delete obj.priceMin;
    delete obj.priceMax;
    delete obj.brand;

    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      arr.push({ $elemMatch: { variation: key, attribute: obj[key] } });
    });

    query = { ...query, meta: { $all: arr } };
    return query;
  }
};
