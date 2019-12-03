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
  const {
    firstName,
    lastName,
    email,
    password,
    number,
    driversLicense
  } = req.body;
  // check facebook email
  const foundUser = await User.findOne(
    { "facebook.email": req.body.email },
    (error, user) => {
      if (error || user)
        return res
          .status(400)
          .json({ error: "User exists, try to sign in with email" });
      // check local mail
      User.findOne({ "local.email": req.body.email }, (error, user) => {
        if (error || user)
          return res
            .status(400)
            .json({ error: "User exists, try to sign in with facebook" });
      });
    }
  );

  // create new user
  const user = new User({
    method: "local",
    local: { email, password },
    firstName,
    lastName,
    number,
    driversLicense
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
      rating: user.rating,
      verified: user.verified
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
//facebook oath
exports.facebookOAuth = async (req, res) => {
  const token = JWT.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
  const {
    _id,
    facebook: { email, photo }
  } = req.user;

  return res.json({ token, user: { _id, email, photo } });
};

exports.signout = (req, res) => {
  res.json({ message: "signout success" });
};

exports.isVerified = async (req, res, next) => {
  if (!req.user.verified)
    return res.status(401).json({ error: "Please wait to be verified " });
  next();
};
