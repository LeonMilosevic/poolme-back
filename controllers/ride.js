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

exports.ioConnect = socket => {
  const rideId = socket.handshake.headers.referer.slice(33);
  // handle output, send chat messages to client
  socket.on("output", function(fn) {
    Ride.findById(rideId, (error, result) => {
      if (error) return console.log(error);

      fn(result);
    });
  });

  socket.on("input", function(data) {
    let name = data.name;
    let message = data.message;

    if (name === "" || message === "") {
      sendStatus("please enter a message");
    }
    let user = { name, message };
    Ride.findByIdAndUpdate(rideId, { $push: { chat: user } });
  });

  // Ride.findById(rideId, (error, ride) => {
  //   if (error) return res.status(400).json({ error: error });
  //   // function to send status
  //   sendStatus = s => {
  //     socket.emit("status", s);
  //   };

  //   // get chats from mongo collection
  //   socket.emit("output", ride.chat);

  //   // handle input event
  //   socket.on("input", data => {
  //     let name = data.name;
  //     let message = data.message;

  //     // check for name and message
  //     if (name === "" || message === "") {
  //       sendStatus("Please enter a name and message");
  //     } else {
  //       ride.chat.insert({ name, message });
  //       io.emit("output", [data]);

  //       sendStatus({
  //         message: "Message sent",
  //         clear: true
  //       });
  //     }
  //   });
  // });
};
