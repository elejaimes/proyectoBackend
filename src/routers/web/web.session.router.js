import { Router } from "express";
import passport from "passport";

export const webSessionRouter = Router();

//login local

webSessionRouter.get("/login", function loginView(req, res) {
  res.render("login.handlebars", {
    pageTitle: "Login",
  });
});

webSessionRouter.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "/login",
  })
);

//login github

webSessionRouter.get(
  "/githublogin",
  passport.authenticate("github", { scope: ["user:email"] })
);

webSessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    successRedirect: "/products",
    failureRedirect: "/login",
  })
);

// logout

webSessionRouter.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.error("Error al cerrar sesión: ", error);
    }
    res.redirect("/login");
  });
});
