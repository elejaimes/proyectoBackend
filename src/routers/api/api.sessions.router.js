import { Router } from "express";
import passport from "passport";

export const apiSessionsRouter = Router();

apiSessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failWithError: true,
  }),
  function (req, res) {
    res.status(201).json({ status: "success", payload: req.user });
  },
  function (error, req, res, next) {
    res.status(401).json({
      status: "error",
      message: "login failed",
    });
  }
);

apiSessionsRouter.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }

  res
    .status(400)
    .json({ status: "error", message: "No hay una sesión iniciada" });
});

apiSessionsRouter.delete("/current", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.error("Error al cerrar sesión: ", error);
    }
    res.json({ status: "success", message: "logout OK" });
  });
});
