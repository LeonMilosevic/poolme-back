const express = require("express");
const router = express.Router();

const AuthControler = require("../controllers/auth");
const RideControler = require("../controllers/ride");

router.post(
  "/ride/create/:userId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  RideControler.addRideToUserHistory,
  RideControler.decreaseSeats,
  RideControler.createRide
);

router.param("userId", AuthControler.userById);

module.exports = router;
