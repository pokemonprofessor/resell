import express from 'express'
import { searchRouter } from './search.router'


const searchRoutes = express.Router();
const NAMESPACE = "v1";

// Example API
searchRoutes.use(`/${NAMESPACE}`, searchRouter);
export default searchRoutes;
