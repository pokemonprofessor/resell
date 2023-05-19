import apiRoutes from "./api";
import initChannelAdvisorRoutes from "../channelAdvisor-API/routes";
import searchRoutes from "./searchAPI";
import adminRoutes from "./admin";
import sellerRoutes from "./directSeller";
import express from "express";

const initRoutes = (app) => {
  app.use(apiRoutes);
  app.use(initChannelAdvisorRoutes);
  app.use(searchRoutes);
  app.use(adminRoutes);
  app.use(sellerRoutes);

  app.get("/healthcheck", (req: express.Request, res: express.Response) => {
    console.log("normal");
    res.sendStatus(200);
  });
};

export default initRoutes;
