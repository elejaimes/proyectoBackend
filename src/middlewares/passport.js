import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { UserModel } from "../models/User.js";
import { GH_CALLBACK_URL, GH_CLIENT_ID, GH_CLIENT_SECRET } from "../config.js";

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: GH_CLIENT_ID,
      clientSecret: GH_CLIENT_SECRET,
      callbackURL: GH_CALLBACK_URL,
    },
    async function verify(accessToken, refreshToken, profile, done) {
      console.log(profile);

      const user = await UserModel.findOne({ email: profile.username });
      if (user) {
        return done(null, {
          ...user.infoPublica(),
          rol: "user",
        });
      }

      try {
        const registeredUser = await UserModel.create({
          email: profile.username,
          password: "(sin especificar)",
          firstName: profile.displayName,
          lastName: "(sin especificar)",
        });
        done(null, {
          ...registeredUser.infoPublica(),
          rol: "user",
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
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
  new LocalStrategy(
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
