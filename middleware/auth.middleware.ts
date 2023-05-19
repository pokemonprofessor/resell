import express from "express";
import { verifyToken } from "../utils/jwt";
import Responder from "../utils/expressResponder";
import { ERRORS } from "../utils/errors";

export const auth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken: any = verifyToken(token);
    if (!decodedToken._id && !decodedToken.email) {
      throw "Invalid user ID";
    }
    next();
  } catch (e) {
    Responder.failed(res, { [ERRORS.UNAUTHORIZED]: "Invalid Token" });
  }
};
