import { Router } from "express";
import { UserModel } from "../../models/User.js";

export const webSessionRouter = Router();

webSessionRouter.get("/login", function loginView(req, res) {
  res.render("login.handlebars", {
    pageTitle: "Login",
  });
});

webSessionRouter.post("/login", async (req, res) => {
  try {
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
        return res.redirect("/login");
      }

      // deberia encriptar la recibida y comparar con la guardada que ya esta encriptada
      if (password !== registeredUser.password) {
        return res.redirect("/login");
      }

      registeredUserData = {
        email: registeredUser.email,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        rol: "user",
      };
    }

    req.session["registeredUser"] = registeredUserData;
    res.redirect("/products");
  } catch (error) {
    res.redirect("/login");
  }
});

// logout

webSessionRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});
