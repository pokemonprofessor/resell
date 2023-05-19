import express from 'express'
import v1Routes from './v1'

const router = express.Router()

router.use('/search', v1Routes)

export default router
