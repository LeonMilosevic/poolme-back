const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("./models/user");
const { JWT_SECRET } = require("./config");

// jwt strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      console.log(payload);
      try {
        // find user from token
        const user = await User.findById(payload._id);
        if (!user) return done(null, false);
        // handle user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
