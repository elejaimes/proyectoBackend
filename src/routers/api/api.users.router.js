import { Router } from "express";
import passport from "passport";
import { UserModel } from "../../models/User.js";
import { loggedAdmin, loggedUserApi } from "../../middlewares/auth.js";

export const apiUsersRouter = Router();

apiUsersRouter.post("/", async function (req, res) {
  try {
    const registeredUser = await UserModel.register(req.body);

    // Autenticar al usuario después del registro
    req.login(registeredUser, (loginErr) => {
      if (loginErr) {
        return res
          .status(400)
          .json({ status: "error", message: loginErr.message });
      }

      return res
        .status(201)
        .json({ status: "success", payload: registeredUser });
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

apiUsersRouter.put("/", async function (req, res) {
  try {
    const updatedUserPassword = await UserModel.resetPassword(
      req.body.email,
      req.body.password
    );
    res.json({ status: "success", payload: updatedUserPassword });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

apiUsersRouter.get("/current", loggedUserApi, async (req, res) => {
  const user = await UserModel.findOne(
    //con passport
    { email: req.user.email },
    { password: 0 }
  ).lean();
  res.json({ status: "success", payload: user });
});

apiUsersRouter.get("/", loggedAdmin, async (req, res) => {
  const Users = await UserModel.find().lean();
  res.json({ status: "success", payload: Users });
});
