import { Router } from "express";
import passport from "passport";
import { UserService } from "../../services/users.service.js";

export const webUsersRouter = Router();

// Registro de usuario

webUsersRouter.get("/register", (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Registro",
  });
});

webUsersRouter.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/products",
    failureRedirect: "/register",
  })
);

//Restablecer contraseña

webUsersRouter.get("/resetpassword", async (req, res) => {
  res.render("resetpassword.handlebars", {
    pageTitle: "Reestablecer contraseña",
  });
});

webUsersRouter.post("/resetpassword", async (req, res) => {
  try {
    await UserService.resetUserPassword(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/resetpassword");
  }
});

// Perfil del usuario en la página de productos

webUsersRouter.get("/products", (req, res) => {
  res.render("products.handlebars", {
    registeredUser: req.user,
  });
});
