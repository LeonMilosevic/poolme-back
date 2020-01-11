const { Post, BookedUser } = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("user")
    .exec((error, post) => {
      if (error || !post)
        return res.status(400).json({ error: "Post not found" });

      req.post = post;
      next();
    });
};

// POST READ
exports.read = (req, res) => {
  return res.json(req.post);
};

exports.uploadPost = async (req, res, next) => {
  // checking express validator for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ error: errors.array().map(error => error.msg)[0] });
  }
  // save post
  const post = new Post({
    addressFrom: req.body.addressFrom,
    addressFromLatLng: req.body.addressFromLatLng,
    addressTo: req.body.addressTo,
    addressToLatLng: req.body.addressToLatLng,
    stoppingBy: req.body.stoppingBy,
    stoppingByLatLng: req.body.stoppingByLatLng,
    timeOfDeparture: req.body.timeOfDeparture,
    pricePerPassanger: req.body.pricePerPassanger,
    seats: req.body.seats,
    distance: req.body.distance,
    extraText: req.body.extraText,
    user: req.user
  });
  // add the user who posted to bookeduser reference
  const bookedUser = new BookedUser({ user: req.user._id });

  post.ride.bookedUsers.push(bookedUser);

  await post.save();
  // add the post to user history
  User.findByIdAndUpdate(
    req.user._id,
    { $push: { history: post } },
    (error, response) => {
      if (error)
        return res.status(400).json({ error: "could not update history" });

      return res.status(200).json({ success: "posted successfuly" });
    }
  );
};

exports.decreaseSeats = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $inc: { seats: -req.body.seats } },
    (error, response) => {
      if (error)
        return res.status(400).json({ error: "could not update seats" });

      next();
    }
  );
};

exports.bookRide = (req, res) => {
  // add a new user who booked the ride to bookeduser reference
  const bookedUser = new BookedUser({ user: req.user._id });
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { "ride.bookedUsers": bookedUser } },
    (error, response) => {
      if (error) return res.status(400).json({ error: "could not book" });
      // add the post to user history
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { history: response } },
        (error, result) => {
          if (error)
            return res.status(400).json({ error: "could not add to history" });

          return res.status(200).json({ success: "booked successfully" });
        }
      );
    }
  );
};

exports.listPosts = (req, res, next) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Post.find()
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((error, posts) => {
      if (error) return res.status(400).json({ error: "Posts not found" });

      res.json(posts);
    });
};
