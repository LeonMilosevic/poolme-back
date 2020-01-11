const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConf = require("../passport");

const AuthControler = require("../controllers/auth");
const PostsControler = require("../controllers/posts");
const { postValidator } = require("../helpers");

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  postValidator,
  PostsControler.uploadPost
);

router.post(
  "/posts/book",
  passport.authenticate("jwt", { session: false }),
  PostsControler.decreaseSeats,
  PostsControler.bookRide
);

router.get("/posts", PostsControler.listPosts);
router.get("/posts/:postById", PostsControler.read);

router.param("postById", PostsControler.postById);
router.param("userId", AuthControler.userById);

module.exports = router;
