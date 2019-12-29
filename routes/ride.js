const express = require("express");
const router = express.Router();

const AuthControler = require("../controllers/auth");
const RideControler = require("../controllers/ride");

router.post(
  "/ride/create/:userId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  RideControler.decreaseSeats,
  RideControler.addRideToUserHistory,
  RideControler.createRide
);
router.get(
  "/ride/list/:userId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  RideControler.list
);

router.get(
  "/ride/read/:userId/:rideId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  RideControler.read
);
router.param("userId", AuthControler.userById);
router.param("rideId", RideControler.rideById);

module.exports = router;
