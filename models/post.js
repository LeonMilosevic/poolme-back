const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    }
  },
  { timestamps: true }
);

// create model
const Post = mongoose.model("post", postSchema);

// export model

module.exports = Post;
