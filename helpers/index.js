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

exports.postValidator = [
  check("from", "Where are is your starting point?")
    .not()
    .isEmpty(),
  check("to", "Where is your end destination?")
    .not()
    .isEmpty(),
  check("timeOfDeparture", "what time does your journey start?")
    .not()
    .isEmpty(),
  check("pricePerPassanger", "How much do you charge per person?").isNumeric(),
  check("seats", "How much seats does your car have?").isNumeric()
];
