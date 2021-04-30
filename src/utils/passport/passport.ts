import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { Strategy as LocalStrategy } from "passport-local";

import passport from "passport";

import bcrypt from "bcrypt";

import ApiError from "@classes/ApiError/ApiError";

import { TokenPairs } from "@utils/jwt/jwt";

import Users from "@services/users/users.schema";

const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["accessToken"];
  }
  return token;
};
const { JWT_ISSUER, JWT_AUDIENCE, JWT_ACCESS_SECRET } = process.env;

passport.use(
  "auth.jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: JWT_ACCESS_SECRET,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
    async function (jwt_payload, done) {
      try {
        const { _id } = jwt_payload;
        const user = await Users.findById(_id);
        if (!user) {
          done(new ApiError(404, "User is  not found!", false), null);
        }
        done(null, user.toJSON());
      } catch (error) {
        console.log(error);
        done(new ApiError(500, "Bearer service is not available", true), null);
      }
    }
  )
);

passport.use(
  "scope.me",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
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
            done(null, user.toJSON());
          }
        }
      } catch (error) {
        console.log(error);
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
          const tokens = await TokenPairs({ _id: user._id });
          done(null, { ...user.toJSON(), ...tokens });
        } else {
          done(new ApiError(404, "User is not found.", false), null);
        }
      } catch (error) {
        done(error, null);
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
          const tokens = await TokenPairs({ _id: user._id });
          done(null, { ...user.toJSON(), ...tokens });
        }
      } catch (error) {
        done(error, null);
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
