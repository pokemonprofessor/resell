import express from 'express'
import {adminRouter} from './admin.router'

const router = express.Router()

router.use('/admin', adminRouter)

export default router
