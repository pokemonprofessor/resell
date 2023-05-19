import apiRoutes from "./api";
import express from "express";

const router = express.Router();
router.use("/", apiRoutes);

export default router;
