const express = require("express");
const router = express.Router();

const AuthControler = require("../controllers/auth");
const UserControler = require("../controllers/user");
router.get(
  "/user/:userId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  AuthControler.read
);

router.post(
  "/user/driver/license/:userId",
  AuthControler.requireSignin,
  AuthControler.isAuth,
  UserControler.uploadLicense
);

router.param("userId", AuthControler.userById);

module.exports = router;
