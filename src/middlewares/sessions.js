import session from "express-session";
import connectMongo from "connect-mongo";
import { MONGODB_CNX_STR, SESSION_SECRET } from "../config.js";

const store = connectMongo.create({
  mongoUrl: MONGODB_CNX_STR,
  ttl: 60 * 60 * 24, // 1d,
});

export const sessions = session({
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

export function loggedUserApi(req, res, next) {
  if (!req.session["registeredUser"]) {
    return res
      .status(400)
      .json({ status: "error", message: "necesita iniciar sesion" });
  }

  next();
}

export function loggedUserWeb(req, res, next) {
  if (!req.session["registeredUser"]) {
    return res.redirect("/login");
  }

  next();
}
