import session from "express-session";
import connectMongo from "connect-mongo";
import { MONGODB_CNX_STR } from "../config.js";

const store = connectMongo.create({
  mongoUrl: MONGODB_CNX_STR,
  ttl: 100,
});

export const sessions = session({
  store,
  secret: "SecretCoder", // ojo este es la palabra secreta para firmar la cookie
  resave: true,
  saveUninitialized: true,
});
