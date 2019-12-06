const JWT = require("jsonwebtoken");
const User = require("../models/user");
const expressJwt = require("express-jwt");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
require("dotenv").config();

const signToken = user => {
  return JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user)
      return res.status(400).json({ error: "User not found" });

    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;

  return res.json(req.profile);
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

  // check facebook email
  User.findOne({ "facebook.email": req.body.email }, (error, user) => {
    if (error || user)
      return res
        .status(400)
        .json({ error: "User exists, try to sign in with email" });
  });
  User.findOne({ "local.email": req.body.email }, (error, user) => {
    if (error || user) {
      return res
        .status(400)
        .json({ error: "User exists, try to sign in with facebook" });
    }
  });

  try {
    const user = new User({
      method: "local",
      local: { email: req.body.email, password: req.body.password },
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    await user.save();

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.local.email,
        phoneNumber: user.phoneNumber,
        driver: user.driver,
        passenger: user.passenger
      }
    });
  } catch (error) {
    console.log(error.errmsg);
  }
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

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.local.email,
        phoneNumber: user.phoneNumber,
        driver: user.driver,
        passenger: user.passenger
      }
    });
  });
};
//facebook oath
exports.facebookOAuth = async (req, res) => {
  const token = JWT.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  return res.json({
    token,
    user: {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      email: req.user.facebook.email,
      photo: req.user.facebook.photo,
      driver: req.user.driver,
      passenger: req.user.passenger
    }
  });
};

exports.signout = (req, res) => {
  res.json({ message: "signout success" });
};

exports.isVerified = async (req, res, next) => {
  if (!req.user.verified)
    return res.status(401).json({ error: "Please wait to be verified " });
  next();
};

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) return res.status(403).json({ error: "Access denied" });
  next();
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
