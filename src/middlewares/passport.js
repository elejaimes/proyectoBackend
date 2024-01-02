import passport from "passport";
import { Strategy } from "passport-local";
import { UserModel } from "../models/User.js";

passport.use(
  "register",
  new Strategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    async (req, _u, _p, done) => {
      try {
        const registeredUser = await UserModel.register(req.body);
        done(null, registeredUser);
      } catch (error) {
        done(null, false, error.message);
      }
    }
  )
);

passport.use(
  "login",
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const registeredUserData = await UserModel.auth(email, password);
        done(null, registeredUserData);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  )
);

// serializeUser: Convierte el objeto de usuario en una identificación única para almacenar en la sesión
passport.serializeUser((user, next) => {
  next(null, user);
});

// deserializeUser: Toma la identificación única y la convierte de nuevo en un objeto de usuario
passport.deserializeUser((user, next) => {
  next(null, user);
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
