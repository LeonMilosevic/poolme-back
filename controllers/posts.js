const Post = require("../models/post");
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

exports.uploadPost = async (req, res) => {
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
    extraText: req.body.extraText,
    user: req.user
  });

  await post.save();

  res.status(200).json({ success: "posted successfuly" });
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
