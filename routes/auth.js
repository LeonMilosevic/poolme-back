const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConf = require("../passport");

const { userSignupValidator } = require("../helpers");
const AuthControler = require("../controllers/auth");

router.post("/signup", userSignupValidator, AuthControler.signup);
router.post("/signin", AuthControler.signin);

router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  AuthControler.secret
);

module.exports = router;
