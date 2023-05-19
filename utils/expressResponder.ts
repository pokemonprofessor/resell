import _ from 'lodash'
import { MESSAGES, ERRORS } from './errors'

function Responder () { }

/*
 * This method sends the response to the client.
 */
function sendResponse (res, status, body) {
  if (!res.headersSent) {
    if (body) { return res.status(status).json(body) }
    return res.status(status).send()
  } else {
    console.error('Response already sent.')
  }
}

/*
 * These methods are called to respond to the API user with the information on
 * what is the result of the incomming request
 */
Responder.sendJSONResponse = (res, obj) => {
  return sendResponse(res, 200, obj)
}

Responder.channelResponse = (res, data) => {
  let response = {
    ResponseBody: [],
    Status : "Complete",
    PendingUri: null,
    Errors: []
  }
  for(let p of data){
    let responseProduct = {
      SellerSKU: p.SellerSKU,
      BuyableProductResults: [],
      Errors : null
    }
    for(let buyableProduct of p.BuyableProducts){
      let buyResProduct = {
        RequestResult: "Success",
        SellerSKU: responseProduct.SellerSKU,
        MarketPlaceItemID: buyableProduct.sellerSKU,
        URL: null,
        Errors: null
      }  
    responseProduct.BuyableProductResults.push(buyResProduct);
    }
    response.ResponseBody.push(responseProduct);
  }
  res.json(response);
}

Responder.success = (res, data) => {
    let response = {
    ResponseBody: data,
    Status : "Complete",
    PendingUri: null,
    Errors: []
  }
  // we can have different types of data
  // Case 1: [{app: 'paysfer'}] (array)
  // Case 2: {app: 'paysfer'} (object) or {app: 'paysfer', message: 'custom message'}
  // Case 3: Any message like 'Record has been successfully deleted'
  // Case 4: Data types other than above mentioned cases i.e boolean, null

  // In every case, we're sending the response in the below format
  // {
  //   data: [] or any data
  //   message: Custom message or default message as mentioned below
  // }

  let message = 'Request has been processed successfully.'
  if (_.isString(data)) {
    message = data
    data = ''
  } else if (_.isObject(data) && data['message']) {
    message = data['message']
  }

  if (data && data['message']) {
    delete data['message']
  }

  return sendResponse(res, 200, response)
}


Responder.failed = (res, error) => {
  // get the error key if error is as object
  const keys = error && Object.keys(error)
  const errorName = (keys && keys.length && keys[0])
  if (errorName && _.isFunction(res.boom[errorName])) {
    let errorMessage
    if (errorName === ERRORS.INTERNAL) {
      errorMessage = MESSAGES.SERVER_ERROR
    } else {
      errorMessage = error[errorName]
    }
    res.boom[errorName](errorMessage)
  } else {
    res.boom.internal(MESSAGES.SERVER_ERROR)
  }
}

export default Responder
