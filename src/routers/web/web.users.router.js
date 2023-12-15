import { Router } from "express";
import { UserModel } from "../../models/User.js";
// import { loggedUserWeb } from "../../middlewares/sessions.js"; // lo manejo en handlebars

export const webUsersRouter = Router();

// Registro de usuario

webUsersRouter.get("/register", (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Registro",
  });
});

webUsersRouter.post("/register", async (req, res) => {
  try {
    await UserModel.create(req.body);
    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
  }
});

// Perfil del usuario

webUsersRouter.get("/products", (req, res) => {
  res.render("products.handlebars", {
    user: req.session["registeredUser"],
  });
});
