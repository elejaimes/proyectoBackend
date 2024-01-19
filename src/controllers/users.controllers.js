import passport from "passport";

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
