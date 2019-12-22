const { Ride, BookedUser } = require("../models/ride");
const Post = require("../models/post");
const User = require("../models/user");

exports.addRideToUserHistory = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { "passenger.history": req.body } },
    (error, response) => {
      if (error)
        return res.status(400).json({ error: "could not update history" });

      next();
    }
  );
};

exports.decreaseSeats = (req, res, next) => {
  Post.findOneAndUpdate(
    { _id: req.body.postId },
    { $inc: { seats: -req.body.seats } },
    (error, response) => {
      if (error)
        return res.status(400).json({ error: "could not update history" });

      next();
    }
  );
};

exports.createRide = (req, res, next) => {
  const bookedUser = new BookedUser(req.profile);

  Ride.findOne({ postId: req.body.postId }, (error, resRide) => {
    if (error) return res.status(400).json({ error: "something went wrong" });

    if (resRide === null) {
      const ride = new Ride(req.body);
      ride.bookedUsers.push(bookedUser);
      ride.save((error, data) => {
        if (error) return res.status(400).json({ error: "could not book" });

        return res.json(data);
      });
    } else {
      resRide.bookedUsers.push(bookedUser);

      resRide.save((error, data) => {
        if (error) return res.status(400).json({ error: "could not book" });

        return res.json(data);
      });
    }
  });
};
