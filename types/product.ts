export interface IBuyableProduct extends Document {
  title: string;
  productId:string;
  description: string;
  color:string;
  category: string;
  taxCode: string;
  brand: string;
  collegeName: string;
  userName: string;
  condition: String;
  saleprice: number;
  size:string,
  shippingcoststandard: number;
  shippingcostexpedited: number;
  shippinglength: string;
  shippingwidth: string;
  shippingheight: string;
  shippingweight: string;
  productgroupimageurl: string[];
  videourl: string[];
  lengthunit: string;
  widthunit: string;
  material: string;
  price: number;
  Quantity: number;
  ListingStatus: string;
  userId: string;
  meta: Array<Object>;
}
