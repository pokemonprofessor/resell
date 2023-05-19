import { IShipping } from "../../types/shipping";
import axios from "axios";
import Shipping from "../../models/shipping.model";
import QueryString from "qs";
import {getAccessTokenForShippingLabel} from "./paymentAccount.service";
//import {getPaymentAccountAprrovalForToken} from "./paymentAccount.service";

//const axios = require('axios');
const fs = require('fs');

    //const token ="OrAltXR95JZ3zkIBRAGPrhZevbZh"; 
    let url ="https://api-cat.usps.com/labels/v1/label";
    const CreateShippingLabelService = async (shippingData: IShipping): Promise<any[]> =>{

    const newShipping = new Shipping(shippingData);
    let createNewShipping = await newShipping.save();
    const token =  await getAccessTokenForShippingLabel();
    console.log("debug 1 " + token);
   //   let approvalresponse =  getPaymentAccountAprrovalForToken(token);
    //  console.log("debug 2 " + approvalresponse);
    let res;   
    const options = {
        headers: {
        "Authorization": `Bearer ${token} `,
        "Content-Type": `application/json`,
        "accept": `multipart/mixed`,
        }
      };
    let request ={
        "imageInfo": {
            "imageType":"PDF",
            "receiptOption": "NONE"
        }, 
        "toAddress": {
            "firm": "Resell Marketplace",
            "firstName": shippingData.buyerFirstName,
            "lastName": shippingData.buyerLastName,
            "ZIPCode": shippingData.buyerZipCode,
            "city": shippingData.buyerCity,
            "secondaryAddress" : shippingData.buyerAddressLine2,
            "state": shippingData.buyerState,
            "streetAddress": shippingData.buyerAddressLine1,
            
        },
        "fromAddress": {
            "firm": shippingData.companyName,
            "firstName": shippingData.firstName,
            "lastName": shippingData.lastName,
            "ZIPCode": shippingData.zipCode,
            "city": shippingData.city,
            "secondaryAddress" : shippingData.addressLine2,
            "state": shippingData.state,
            "streetAddress": shippingData.addressLine1,     
        },
        "package":{
            "mailClass": "USPS_CONNECT_LOCAL",
            "rateIndicator":"SP",
            "weightUOM":"lb",
            "weight": shippingData.weight,
            "dimensionsUOM":"in",
            "length":shippingData.length,
            "height":shippingData.height,
            "width":shippingData.width,
            "processingCategory":"MACHINABLE",
            "mailingDate":shippingData.mailingDate,
            "extraServices": [920],
            "destinationEntryFacilityType":"DESTINATION_DELIVERY_UNIT",
            "destinationEntryFacilityAddress":{
                "ZIPCode": shippingData.buyerZipCode,
                "city": shippingData.buyerCity,
                "secondaryAddress" : shippingData.buyerAddressLine2,
                "state": shippingData.buyerState,
                "streetAddress": shippingData.buyerAddressLine1,
               }        
          }
    
       } 
       console.log(request);
       axios
       .post(url, request, {
         headers: options.headers,
        // responseType: 'stream',
       })
       .then(function(response){
        //response.setHeader('Content-Type', 'application/pdf')
        //fs.createWriteStream(response)
         console.log(response.data);
         res= response.data;
       //  response.data.pipe(fs.createWriteStream('./label.pdf'));
        // console.log(response.data.pipe);

        /* response.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=label.pdf',
            'Content-Length': data.length
          }); */
       //  response.download('./label.pdf');
        // return response.data;
     })
     .catch(function(error){
         console.log(error.response.data);
     });

   /*await Shipping.findOneAndUpdate(
    {
      _id: createNewShipping._id,
      dataTobeUpdated,
      {
        upsert: true,
        new: true,
      }
    }; */
return [res];

}

export default CreateShippingLabelService; 