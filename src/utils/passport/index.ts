import ApiError from "@classes/error";
import { SCOPES } from "@services/users/users.constants";
import Users from "@services/users/users.schema";
import { TokenPairs } from "@utils/jwt";
import bcrypt from "bcrypt";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

const { JWT_ISSUER, JWT_AUDIENCE, JWT_ACCESS_SECRET } = process.env;

passport.use(
  "auth.jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
    async function (jwt_payload, done) {
      try {
        const { _id, scopes } = jwt_payload;

        const user = await Users.findById(_id);
        if (!user) {
          done(new ApiError(404, "User is  not found!", false), null);
        }
        done(null, { ...user.toJSON(), scopes });
      } catch (error) {
        done(new ApiError(500, "Bearer service is not available", true), null);
      }
    }
  )
);

passport.use(
  "scope.me",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      passReqToCallback: true,
    },
    async function (req, jwt_payload, done) {
      try {
        const { _id } = jwt_payload;
        const user = await Users.findById(_id);
        if (!user) {
          done(new ApiError(404, "User is  not found!", false), null);
        } else {
          if (_id !== req.params.id) {
            done(
              new ApiError(
                403,
                "You are not authorized for this process.",
                false
              ),
              null
            );
          } else {
            done(null, { ...user.toJSON(), scopes: SCOPES });
          }
        }
      } catch (error) {
        done(new ApiError(500, "Bearer service is not available", true), null);
      }
    }
  )
);

passport.use(
  "auth.login",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async function (_req, email, password, done) {
      try {
        let user = await Users.findOne({ email });
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            done(
              new ApiError(401, "Email or password is not correct.", false),
              null
            );
          }
          delete user["_doc"].password;
          delete user["_doc"].__v;
          const tokens = await TokenPairs({ _id: user._id, scopes: SCOPES });
          done(null, { ...user.toJSON(), ...tokens });
        } else {
          done(new ApiError(404, "User is not found.", false), null);
        }
      } catch (error) {
        done(new ApiError(401, error.message, false), null);
      }
    }
  )
);

passport.use(
  "auth.register",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async function (req, email, _password, done) {
      try {
        let user = await Users.findOne({ email });
        if (user) {
          done(new ApiError(400, "This email is already in use.", false), null);
        } else {
          user = await new Users(req.body).save();
          delete user["_doc"].password;
          delete user["_doc"].__v;
          const tokens = await TokenPairs({ _id: user._id, scopes: SCOPES });
          done(null, { ...user.toJSON(), ...tokens });
        }
      } catch (error) {
        done(new ApiError(401, error.message, false), null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport;
