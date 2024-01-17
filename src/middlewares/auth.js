import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../config.js";

export function loggedUserApi(req, res, next) {
  if (!req.isAuthenticated()) {
    return res
      .status(400)
      .json({ status: "error", message: "necesita iniciar sesion" });
  }
  next();
}

export function loggedUserWeb(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
}

export function loggedAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    return res
      .status(403)
      .json({ status: "error", message: "solo para admins" });
  }
  next();
}

export function isAdmin(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function attachUser(req, res, next) {
  res.locals.registeredUser = req.user || null;
  console.log(req.user);
  next();
}
