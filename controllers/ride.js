const { Ride, BookedUser } = require("../models/ride");
const Post = require("../models/post");
const User = require("../models/user");

exports.rideById = (req, res, next, id) => {
  Ride.findById(id)
    .populate({
      path: "bookedUsers.user",
      populate: {
        path: "user",
        model: "User"
      }
    })
    .exec((error, ride) => {
      if (error || !ride) return res.status(400).json({ error: error });
      req.ride = ride;
      next();
    });
};

exports.read = (req, res) => {
  return res.json(req.ride);
};

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
exports.list = (req, res) => {
  Ride.find(
    { bookedUsers: { $elemMatch: { user: req.profile._id } } },
    (error, result) => {
      if (error) return res.status(400).json({ error: "something went wrong" });
      return res.json(result);
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
  const bookedUser = new BookedUser({ user: req.profile });
  Ride.findOne({ postId: req.body.postId }, (error, resRide) => {
    if (error) return res.status(400).json({ error: "something went wrong" });

    if (resRide === null) {
      const ride = new Ride(req.body);
      ride.bookedUsers.push(bookedUser);

      ride.save((error, data) => {
        if (error)
          return res.status(400).json({ error: "could not book here" });

        return res.json(data);
      });
    } else {
      resRide.bookedUsers.push(bookedUser);

      resRide.save((error, data) => {
        if (error) return res.status(400).json({ error: error });

        return res.json(data);
      });
    }
  });
};
