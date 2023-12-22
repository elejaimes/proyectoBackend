import { Router } from "express";
import { UserModel } from "../../models/User.js";
import { comparePassword } from "../../utils/crypto.js";

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
        return res.status(401).json({ message: "Invalid email or password" });
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
    //con passport
    req.login(registeredUserData, (error) => {
      if (error) {
        return res.redirect("/login");
      }
      res.status(200).json({ redirect: "/products" }); // Devuelve la ruta de redirección
    });

    //sin passport
    // req.session["registeredUser"] = registeredUserData;
    // console.log(req.session);
    // res.status(200).json({ redirect: "/products" }); // Devuelve la ruta de redirección
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// logout

//con passport
webSessionRouter.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.error("Error al cerrar sesión: ", error);
    }
    res.redirect("/login");
  });
});

//sin passport
// webSessionRouter.post("/logout", (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       console.error("Error destroying session:", error);
//     } else {
//       console.log("Session destroyed successfully");
//     }
//     res.redirect("/login");
//   });
// });
