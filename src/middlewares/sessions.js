import session from "express-session";
import connectMongo from "connect-mongo";
import { CNX_STR, SESSION_SECRET } from "../config.js";

const store = connectMongo.create({
  mongoUrl: CNX_STR,
  ttl: 60 * 60 * 24, // 1d,
});

export const sessions = session({
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});
