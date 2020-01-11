const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const BookedUserSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "user",
      required: true
    },
    status: {
      type: String,
      default: "accepted",
      enum: ["accepted", "not accepted"]
    }
  },
  { timestamps: true }
);

const BookedUser = mongoose.model("BookedUser", BookedUserSchema);

const postSchema = new Schema(
  {
    addressFrom: {
      type: String,
      lowercase: true,
      required: true
    },
    addressFromLatLng: {
      lat: Number,
      lng: Number
    },
    addressTo: {
      type: String,
      lowercase: true,
      required: true
    },
    addressToLatLng: {
      lat: Number,
      lng: Number
    },
    stoppingBy: {
      type: String,
      lowercase: true
    },
    stoppingByLatLng: {
      lat: Number,
      lng: Number
    },
    distance: {
      type: String,
      required: true
    },
    timeOfDeparture: {
      type: String,
      required: true
    },
    pricePerPassanger: {
      type: Number,
      required: true
    },
    seats: {
      type: Number,
      required: true
    },
    extraText: {
      type: String,
      trim: true,
      max: 150
    },
    petsAllowed: String,
    smokingAllowed: String,
    twoPeopleInTheBack: String,
    user: {
      type: ObjectId,
      ref: "user",
      required: true
    },
    ride: {
      bookedUsers: [BookedUserSchema],
      chat: Array
    }
  },
  { timestamps: true }
);

// create model
const Post = mongoose.model("post", postSchema);

// export model

module.exports = { Post, BookedUser };
