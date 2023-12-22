import passport from "passport";

// serializeUser: Convierte el objeto de usuario en una identificación única para almacenar en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserializeUser: Toma la identificación única y la convierte de nuevo en un objeto de usuario
passport.deserializeUser((user, done) => {
  done(null, user);
});

const initializePassport = passport.initialize();
const sessionPassport = passport.session();

export function authentication(req, res, next) {
  initializePassport(req, res, (error) => {
    if (error) {
      return next(error);
    }
    sessionPassport(req, res, next);
  });
}
