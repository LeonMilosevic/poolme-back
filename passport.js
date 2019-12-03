const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("./models/user");
const {
  JWT_SECRET,
  oauth: { facebook }
} = require("./config");

// jwt strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
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
// facebook strategy
passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: facebook.clientID,
      clientSecret: facebook.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // if facebook user
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        // check if email is used in local
        const localExistingUser = await User.findOne({
          "local.email": profile.emails[0].value
        });
        if (localExistingUser) return done(null, localExistingUser);
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
            photo: profile.photos[0].value
          },
          name: profile.displayName
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(null, false, error.message);
      }
    }
  )
);
