export function loggedUserApi(req, res, next) {
  //sin passport
  // if (!req.session["registeredUser"]) {
  //   return res
  //     .status(400)
  //     .json({ status: "error", message: "necesita iniciar sesion" });
  // }

  //con passport
  if (!req.isAuthenticated()) {
    return res
      .status(400)
      .json({ status: "error", message: "necesita iniciar sesion" });
  }
  next();
}

export function loggedUserWeb(req, res, next) {
  //sin passport
  // if (!req.session["registeredUser"]) {
  //   return res.redirect("/login");
  // }

  //con passport
  if (!req.isAuthenticated()) {
    // Almacena la URL de redirección en la sesión antes de redirigir
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/login");
  }

  next();
}
