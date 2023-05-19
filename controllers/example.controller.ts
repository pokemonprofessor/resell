import Responder from '../utils/expressResponder'
import ExampleMethod from '../services/example.service'
import express from 'express'

export default class ExampleController {
  static async exampleMethod (req: express.Request, res: express.Response) {
    const [error, response] = await ExampleMethod()
    if (error) {
      Responder.failed(res, error)
    } else {
      Responder.success(res, response)
    }
  }
}
