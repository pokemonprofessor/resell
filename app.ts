import express from "express";
import config from "./config";
import initRoutes from "./routes";
import mongoose from "mongoose";
import boom from "express-boom";
import cors from "cors";
import cron from "node-cron";
import { paymentIntentCron } from "./services/cron/paymentIntentCron.service";
import {
  payoutSellerPaypalCron,
  payoutSellerStripeCron,
} from "./services/cron/payoutSellerCron.service";
import DeleteRecordService from "./services/search/deleteRecords.service";
const app = express();
const port = config.get("port");
const originUrl = config.get("frontEnd");
const marketPlaceUrl = config.get("marketPlaceUrl");
const adminUrl = config.get("adminUrl");
const mongodb = config.get("mongodb");
const morgan = require("morgan");

// var corsOptions = {
//   origin: originUrl,
//   optionsSuccessStatus: 200, // For legacy browser support
// };
// // Allow all routes to access
// app.use(cors(corsOptions));
var corsOptions = {
  origin: [originUrl, marketPlaceUrl, adminUrl],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// middleware for json body parsing
// app.use(express.json({ limit: "5mb" }));

app.use((req, res, next) => {
  if (
    req.originalUrl.includes("/stripe-webhook") ||
    req.originalUrl.includes("/stripe-connect-webhook")
  ) {
    next();
  } else {
    express.json({ limit: "5mb" })(req, res, next);
  }
});

// Enable logger (morgan)
app.use(
  morgan(
    "[:date[clf]] :method :url :status :res[content-length] - :response-time ms"
  )
);

app.use(boom());

app.use((req, res, next) => {
  const requestTime = new Date();
  console.log("requestTime ====>", requestTime);
  console.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Initialize modules server routes
initRoutes(app);
// Connecting with database
mongoose
  .connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    const server = app.listen(port, () => {
      console.log(`Started ${config.get("app.name")}`);
      console.log(`server is listening on ${port}, env ${config.get("env")}`);
    });
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
      });
    });
  })
  .catch((error) => {
    console.log(`Error in database connection`);
  });

//  DeleteRecordService();
// CRON JOB
// cron.schedule("0 */30 * * * *", () => paymentIntentCron());
cron.schedule("0 10 * * 1", () => payoutSellerStripeCron());
// cron.schedule("0 10 * * 1", () => payoutSellerPaypalCron());
