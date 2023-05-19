export const optmizedProductData = (products) => {
    let arrResponse = [];
    for (let p of products) {
      let obj = {
        title: null,
        description: null,
        productgroupimageurl1: null,
        parentSellerSKU: null,
        brand: null,
        category: null,
        results: [],
      };
      const findVariationIndex = arrResponse.findIndex(
        (i) => i.parentSellerSKU === p.parentSellerSKU
      );
      if (findVariationIndex !== -1) {
        arrResponse[findVariationIndex].results.push({
          _id: p._id,
          SellerSKU: p.SellerSKU,
          ListingStatus: p.ListingStatus,
          Quantity: p.Quantity,
          meta: p.meta,
          rating: p.rating,
          price: p.price,
          SellerId: p.SellerId,
        });
      } else {
        obj.title = p.title;
        obj.description = p.description;
        obj.productgroupimageurl1 = p.productgroupimageurl1;
        obj.parentSellerSKU = p.parentSellerSKU;
        obj.brand = p.brand;
        obj.category = p.category;
        obj.results.push({
          _id: p._id,
          SellerSKU: p.SellerSKU,
          ListingStatus: p.ListingStatus,
          Quantity: p.Quantity,
          meta: p.meta,
          rating: p.rating,
          price: p.price,
          SellerId: p.SellerId,
        });
        arrResponse.push(obj);
      }
    }
    return arrResponse;
  };