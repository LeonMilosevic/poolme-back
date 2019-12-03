const Post = require("../models/post");
const { validationResult } = require("express-validator");

exports.uploadPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array().map(error => error.msg)[0] });
  }
  // save post
  const post = new Post({
    from: req.body.from,
    to: req.body.to,
    timeOfDeparture: req.body.timeOfDeparture,
    pricePerPassanger: req.body.pricePerPassanger,
    seats: req.body.seats,
    extraText: req.body.extraText,
    stoppingBy: req.body.stoppingBy
  });

  await post.save();

  res.status(200).json({ success: "posted successfuly" });
};
