import { Router } from "express";
import { UserModel } from "../../models/User.js";
import { loggedUserApi } from "../../middlewares/auth.js";
import { hashearPassword } from "../../utils/crypto.js";

export const apiUsersRouter = Router();

apiUsersRouter.post("/", async (req, res) => {
  try {
    const hashedPassword = await hashearPassword(req.body.password);
    req.body.password = hashedPassword;
    const user = await UserModel.create(req.body);

    // Iniciar sesión después de registrar al usuario
    req.login(user, (error) => {
      if (error) {
        console.error("Error al iniciar sesión después del registro:", error);
        return res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
      // Redirigir a la página deseada después del registro y la autenticación
      res
        .status(201)
        .json({ status: "success", payload: user, redirect: "/products" });
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(400).json({ status: "error", message: error.message });
  }
});

apiUsersRouter.get("/current", loggedUserApi, async (req, res) => {
  const user = await UserModel.findOne(
    //con passport
    { email: req.user.email },
    //sin passport
    // { email: req.session["registeredUser"].email },
    { password: 0 }
  ).lean();
  res.json({ status: "success", payload: user });
});
