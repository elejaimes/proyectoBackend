import passport from "passport";
import { UserModel } from "../../models/User.js";

export async function login(req, res, next) {
  passport.authenticate(
    "login",
    { failWithError: true },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json({ status: "error", message: "Login failed" });
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.status(201).json({ status: "success", payload: req.user });
      });
    }
  )(req, res, next);
}

export function getCurrentUser(req, res) {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }

  res
    .status(400)
    .json({ status: "error", message: "No hay una sesión iniciada" });
}

export function logout(req, res) {
  req.logout((error) => {
    if (error) {
      console.error("Error al cerrar sesión: ", error);
    }
    res.json({ status: "success", message: "Logout OK" });
  });
}
export async function register(req, res) {
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
}

export async function resetPassword(req, res) {
  try {
    const updatedUserPassword = await UserModel.resetPassword(
      req.body.email,
      req.body.password
    );
    res.json({ status: "success", payload: updatedUserPassword });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
}

export async function getLoggedUser(req, res) {
  const user = await UserModel.findOne(
    { email: req.user.email },
    { password: 0 }
  ).lean();
  res.json({ status: "success", payload: user });
}

export async function getAllUsers(req, res) {
  const users = await UserModel.find().lean();
  res.json({ status: "success", payload: users });
}
