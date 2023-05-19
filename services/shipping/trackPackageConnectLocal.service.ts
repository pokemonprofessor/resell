import axios from "axios";
import {getAccessTokenForShippingLabel} from "./paymentAccount.service";
import { response } from "express";
const url = require("url");


export const trackPackageConnectLocalService = async() =>{
    let res;
    const queryParams ={
        expand: "detail",
    }
    const params = new url.URLSearchParams(queryParams);
    const uri =`https://api-cat.usps.com//tracking/v1/tracking/?${params}`;
    console.log(uri);
    let accessToken = getAccessTokenForShippingLabel;
    const header = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken} `,
      };

       axios
        .get(uri,  {
          headers: header,
        })
        .then(function(response){
          console.log(response.data);
          res= response.data;
      })
      .catch(function(error){
          console.log(error.response.data);
      });
     return [res];

}

export default trackPackageConnectLocalService;