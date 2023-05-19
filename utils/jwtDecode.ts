import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ERRORS } from "./errors";

export const decodeToken = (req) => {
  const token = req.authorization.split(" ")[1];
  if(token) {
    const user = jwt.decode(token);
    return user;
  }
};
