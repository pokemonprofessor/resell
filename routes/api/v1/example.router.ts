import express from 'express'
import exampleController from '../../../controllers/example.controller'

const args = { mergeParams: true }
const exampleRouter = express.Router(args)

exampleRouter.route('/test')
  .get(exampleController.exampleMethod)

export { exampleRouter }
