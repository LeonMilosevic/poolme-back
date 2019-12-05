const express = require("express");
const router = express.Router();

const AuthControler = require("../controllers/auth");

router.get(
  "/user/:userId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  AuthControler.read
);

router.param("userId", AuthControler.userById);

module.exports = router;
