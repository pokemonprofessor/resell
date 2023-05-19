import express from "express";
import Responder from "../utils/expressResponder";
import { ERRORS } from "../utils/errors";
import { IShipping  } from "../types/shipping";
import CreateShippingLabelService from "../services/shipping/createShippingLabel.service"
import trackPackageService from "../services/shipping/trackPackageUSPS.service"
import trackPackageConnectLocalService from "../services/shipping/trackPackageConnectLocal.service";
import {CreateShippingLabelUSPSService} from "../services/shipping/printShippingLabelUSPS.service";

export default class ShippingController {
static async printLabel(req: express.Request, res: express.Response) {
  try{
    const shippingData: IShipping = req.body;
    const [error, response] = await CreateShippingLabelService(shippingData);
    console.log(response);
    if(error){
      Responder.failed(res, error);
    }
    else {
      Responder.success(res, response);
    }
  }
  catch (e){
    Responder.failed(res, ERRORS.INTERNAL);
  } 
}

static async trackPackageConnectLocal(req: express.Request, res: express.Response) {
  try{
    const shippingData: IShipping = req.body;
    const [error, response] = await trackPackageConnectLocalService();
    if(error){
      Responder.failed(res, error);
    }
    else {
      Responder.success(res, response);
    }
  }
  catch (e){
    Responder.failed(res, ERRORS.INTERNAL);
  } 
}


static async trackPackage(req: express.Request, res: express.Response) {
  try{
    const shippingData: IShipping = req.body;
    const [error, response] = await trackPackageService();
    if(error){
      Responder.failed(res, error);
    }
    else {
      Responder.success(res, response);
    }
  }
  catch (e){
    Responder.failed(res, ERRORS.INTERNAL);
  } 
}

static async printLabelDelivery(req: express.Request, res: express.Response) {
  try{
    const shippingData: IShipping = req.body;
    const [error, response] = await CreateShippingLabelService(shippingData);
    if(error){
      Responder.failed(res, error);
    }
    else {
      Responder.success(res, response);
    }
  }
  catch (e){
    Responder.failed(res, ERRORS.INTERNAL);
  } 
}

static async printShippingLabelUSPS(req: express.Request, res: express.Response) {
  try{
    const shippingData: IShipping = req.body;
    const [error, response] = await CreateShippingLabelUSPSService(shippingData);
    if(error){
      Responder.failed(res, error);
    }
    else {
      Responder.success(res, response);
    }
  }
  catch (e){
    Responder.failed(res, ERRORS.INTERNAL);
  } 
}
}


