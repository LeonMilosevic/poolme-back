const { check } = require("express-validator");

exports.userSignupValidator = [
  check("firstName", "please add first name")
    .not()
    .isEmpty(),
  check("lastName", "please add a last name")
    .not()
    .isEmpty(),
  check("email", "please include a valid email").isEmail(),
  check(
    "password",
    "please enter a password with 6 or more characters"
  ).isLength({
    min: 6
  })
];

exports.postValidator = [
  check("addressFrom", "Where are is your starting point?")
    .not()
    .isEmpty(),
  check("addressTo", "Where is your end destination?")
    .not()
    .isEmpty(),
  check("timeOfDeparture", "what time does your journey start?")
    .not()
    .isEmpty(),
  check("pricePerPassanger", "How much do you charge per person?")
    .not()
    .isEmpty(),
  check("seats", "How much seats does your car have?")
    .not()
    .isEmpty()
];

exports.isEmpty = obj => {
  return Object.keys(obj).length === 0;
};
