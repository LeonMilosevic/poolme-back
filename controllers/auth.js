const JWT = require("jsonwebtoken");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
require("dotenv").config();

const signToken = user => {
  return JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

exports.signup = async (req, res, next) => {
  // --check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array().map(error => error.msg)[0] });
  }
  // --end check for errors
  const { firstName, lastName, email, password, number } = req.body;
  // check email
  const foundUser = await User.findOne({ "local.email": req.body.email });

  if (foundUser)
    return res.status(400).json({ error: "Email is already in use" });
  // create new user
  const user = new User({
    local: { email, password },
    firstName,
    lastName,
    number
  });
  await user.save();

  const token = signToken(user);

  // res token
  res.status(200).json({
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      number: user.number,
      rating: user.rating
    }
  });
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ "local.email": email }, async (error, user) => {
    if (error || !user)
      return res
        .status(400)
        .json({ error: "User with that email does not exist" });
    const isMatch = await user.authenticate(password);
    console.log(isMatch);
    // compare password with hashed
    if (!isMatch)
      return res.status(401).json({ error: "Email and password dont match" });

    const token = signToken(user);

    // res token
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        number: user.number,
        rating: user.rating
      }
    });
  });
};

exports.secret = async (req, res, next) => {
  console.log("user secret called");
};
