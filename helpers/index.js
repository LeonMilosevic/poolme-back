const { check } = require("express-validator");

exports.userSignupValidator = [
  check("firstName", "please add first name")
    .not()
    .isEmpty(),
  check("lastName", "please add a last name")
    .not()
    .isEmpty(),
  check("email", "please include a valid email").isEmail(),
  check("number", "number must be numerical").isNumeric(),
  check(
    "password",
    "please enter a password with 6 or more characters"
  ).isLength({
    min: 6
  })
];
