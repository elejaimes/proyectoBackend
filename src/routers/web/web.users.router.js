import { Router } from "express";
import { UserModel } from "../../models/User.js";
import { hashearPassword } from "../../utils/crypto.js";

export const webUsersRouter = Router();

// Registro de usuario

webUsersRouter.get("/register", (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Registro",
  });
});

webUsersRouter.post("/register", async (req, res) => {
  try {
    //encriptar contraseña
    const hashedPassword = await hashearPassword(req.body.password);
    req.body.password = hashedPassword;

    const newUser = await UserModel.create(req.body);

    // Iniciar sesión después de registrar al usuario
    req.login(newUser, (error) => {
      if (error) {
        console.error("Error al iniciar sesión después del registro:", error);
        return res.redirect("/login");
      }

      // Redirigir a la página deseada después del registro y la autenticación
      res.redirect("/products");
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.redirect("/register");
  }

  //sin passport
  //   await UserModel.create(req.body);
  //   res.redirect("/login");
  // } catch (error) {
  //   res.redirect("/register");
  // }
});

// reestablecer contraseña

webUsersRouter.get("/resetpassword", async (req, res) => {
  res.render("resetpassword.handlebars", {
    pageTitle: "Reestablecer contraseña",
  });
});

webUsersRouter.post("/resetpassword", async (req, res) => {
  try {
    //encriptar contraseña
    const hashedPassword = await hashearPassword(req.body.password);
    req.body.password = hashedPassword;

    const updatedUserPassword = await UserModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    ).lean();

    if (!updatedUserPassword) {
      res.render("resetpassword.handlebars", {
        pageTitle: "Reestablecer contraseña",
        errorMessage: "Usuario no encontrado",
      });
    } else {
      // Usuario encontrado y contraseña actualizada con éxito
      console.log("Contraseña actualizada con éxito:", updatedUserPassword);
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.render("resetpassword.handlebars", {
      pageTitle: "Reestablecer contraseña",
      errorMessage: "Hubo un error al procesar la solicitud",
    });
  }
});

// Perfil del usuario en la página de productos

webUsersRouter.get("/products", (req, res) => {
  res.render("products.handlebars", {
    //registeredUser: req.session["registeredUser"], //sin passport
    user: req.user, //con passport
  });
});
