import axios from "axios";
import { response } from "express";

//let xml='<TrackRequest USERID="399RESEL3373"><TrackID ID="XXXXXXXXXXX1"></TrackID><TrackID ID="XXXXXXXXXXX2"></TrackID></TrackRequest>'

const xmlbuilder2 = require('xmlbuilder2');
const userId ='399RESEL3373';
let res;
const trackPackageService = async (): Promise<any[]> =>{

let root = xmlbuilder2.create({version: 1.0})
        .ele('TrackRequest', {USERID:userId})
             .ele('TrackID', {ID:'420191069205590324154000000139'}).up()
             .ele('TrackID', {ID:'420191069205590324154000000139'})
        .up();
let xml = root.end({prettyPrint:true});
console.log(xml);
let url="https://stg-secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=" + encodeURIComponent(xml);

axios.get(url)
    .then(function(response){
        console.log(response.data);
        res = response.data;
    })
    .catch(function(error){
        console.log(error);
    });

    return [res];
}

export default trackPackageService;