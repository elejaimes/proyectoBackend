import { Router } from "express";
import { UserModel } from "../../models/User.js";
import { comparePassword } from "../../utils/crypto.js";

export const apiSessionsRouter = Router();

apiSessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let registeredUserData;

  if (email === "admin@admin.com" && password === "admin1234") {
    registeredUserData = {
      email: "admin",
      firstName: "admin",
      lastName: "admin",
      rol: "admin",
    };
  } else {
    const registeredUser = await UserModel.findOne({ email }).lean();

    if (!registeredUser) {
      return res.status(400).json({ status: "error", message: "login failed" });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      registeredUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    registeredUserData = {
      email: registeredUser.email,
      firstName: registeredUser.firstName,
      lastName: registeredUser.lastName,
      rol: "user",
    };
  }

  // aqui se crea la session en caso de que el usuario y contraseña sean correctos
  req.session["registeredUser"] = registeredUserData;
  res.status(201).json({ status: "success", message: "login success" });
});

apiSessionsRouter.get("/current", (req, res) => {
  if (req.session["registeredUser"]) {
    return res.json(req.session["registeredUser"]);
  }
  res
    .status(400)
    .json({ status: "error", message: "No hay una sesión iniciada" });
});

apiSessionsRouter.delete("/current", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ status: "logout error", body: error });
    }
    res.json({ status: "success", message: "logout OK" });
  });
});
