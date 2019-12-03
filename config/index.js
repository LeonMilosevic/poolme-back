require("dotenv").config();
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  oauth: {
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }
  }
};
