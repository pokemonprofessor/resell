import { IShipping } from "../../types/shipping";
//import axios from "axios";
import Shipping from "../../models/shipping.model";
import QueryString from "qs";

const axios = require('axios');

//const accessToken ="gD7UCwv0ztGJpb9qZJ4VaG0KO9ut"; 

export const getAccessTokenForShippingLabel = async() =>{
    const uriToken ="https://api-cat.usps.com/oauth2/v1/token";
    let accessToken;
    const header = {
        "Content-Type": "application/json",
      };

      const request = {
        client_id:"zA9iPRqyGAWfGOud3OGWQkWORQXcZTVy",
        customer_registration_id:"94881054",
        mailer_id:"901098121",
        client_secret:"OdLGRfIgCrXW27Pl",
        grant_type: "client_credentials",
      };
       axios
        .post(uriToken, request, {
          headers: header,
        })
        .then(function(response){
          console.log(response.data);
          accessToken= response.data.access_token;
          getPaymentAccountAprrovalForToken(accessToken)
          return accessToken;
      })
      .catch(function(error){
          console.log(error.response.data);
      });
      
}
const getPaymentAccountAprrovalForToken = async(data:any) =>{

const uriToken ="https://api-cat.usps.com/labels/v1/label/payment-account";
    
const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${data} `,
  };

  const request = {
    "accountType":"PERMIT",
    "accountNumber":"2961",
    "permitNumber":"2961",
    "permitZip":"20260"
  };

   axios
    .post(uriToken, request, {
      headers: header,
    })
    .then(function(response){
      console.log(response);
      //return response.data.access_token;
  })
  .catch(function(error){
      console.log(error.response.data);
  });

} 
//export default getAccessTokenForShippingLabel;