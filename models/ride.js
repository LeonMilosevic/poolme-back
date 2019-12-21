const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const BookedUserSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User" },
    status: {
      type: String,
      default: "accepted",
      enum: ["accepted", "not accepted"]
    }
  },
  { timestamps: true }
);

const BookedUser = mongoose.model("BookedUser", BookedUserSchema);

const RideSchema = new Schema(
  {
    post_id: String,
    bookedUsers: [BookedUserSchema]
  },
  { timestamps: true }
);

// create model
const Ride = mongoose.model("Ride", RideSchema);

// export model

module.exports = { Ride, BookedUser };
