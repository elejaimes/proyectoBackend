import { Router } from "express";
import { UserModel } from "../../models/User.js";

export const apiSessionsRouter = Router();

apiSessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const registeredUser = await UserModel.findOne({ email }).lean();

  if (!registeredUser) {
    return res.status(400).json({ status: "error", message: "login failed" });
  }

  // aqui más adelante debo encriptar la recibida y comparar con la que ya está encriptada
  if (password !== registeredUser.password) {
    return res.status(400).json({ status: "error", message: "login failed" });
  }

  const registeredUserData = {
    email: registeredUser.email,
    firstName: registeredUser.firstName,
    lastName: registeredUser.lastName,
  };

  // aqui se crea la session en caso de que el usuario y contraseña sean correctos
  req.session["registeredUser"] = registeredUserData;
  res.status(201).json({ status: "success", message: "login success" });
});

apiSessionsRouter.get("/", (req, res) => {
  if (req.session["registeredUser"]) {
    return res.json(req.session["registeredUser"]);
  }
  res
    .status(400)
    .json({ status: "error", message: "No hay una sesión iniciada" });
});

apiSessionsRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: "logout error", body: err });
    }
    res.json({ status: "success", message: "logout OK" });
  });
});
