
//const xml = require('xml2js');
import { IShipping } from "../../types/shipping";
//import axios from "axios";
import Shipping from "../../models/shipping.model";
import { ERRORS } from "../../utils/errors";
import Order from "../../models/order.model";

const axios = require('axios').default;
const fs = require('fs');

export const CreateShippingLabelUSPSService = async (shippingData: IShipping): Promise<any> =>{

const xmlbuilder2 = require('xmlbuilder2');
const userId ='399RESEL3373';
let buffer;
const newShipping = new Shipping(shippingData);
let createNewShipping =  await newShipping.save();
let root = xmlbuilder2.create({version: 1.0})
        .ele('eVSRequest', {USERID:userId})
            .ele('ImageParameters')
                .ele('ImageParameter').txt('4x6LABELP').up()
                .ele('XCoordinate').txt(0).up()
                .ele('YCoordinate').txt(900).up()
                .up()
            .ele('FromName').txt(shippingData.firstName+ " "+ shippingData.lastName).up()
            .ele('FromFirm').txt('Resell marketplace, NY').up()
            .ele('FromAddress1').txt(shippingData.addressLine1).up()
            .ele('FromAddress2').txt(shippingData.addressLine2).up()
            .ele('FromCity').txt(shippingData.city).up()
            .ele('FromState').txt(shippingData.state).up()
            .ele('FromZip5').txt(shippingData.zipCode).up()
            .ele('FromZip4').txt('').up()
            .ele('FromPhone').txt(shippingData.phoneNumber).up()
            .ele('POZipCode').txt(shippingData.zipCode).up()
            .ele('AllowNonCleansedOriginAddr').txt('false').up()
            .ele('ToName').txt(shippingData.buyerFirstName+" "+shippingData.buyerLastName).up()
            .ele('ToFirm').txt('Resell LLC').up()
            .ele('ToAddress1').txt(shippingData.buyerAddressLine1).up()
            .ele('ToAddress2').txt(shippingData.buyerAddressLine2).up()
            .ele('ToCity').txt(shippingData.buyerCity).up()
            .ele('ToState').txt(shippingData.buyerState).up()
            .ele('ToZip5').txt(shippingData.buyerZipCode).up()
            .ele('ToZip4').txt('').up()
            .ele('ToPhone').txt(shippingData.buyerPhoneNumber).up()
            .ele('AllowNonCleansedDestAddr').txt('false').up()
            .ele('WeightInOunces').txt(shippingData.weight).up()
            .ele('ServiceType').txt('PRIORITY').up()
            .ele('Container').txt('VARIABLE').up()
            .ele('Width').txt(shippingData.width).up()
            .ele('Length').txt(shippingData.length).up()
            .ele('Height').txt(shippingData.height).up()
            .ele('Machinable').txt('true').up()
            .ele('CustomerRefNo').txt('ABCD56789').up()
            .ele('CustomerRefNo2').txt('1234EFGH').up()
            .ele('SenderName').txt(shippingData.firstName+ " "+ shippingData.lastName).up()
            .ele('SenderEMail').txt(shippingData.email).up()
            .ele('RecipientName').txt(shippingData.buyerFirstName+" "+shippingData.buyerLastName).up()
            .ele('RecipientEMail').txt(shippingData.buyerEmail).up()
            .ele('ReceiptOption').txt('NONE').up()
            .ele('ImageType').txt('PDF').up()
            .ele('ePostageMailerReporting').txt('1').up()
            .ele('SenderFirstName').txt(shippingData.firstName).up()
            .ele('SenderLastName').txt(shippingData.lastName).up()
            .ele('SenderBusinessName').txt('Resell marketplace, NY').up()
            .ele('SenderAddress1').txt(shippingData.addressLine1).up()
            .ele('SenderCity').txt(shippingData.city).up()
            .ele('SenderState').txt(shippingData.state).up()
            .ele('SenderZip5').txt(shippingData.zipCode).up()
            .ele('SenderPhone').txt(shippingData.phoneNumber).up()
        .up();
let xml1 = root.end({prettyPrint:true});
//console.log(xml1);

let url="https://stg-secure.shippingapis.com/ShippingAPI.dll?API=eVS&XML=" + encodeURIComponent(xml1);

const response = await axios.get(url);
const newobj = xmlbuilder2.convert(response.data, {format: "object"});
const base64Image = newobj.eVSResponse.LabelImage;
if(response){
  const updatedShippingResult = await Shipping.findOneAndUpdate(
    {
       _id: newShipping._id 
    },
    {
        trackingNumber: newobj.eVSResponse.BarcodeNumber,
        isLabelGenerated : true,
        orderId: shippingData.orderId,
    },
    {
        new: true,
    }
  );
  const updatedOrderResult = await Order.findOneAndUpdate(
    {
       _id: shippingData.orderId 
    },
    {
        trackingNumber: newobj.eVSResponse.BarcodeNumber,
        isLabelGenerated : true,
    },
    {
        new: true,
    }
  );
}
  if (!response) {
    return [{ [ERRORS.BAD_REQUEST]: "Unable to generate the Shipping Label" }, null];
  } else {
    return [null, base64Image];
  }
}
/*await axios.get(url)
    .then(function(response){
        const obj = xmlbuilder2.convert(response.data, {format: "object"});
        //console.log(obj);
  //      console.log(obj.eVSResponse.LabelImage);
        const base64Image = obj.eVSResponse.LabelImage;
        buffer = Buffer.from(base64Image,'base64');
      //  console.log(buffer);
     //   fs.writeFileSync('label.pdf', buffer,'base64');
     //   console.log(Buffer.toString());
    //    response.send(obj.eVSResponse.LabelImage);
      //
      
      return [null, newobj];
})
    .catch(function(error){
        console.log(error);
    });
*/

  